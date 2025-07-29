// Services/DiagnosticService.cs
using MonkeyAndRiver_Health_Forge.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace MonkeyAndRiver_Health_Forge.Services
{
	public class DiagnosticService
	{
		private readonly AppDbContext _context;
		private readonly GroqService _groqService;
		private readonly ILogger<DiagnosticService> _logger;

		public DiagnosticService(
			AppDbContext context,
			GroqService groqService,
			ILogger<DiagnosticService> logger)
		{
			_context = context;
			_groqService = groqService;
			_logger = logger;
		}

		public async Task<DiagnosticTest> SubmitDiagnosticTest(DiagnosticTest test)
		{
			try
			{

				test.Status = "Processing";
				_context.DiagnosticTests.Add(test);
				await _context.SaveChangesAsync();

				
				test.AiEvaluation = await _groqService.GetHealthEvaluationAsync(test);
				test.Status = "Completed";

				
				_context.DiagnosticTests.Update(test);
				await _context.SaveChangesAsync();

				return test;
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error processing diagnostic test");
				test.Status = "Failed";

				if (test.Id > 0)
				{
					_context.DiagnosticTests.Update(test);
					await _context.SaveChangesAsync();
				}

				throw;
			}
		}
	}
}