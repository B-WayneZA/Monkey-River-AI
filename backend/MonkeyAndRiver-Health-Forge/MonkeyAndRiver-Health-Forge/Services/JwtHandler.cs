using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MonkeyAndRiver_Health_Forge.Models; 

public class JwtHandler
{
	private readonly IConfiguration _config;

	public JwtHandler(IConfiguration config)
	{
		_config = config;
	}

	public string GenerateToken(AppUser user, IList<string> roles)
	{
		
		var claims = new List<Claim>
		{
			new Claim(JwtRegisteredClaimNames.Sub, user.Email ?? string.Empty),
			new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
			new Claim(ClaimTypes.NameIdentifier, user.Id),
			new Claim(ClaimTypes.Name, user.UserName ?? string.Empty)
		};

	
		foreach (var role in roles)
		{
			claims.Add(new Claim(ClaimTypes.Role, role));
		}

		var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Tokens:Key"] ?? throw new Exception("JWT Key not configured")));
		var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

		var token = new JwtSecurityToken(
			issuer: _config["Tokens:Issuer"],
			audience: _config["Tokens:Audience"],
			claims: claims,
			expires: DateTime.UtcNow.AddHours(2),
			signingCredentials: creds
		);

		return new JwtSecurityTokenHandler().WriteToken(token);
	}
}
