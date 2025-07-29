namespace MonkeyAndRiver_Health_Forge.Models
{
	public class DiagnosticTest
	{
		public int Id { get; set; }
		public string Name { get; set; } 
		public string Email { get; set; }
		public DateTime Date { get; set; } = DateTime.UtcNow;
		public string Result { get; set; } 
		public string AiEvaluation { get; set; }
		public string RawInput { get; set; } 
		public string Status { get; set; }
		public string AppUserId { get; set; }
		public AppUser AppUser { get; set; }
	}
}
