using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.Threading.Tasks;

namespace MonkeyAndRiver_Health_Forge.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        private readonly ILogger<HealthController> _logger;
        public HealthController(ILogger<HealthController> logger)
        {
            _logger = logger;
        }
        [HttpGet]
        public IActionResult Get()
        {
            _logger.LogInformation("Health check endpoint called.");
            return Ok(new { Status = "Healthy", Timestamp = DateTime.UtcNow });
        }

        [HttpGet("db")]
        public async Task<IActionResult> checkDB()
        {
            try
            {
                // get connection string from configuration
                var connectionString = "YourConnectionStringHere"; // Replace with your actual connection string

                using var connection = new SqlConnection(connectionString);
                await connection.OpenAsync();

                using var command = connection.CreateCommand();
                command.CommandText = "SELECT 1";
                await command.ExecuteScalarAsync();

            } catch (SqlException ex)
            {
                _logger.LogError(ex, "Database connection failed.");
                return StatusCode(StatusCodes.Status503ServiceUnavailable, new { Status = "Database Unavailable", Error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while checking the database.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Error = ex.Message });
            }
    }
}
