using Microsoft.AspNetCore.Identity;

namespace MonkeyAndRiver_Health_Forge.Models
{
	public class AppUser : IdentityUser
	{
		public ICollection<DiagnosticTest> DiagnosticTests { get; set; }
	}
}
