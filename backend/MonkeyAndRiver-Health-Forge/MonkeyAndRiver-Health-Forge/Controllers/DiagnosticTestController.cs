using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MonkeyAndRiver_Health_Forge.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiagnosticTestController : ControllerBase
    {
        // GET: api/<DiagnosticTestController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<DiagnosticTestController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<DiagnosticTestController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
            // name, age , 
        }

        // PUT api/<DiagnosticTestController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<DiagnosticTestController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
