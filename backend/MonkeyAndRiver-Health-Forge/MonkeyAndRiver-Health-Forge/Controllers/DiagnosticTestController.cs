// Controllers/DiagnosticTestController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MonkeyAndRiver_Health_Forge.Models;
using MonkeyAndRiver_Health_Forge.Services;
using System.Security.Claims;
using System.Text.Json;

namespace MonkeyAndRiver_Health_Forge.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class DiagnosticTestController : ControllerBase
	{
		private readonly DiagnosticService _diagnosticService;

		public DiagnosticTestController(DiagnosticService diagnosticService)
		{
			_diagnosticService = diagnosticService;
		}


		[AllowAnonymous]
		[HttpPost("submit")]
		public async Task<ActionResult<DiagnosticTest>> SubmitTest(DiagnosticTestDto testDto)
		{
			string? userId = null;
			if (User.Identity?.IsAuthenticated == true)
			{
				userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			}

			var test = new DiagnosticTest
			{
				Name = testDto.Name,
				Email = testDto.Email,
				AdditionalNotes = testDto.AdditionalNotes,
				AppUserId = userId, // This will be null for anonymous users
				HealthInfo = new HealthInformation
				{
					Age = testDto.Age,
					Gender = testDto.Gender,
					Height = testDto.Height,
					Weight = testDto.Weight,
					BloodPressure = testDto.BloodPressure,
					Cholesterol = testDto.Cholesterol,
					Medications = testDto.Medications,
					Allergies = testDto.Allergies,
					HealthConditions = testDto.HealthConditions
				}
			};

			try
			{
				var result = await _diagnosticService.SubmitDiagnosticTest(test);
				return Ok(result);
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Error submitting test: {ex.Message}");
			}
		}
	}

	public class DiagnosticTestDto
	{
		public string Name { get; set; }
		public string Email { get; set; }
		public int Age { get; set; }
		public string Gender { get; set; }
		public double Height { get; set; }
		public double Weight { get; set; }
		public string BloodPressure { get; set; }
		public string Cholesterol { get; set; }
		public string Medications { get; set; }
		public string Allergies { get; set; }
		public List<string> HealthConditions { get; set; } = new List<string>();
		public string AdditionalNotes { get; set; }
	}
}