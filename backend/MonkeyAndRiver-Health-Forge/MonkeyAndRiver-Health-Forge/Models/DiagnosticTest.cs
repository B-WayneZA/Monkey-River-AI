using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace MonkeyAndRiver_Health_Forge.Models
{
	public class DiagnosticTest
	{
		public int Id { get; set; }

		[Required]
		[StringLength(200)]
		public string Name { get; set; }

		[Required]
		[EmailAddress]
		[StringLength(256)]
		public string Email { get; set; }

		public DateTime Date { get; set; } = DateTime.UtcNow;

		[Column(TypeName = "nvarchar(max)")] // For SQL Server JSON storage
		public string HealthInfoJson { get; set; }  // Store as JSON string

		[StringLength(4000)]
		public string AdditionalNotes { get; set; }

		[StringLength(4000)]
		public string AiEvaluation { get; set; }

		[Required]
		[StringLength(50)]
		public string Status { get; set; } = "Pending";

		[Required]
		public string AppUserId { get; set; }

		public AppUser AppUser { get; set; }

		// Helper property for easy access to health info
		[NotMapped]
		public HealthInformation HealthInfo
		{
			get => string.IsNullOrEmpty(HealthInfoJson)
				? new HealthInformation()
				: JsonSerializer.Deserialize<HealthInformation>(HealthInfoJson);
			set => HealthInfoJson = JsonSerializer.Serialize(value);
		}
	}
}
