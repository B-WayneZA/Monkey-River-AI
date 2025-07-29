using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MonkeyAndRiver_Health_Forge.Data;
using MonkeyAndRiver_Health_Forge.Models;

namespace MonkeyAndRiver_Health_Forge.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AdminsController : ControllerBase
	{
		private readonly UserManager<AppUser> _userManager;

		public AdminsController(UserManager<AppUser> userManager)
		{
			_userManager = userManager;
		}

		[HttpPost]
		public async Task<IActionResult> CreateAdmin([FromBody] RegisterDTO dto)
		{
			var user = new AppUser
			{
				UserName = dto.Email,
				Email = dto.Email,
			};

			var result = await _userManager.CreateAsync(user, dto.Password);

			if (!result.Succeeded)
				return BadRequest(result.Errors);

			await _userManager.AddToRoleAsync(user, "Admin");

			return Ok(new { Message = "Admin user created successfully." });
		}

		[HttpGet]
		public async Task<IActionResult> GetAllAdmins()
		{
			var admins = await _userManager.GetUsersInRoleAsync("Admin");
			return Ok(admins);
		}

		
		[HttpGet("{id}")]
		public async Task<IActionResult> GetAdminById(string id)
		{
			var user = await _userManager.FindByIdAsync(id);
			if (user == null || !(await _userManager.IsInRoleAsync(user, "Admin")))
				return NotFound("Admin not found.");

			return Ok(user);
		}

		
		[HttpPut("{id}")]
		public async Task<IActionResult> UpdateAdmin(string id, [FromBody] AppUser updatedUser)
		{
			var user = await _userManager.FindByIdAsync(id);
			if (user == null || !(await _userManager.IsInRoleAsync(user, "Admin")))
				return NotFound("Admin not found.");

			user.UserName = updatedUser.UserName;
			user.Email = updatedUser.Email;
			user.PhoneNumber = updatedUser.PhoneNumber;

			var result = await _userManager.UpdateAsync(user);
			if (!result.Succeeded)
				return BadRequest(result.Errors);

			return Ok("Admin updated successfully.");
		}

		
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteAdmin(string id)
		{
			var user = await _userManager.FindByIdAsync(id);
			if (user == null || !(await _userManager.IsInRoleAsync(user, "Admin")))
				return NotFound("Admin not found.");

			var result = await _userManager.DeleteAsync(user);
			if (!result.Succeeded)
				return BadRequest(result.Errors);

			return Ok("Admin deleted.");
		}
	}
}
