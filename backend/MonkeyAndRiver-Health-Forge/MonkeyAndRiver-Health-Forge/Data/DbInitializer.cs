using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MonkeyAndRiver_Health_Forge.Models;
using System.Text.Json;

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

			// Create roles
			var roles = new[] { "Admin", "User", "MedicalProfessional" };
			foreach (var role in roles)
			{
				if (!await roleManager.RoleExistsAsync(role))
				{
					await roleManager.CreateAsync(new IdentityRole(role));
				}
			}

			// Create admin user
			var adminEmail = "admin@healthforge.com";
			var adminPassword = "Admin@1234";
			var adminUser = await userManager.FindByEmailAsync(adminEmail);

			if (adminUser == null)
			{
				adminUser = new AppUser
				{
					UserName = adminEmail,
					Email = adminEmail,
					EmailConfirmed = true,
					Name = "System Administrator"
				};
				await userManager.CreateAsync(adminUser, adminPassword);
				await userManager.AddToRolesAsync(adminUser, new[] { "Admin", "MedicalProfessional" });
			}

			// Create test users
			var testUser1 = await CreateTestUser(userManager, "patient1@healthforge.com", "Patient1@123", "John Doe");
			var testUser2 = await CreateTestUser(userManager, "patient2@healthforge.com", "Patient2@123", "Jane Smith");
			var doctorUser = await CreateTestUser(userManager, "doctor@healthforge.com", "Doctor@123", "Dr. Emily Johnson", "MedicalProfessional");

			// Seed diagnostic tests
			if (!context.DiagnosticTests.Any())
			{
				var now = DateTime.UtcNow;

				context.DiagnosticTests.AddRange(
					new DiagnosticTest
					{
						Name = "John Doe",
						Email = testUser1.Email,
						HealthInfo = new HealthInformation
						{
							Age = 45,
							Gender = "Male",
							Height = 178,
							Weight = 85,
							BloodPressure = "140/90",
							Cholesterol = "LDL: 145, HDL: 42",
							Medications = "Lisinopril 10mg daily",
							Allergies = "Penicillin",
							HealthConditions = new List<string> { "Hypertension" }
						},
						AdditionalNotes = "Occasional chest discomfort during exercise",
						AiEvaluation = "Patient shows risk factors for cardiovascular disease. Recommended: Stress test and lipid profile. Blood pressure management needed.",
						Status = "Completed",
						AppUserId = testUser1.Id,
						Date = now.AddDays(-10)
					},
					new DiagnosticTest
					{
						Name = "Jane Smith",
						Email = testUser2.Email,
						HealthInfo = new HealthInformation
						{
							Age = 32,
							Gender = "Female",
							Height = 165,
							Weight = 62,
							BloodPressure = "110/70",
							Cholesterol = "LDL: 95, HDL: 55",
							Medications = "Vitamin D supplement",
							Allergies = "None",
							HealthConditions = new List<string> { "Asthma", "Anxiety" }
						},
						AdditionalNotes = "Increased asthma symptoms during allergy season",
						AiEvaluation = "Well-managed conditions. Recommend allergy testing and review of inhaler technique. Consider seasonal allergy medication.",
						Status = "Reviewed",
						AppUserId = testUser2.Id,
						Date = now.AddDays(-5)
					},
					new DiagnosticTest
					{
						Name = "Admin Test",
						Email = adminUser.Email,
						HealthInfo = new HealthInformation
						{
							Age = 38,
							Gender = "Male",
							Height = 180,
							Weight = 78,
							BloodPressure = "125/80",
							Cholesterol = "LDL: 110, HDL: 50",
							Medications = "None",
							Allergies = "Shellfish",
							HealthConditions = new List<string>()
						},
						AdditionalNotes = "Routine annual checkup",
						AiEvaluation = "Good overall health. Maintain current lifestyle. Recommended annual physical.",
						Status = "Completed",
						AppUserId = adminUser.Id,
						Date = now.AddDays(-3)
					},
					new DiagnosticTest
					{
						Name = "Dr. Emily Johnson",
						Email = doctorUser.Email,
						HealthInfo = new HealthInformation
						{
							Age = 41,
							Gender = "Female",
							Height = 170,
							Weight = 65,
							BloodPressure = "118/75",
							Cholesterol = "LDL: 98, HDL: 62",
							Medications = "Multivitamin",
							Allergies = "None",
							HealthConditions = new List<string>()
						},
						AdditionalNotes = "Professional health assessment",
						AiEvaluation = "Excellent health markers. No concerns identified. Continue current health maintenance routine.",
						Status = "Completed",
						AppUserId = doctorUser.Id,
						Date = now.AddDays(-1)
					}
				);

				await context.SaveChangesAsync();
			}
		}

		private static async Task<AppUser> CreateTestUser(
			UserManager<AppUser> userManager,
			string email,
			string password,
			string fullName = "",
			string role = "User")
		{
			var user = await userManager.FindByEmailAsync(email);
			if (user == null)
			{
				user = new AppUser
				{
					UserName = email,
					Email = email,
					EmailConfirmed = true,
					Name = fullName
				};
				await userManager.CreateAsync(user, password);
				await userManager.AddToRoleAsync(user, role);
			}
			return user;
		}
	}
}