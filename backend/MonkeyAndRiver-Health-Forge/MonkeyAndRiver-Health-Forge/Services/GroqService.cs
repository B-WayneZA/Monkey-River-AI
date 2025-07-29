using System.Net.Http.Headers;
using System.Text.Json;
using System.Text;
using System.Text.Json.Serialization;
using MonkeyAndRiver_Health_Forge.Models;

namespace MonkeyAndRiver_Health_Forge.Services
{
	public class GroqService
	{
		private readonly HttpClient _http;
		private readonly IConfiguration _config;
		private readonly ILogger<GroqService> _logger;

		public GroqService(IHttpClientFactory factory,
						 IConfiguration config,
						 ILogger<GroqService> logger)
		{
			_config = config;
			_logger = logger;
			_http = factory.CreateClient();

			_http.BaseAddress = new Uri("https://api.groq.com/");
			var apiKey = _config["Groq:ApiKey"] ?? throw new InvalidOperationException("Groq API key is not configured");

			_http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
			_http.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
			_http.DefaultRequestHeaders.Add("User-Agent", "HealthForge/1.0");
		}

		public async Task<string> GetHealthEvaluationAsync(DiagnosticTest diagnosticTest)
		{
			var prompt = BuildHealthPrompt(diagnosticTest);
			return await GetChatCompletionAsync(prompt, "health");
		}

		public async Task<string> GetChatCompletionAsync(string prompt, string context = "general")
		{
			var systemMessage = context switch
			{
				"health" => "You are an expert medical assistant. Provide clear, concise health advice " +
						   "based on the patient information. Include:\n" +
						   "1. Risk factor analysis\n" +
						   "2. Recommended follow-up actions\n" +
						   "3. Lifestyle recommendations\n" +
						   "4. Any urgent concerns\n\n" +
						   "Use professional but understandable language. Do not provide definitive diagnoses.",
				_ => "You are a helpful assistant. Provide clear, concise information."
			};

			var requestBody = new GroqRequest
			{
				Model = "llama3-70b-8192",
				Messages = new[]
				{
					new GroqMessage { Role = "system", Content = systemMessage },
					new GroqMessage { Role = "user", Content = prompt }
				},
				Temperature = 0.7f,
				MaxTokens = 1500,
				TopP = 1,
				Stream = false
			};

			return await SendGroqRequestAsync(requestBody);
		}

		// Services/GroqService.cs
		private string BuildHealthPrompt(DiagnosticTest test)
		{
			var healthInfo = test.HealthInfo;
			var sb = new StringBuilder();

			sb.AppendLine("## Patient Health Evaluation Request");
			sb.AppendLine("### Basic Information");
			sb.AppendLine($"- Age: {healthInfo.Age}");
			sb.AppendLine($"- Gender: {healthInfo.Gender}");
			sb.AppendLine($"- Height: {healthInfo.Height} cm");
			sb.AppendLine($"- Weight: {healthInfo.Weight} kg");

			if (!string.IsNullOrEmpty(healthInfo.BloodPressure))
				sb.AppendLine($"- Blood Pressure: {healthInfo.BloodPressure}");

			if (!string.IsNullOrEmpty(healthInfo.Cholesterol))
				sb.AppendLine($"- Cholesterol: {healthInfo.Cholesterol}");

			if (!string.IsNullOrEmpty(healthInfo.Medications))
				sb.AppendLine($"- Medications: {healthInfo.Medications}");

			if (!string.IsNullOrEmpty(healthInfo.Allergies))
				sb.AppendLine($"- Allergies: {healthInfo.Allergies}");

			if (healthInfo.HealthConditions != null && healthInfo.HealthConditions.Any())
				sb.AppendLine($"- Health Conditions: {string.Join(", ", healthInfo.HealthConditions)}");

			if (!string.IsNullOrEmpty(test.AdditionalNotes))
			{
				sb.AppendLine("\n### Additional Notes");
				sb.AppendLine(test.AdditionalNotes);
			}

			sb.AppendLine("\nPlease provide a thorough health evaluation based on this information.");
			return sb.ToString();
		}

		private async Task<string> SendGroqRequestAsync(GroqRequest request)
		{
			try
			{
				var jsonOptions = new JsonSerializerOptions
				{
					PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
					DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
				};

				var jsonContent = JsonSerializer.Serialize(request, jsonOptions);
				_logger.LogDebug("Sending request to Groq API: {Content}", jsonContent);

				var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");
				var response = await _http.PostAsync("openai/v1/chat/completions", content);

				if (!response.IsSuccessStatusCode)
				{
					var errorContent = await response.Content.ReadAsStringAsync();
					_logger.LogError("Groq API request failed with status {StatusCode}: {Content}",
						response.StatusCode, errorContent);
					throw new HttpRequestException($"Groq API request failed: {response.StatusCode}");
				}

				var responseContent = await response.Content.ReadAsStringAsync();
				using var jsonDoc = JsonDocument.Parse(responseContent);

				if (!jsonDoc.RootElement.TryGetProperty("choices", out var choices) ||
					choices.GetArrayLength() == 0)
				{
					throw new InvalidOperationException("Invalid response format from Groq API");
				}

				return choices[0].GetProperty("message").GetProperty("content").GetString()
					?? "No response content available";
			}
			catch (Exception ex) when (ex is not HttpRequestException)
			{
				_logger.LogError(ex, "Error processing Groq API response");
				throw new InvalidOperationException("Failed to process AI service response", ex);
			}
		}

		private class GroqRequest
		{
			public string Model { get; set; }
			public GroqMessage[] Messages { get; set; }
			public float Temperature { get; set; }
			public int MaxTokens { get; set; }
			public int TopP { get; set; }
			public bool Stream { get; set; }
		}

		private class GroqMessage
		{
			public string Role { get; set; }
			public string Content { get; set; }
		}
	}
}