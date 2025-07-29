namespace MonkeyAndRiver_Health_Forge.Data
{
	public class RegisterDTO
	{
		public string Email { get; set; }
		public string Password { get; set; }

		public string Name { get; set; }


	}

	public class LoginDTO
	{
		public string Email { get; set; }
		public string Password { get; set; }
	}

}
