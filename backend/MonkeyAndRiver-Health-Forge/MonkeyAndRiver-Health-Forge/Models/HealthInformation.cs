using System.ComponentModel.DataAnnotations;

namespace MonkeyAndRiver_Health_Forge.Models
{
	public class HealthInformation
	{
		[Range(1, 120)]
		public int Age { get; set; }

		[Required]
		public string Gender { get; set; }

		[Range(50, 250)]
		public double Height { get; set; } // in cm

		[Range(10, 300)]
		public double Weight { get; set; } // in kg
		public string BloodPressure { get; set; }
		public string Cholesterol { get; set; }
		public string Medications { get; set; }
		public string Allergies { get; set; }

		public List<string> HealthConditions { get; set; } = new List<string>();
	}
}