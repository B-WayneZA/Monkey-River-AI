using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MonkeyAndRiver_Health_Forge.Models;

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
				entity.Property(d => d.Name).IsRequired();
				entity.Property(d => d.Email).IsRequired();
				entity.Property(d => d.AiEvaluation).HasMaxLength(4000);
				entity.Property(d => d.Status).HasDefaultValue("Pending");
			});

			// You can seed an admin here if needed
		}
	}
}
