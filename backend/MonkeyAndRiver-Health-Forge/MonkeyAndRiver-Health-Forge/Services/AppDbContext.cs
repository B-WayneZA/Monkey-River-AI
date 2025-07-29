// Services/AppDbContext.cs
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MonkeyAndRiver_Health_Forge.Models;
using System.Text.Json;

namespace MonkeyAndRiver_Health_Forge.Services
{
	public class AppDbContext : IdentityDbContext<AppUser>
	{
		public DbSet<DiagnosticTest> DiagnosticTests { get; set; }

		public AppDbContext(DbContextOptions<AppDbContext> options)
			: base(options)
		{
		}

		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);

			builder.Entity<DiagnosticTest>(entity =>
			{
				entity.HasKey(d => d.Id);

				entity.Property(d => d.Name)
					.IsRequired()
					.HasMaxLength(200);

				entity.Property(d => d.Email)
					.IsRequired()
					.HasMaxLength(256);

				entity.Property(d => d.AiEvaluation)
					.HasMaxLength(4000);

				entity.Property(d => d.Status)
					.HasDefaultValue("Pending")
					.HasMaxLength(50);

				entity.Property(d => d.AdditionalNotes)
					.HasMaxLength(4000);

				entity.Property(d => d.HealthInfoJson)
					.HasColumnType("nvarchar(max)");

				// Make AppUserId nullable to support anonymous users
				entity.Property(d => d.AppUserId)
					.IsRequired(false); // This explicitly allows NULL values

				entity.HasOne(d => d.AppUser)
					.WithMany(u => u.DiagnosticTests)
					.HasForeignKey(d => d.AppUserId)
					.OnDelete(DeleteBehavior.SetNull);
			});
		}
	}
}