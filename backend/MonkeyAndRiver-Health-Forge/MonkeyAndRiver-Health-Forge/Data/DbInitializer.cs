using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MonkeyAndRiver_Health_Forge.Models;

namespace MonkeyAndRiver_Health_Forge.Services
{
	public static class DbInitializer
	{
		public static async Task SeedAsync(IServiceProvider serviceProvider)
		{
			using var scope = serviceProvider.CreateScope();
			var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
			var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
			var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

			await context.Database.MigrateAsync();

			
			var roles = new[] { "Admin", "User" };
			foreach (var role in roles)
			{
				if (!await roleManager.RoleExistsAsync(role))
				{
					await roleManager.CreateAsync(new IdentityRole(role));
				}
			}

			
			var adminEmail = "admin@healthforge.com";
			var adminPassword = "Admin@1234";
			var adminUser = await userManager.FindByEmailAsync(adminEmail);

			if (adminUser == null)
			{
				adminUser = new AppUser
				{
					UserName = adminEmail,
					Email = adminEmail,
					EmailConfirmed = true
				};
				await userManager.CreateAsync(adminUser, adminPassword);
				await userManager.AddToRoleAsync(adminUser, "Admin");
			}

		
			var testUser1 = await CreateTestUser(userManager, "patient1@healthforge.com", "Patient1@123");
			var testUser2 = await CreateTestUser(userManager, "patient2@healthforge.com", "Patient2@123");

			
			if (!context.DiagnosticTests.Any())
			{
				context.DiagnosticTests.AddRange(
					new DiagnosticTest
					{
						Name = "John Doe",
						Email = testUser1.Email,
						Result = "Low Risk",
						AiEvaluation = "Evaluation OK",
						RawInput = "No known conditions",
						Status = "Approved",
						AppUserId = testUser1.Id,
						Date = DateTime.UtcNow
					},
					new DiagnosticTest
					{
						Name = "Jane Smith",
						Email = testUser2.Email,
						Result = "High Risk",
						AiEvaluation = "Detected severe issues",
						RawInput = "Chronic symptoms",
						Status = "Rejected",
						AppUserId = testUser2.Id,
						Date = DateTime.UtcNow
					},
					new DiagnosticTest
					{
						Name = "Admin Test",
						Email = adminUser.Email,
						Result = "Medium Risk",
						AiEvaluation = "Needs follow up",
						RawInput = "Admin test case",
						Status = "Pending",
						AppUserId = adminUser.Id,
						Date = DateTime.UtcNow
					}
				);
				await context.SaveChangesAsync();
			}
		}

		private static async Task<AppUser> CreateTestUser(UserManager<AppUser> userManager,
			string email, string password)
		{
			var user = await userManager.FindByEmailAsync(email);
			if (user == null)
			{
				user = new AppUser
				{
					UserName = email,
					Email = email,
					EmailConfirmed = true
				};
				await userManager.CreateAsync(user, password);
				await userManager.AddToRoleAsync(user, "User");
			}
			return user;
		}
	}
}
