using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MonkeyAndRiver_Health_Forge.Models;
using MonkeyAndRiver_Health_Forge.Services;

namespace MonkeyAndRiver_Health_Forge.Data
{
	public static class DbInitializer
	{
		public static async Task SeedAsync(IServiceProvider serviceProvider)
		{
			using var scope = serviceProvider.CreateScope();
			var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
			var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

			// Ensure DB is created and up to date
			await context.Database.MigrateAsync();

			// Seed Admin User
			var adminEmail = "admin@healthforge.com";
			var adminPassword = "Admin@1234"; 

			if (await userManager.FindByEmailAsync(adminEmail) == null)
			{
				var adminUser = new AppUser
				{
					UserName = adminEmail,
					Email = adminEmail,
					EmailConfirmed = true
				};

				var result = await userManager.CreateAsync(adminUser, adminPassword);

				if (!result.Succeeded)
				{
					throw new Exception("Failed to create admin user: " + string.Join(", ", result.Errors.Select(e => e.Description)));
				}
			}

			// Seed Diagnostic Tests
			if (!context.DiagnosticTests.Any())
			{
				context.DiagnosticTests.AddRange(new List<DiagnosticTest>
				{
					new DiagnosticTest {
						Name = "John Doe",
						Email = "john@example.com",
						Date = DateTime.UtcNow,
						Result = "Low Risk",
						AiEvaluation = "User appears healthy with no known risks.",
						RawInput = "No pre-existing conditions, non-smoker",
						Status = "Approved"
					},
					new DiagnosticTest {
						Name = "Jane Smith",
						Email = "jane@example.com",
						Date = DateTime.UtcNow,
						Result = "High Risk",
						AiEvaluation = "AI detected chronic symptoms indicative of elevated risk.",
						RawInput = "Asthma, recent hospitalization",
						Status = "Rejected"
					},
					new DiagnosticTest {
						Name = "Bob Marley",
						Email = "bob@music.com",
						Date = DateTime.UtcNow,
						Result = "Pending",
						AiEvaluation = "Awaiting evaluation...",
						RawInput = "Not yet reviewed",
						Status = "Pending"
					}
				});

				await context.SaveChangesAsync();
			}
		}
	}
}
