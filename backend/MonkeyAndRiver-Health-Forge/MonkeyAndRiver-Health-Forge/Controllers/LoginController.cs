using MonkeyAndRiver_Health_Forge.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MonkeyAndRiver_Health_Forge.Models;
using MonkeyAndRiver_Health_Forge.Services;

namespace MonkeyAndRiver_Health_Forge.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController : ControllerBase
	{
		private readonly UserManager<AppUser> _userManager;
		private readonly JwtHandler _jwtHandler;

		public UsersController(UserManager<AppUser> userManager, JwtHandler jwtHandler)
		{
			_userManager = userManager;
			_jwtHandler = jwtHandler;
		}

		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
		{
			var user = new AppUser
			{
				UserName = dto.Email,
				Email = dto.Email,
				Name = dto.Name
			};

			var result = await _userManager.CreateAsync(user, dto.Password);

			if (!result.Succeeded)
			{
				var errors = result.Errors.Select(e => e.Description);
				return BadRequest(new { Errors = errors });
			}

			await _userManager.AddToRoleAsync(user, "User");

			var roles = await _userManager.GetRolesAsync(user);
			var token = _jwtHandler.GenerateToken(user, roles);

			return Ok(new
			{
				Message = "User registered successfully",
				Token = token,
				User = new { user.Id, user.UserName, user.Email, user.Name }
			});
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginDTO dto)
		{
			var user = await _userManager.FindByEmailAsync(dto.Email);

			if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
				return Unauthorized(new { Message = "Invalid login credentials." });

			var roles = await _userManager.GetRolesAsync(user);
			var token = _jwtHandler.GenerateToken(user, roles);

			return Ok(new
			{
				Token = token,
				User = new { user.Id, user.UserName, user.Email, user.Name }
			});
		}


		[HttpGet]
		public async Task<IActionResult> GetAllUsers()
		{
			var allUsers = await _userManager.GetUsersInRoleAsync("User");
			return Ok(allUsers);
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetUserById(string id)
		{
			var user = await _userManager.FindByIdAsync(id);
			if (user == null || !(await _userManager.IsInRoleAsync(user, "User")))
				return NotFound("User not found.");

			return Ok(user);
		}


		[HttpPut("{id}")]
		public async Task<IActionResult> UpdateUser(string id, [FromBody] AppUser updatedUser)
		{
			var user = await _userManager.FindByIdAsync(id);
			if (user == null || !(await _userManager.IsInRoleAsync(user, "User")))
				return NotFound("User not found.");

			user.UserName = updatedUser.UserName;
			user.Email = updatedUser.Email;
			user.PhoneNumber = updatedUser.PhoneNumber;

			var result = await _userManager.UpdateAsync(user);
			if (!result.Succeeded)
				return BadRequest(result.Errors);

			return Ok("User updated successfully.");
		}


		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteUser(string id)
		{
			var user = await _userManager.FindByIdAsync(id);
			if (user == null || !(await _userManager.IsInRoleAsync(user, "User")))
				return NotFound("User not found.");

			var result = await _userManager.DeleteAsync(user);
			if (!result.Succeeded)
				return BadRequest(result.Errors);

			return Ok("User deleted.");
		}
	}
}