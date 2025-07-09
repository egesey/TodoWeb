using Microsoft.AspNetCore.Mvc;
using TodoWeb.Models;
using MySqlConnector;

namespace TodoWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly string _connectionString;
        
        public ProjectsController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? 
                              throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        // GET: api/projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Projects>>> GetAllProjects()
        {
            var projects = new List<Projects>();
            
            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();
                
                var query = "SELECT pid, pName, pGivenDate, pFinishDate, nameOfWorkerForProject1, nameOfWorkerForProject2, nameOfWorkerForProject3, nameOfWorkerForProject4 FROM Projects";
                using var command = new MySqlCommand(query, connection);
                using var reader = await command.ExecuteReaderAsync();
                
                while (await reader.ReadAsync())
                {
                    projects.Add(new Projects
                    {
                        Pid = reader.GetInt32(0),
                        PName = reader.IsDBNull(1) ? "" : reader.GetString(1),
                        PGivenDate = reader.GetDateTime(2),
                        PFinishDate = reader.GetDateTime(3),
                        NameOfWorkerForProject1 = reader.IsDBNull(4) ? null : reader.GetString(4),
                        NameOfWorkerForProject2 = reader.IsDBNull(5) ? null : reader.GetString(5),
                        NameOfWorkerForProject3 = reader.IsDBNull(6) ? null : reader.GetString(6),
                        NameOfWorkerForProject4 = reader.IsDBNull(7) ? null : reader.GetString(7)
                    });
                }
                
                return Ok(projects);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        // GET: api/projects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Projects>> GetProjectById(int id)
        {
            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();
                
                var query = "SELECT pid, pName, pGivenDate, pFinishDate, nameOfWorkerForProject1, nameOfWorkerForProject2, nameOfWorkerForProject3, nameOfWorkerForProject4 FROM Projects WHERE pid = @pid";
                using var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@pid", id);
                
                using var reader = await command.ExecuteReaderAsync();
                
                if (await reader.ReadAsync())
                {
                    var project = new Projects
                    {
                        Pid = reader.GetInt32(0),
                        PName = reader.IsDBNull(1) ? "" : reader.GetString(1),
                        PGivenDate = reader.GetDateTime(2),
                        PFinishDate = reader.GetDateTime(3),
                        NameOfWorkerForProject1 = reader.IsDBNull(4) ? null : reader.GetString(4),
                        NameOfWorkerForProject2 = reader.IsDBNull(5) ? null : reader.GetString(5),
                        NameOfWorkerForProject3 = reader.IsDBNull(6) ? null : reader.GetString(6),
                        NameOfWorkerForProject4 = reader.IsDBNull(7) ? null : reader.GetString(7)
                    };
                    return Ok(project);
                }
                
                return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        // POST: api/projects
        [HttpPost]
        public async Task<ActionResult<Projects>> CreateProject(Projects project)
        {
            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();
                
                var query = @"INSERT INTO Projects (pName, pGivenDate, pFinishDate, nameOfWorkerForProject1, nameOfWorkerForProject2, nameOfWorkerForProject3, nameOfWorkerForProject4) 
                             VALUES (@pName, @pGivenDate, @pFinishDate, @nameOfWorkerForProject1, @nameOfWorkerForProject2, @nameOfWorkerForProject3, @nameOfWorkerForProject4);
                             SELECT LAST_INSERT_ID();";
                
                using var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@pName", project.PName ?? "");
                command.Parameters.AddWithValue("@pGivenDate", project.PGivenDate);
                command.Parameters.AddWithValue("@pFinishDate", project.PFinishDate);
                command.Parameters.AddWithValue("@nameOfWorkerForProject1", project.NameOfWorkerForProject1 ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@nameOfWorkerForProject2", project.NameOfWorkerForProject2 ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@nameOfWorkerForProject3", project.NameOfWorkerForProject3 ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@nameOfWorkerForProject4", project.NameOfWorkerForProject4 ?? (object)DBNull.Value);
                
                var newId = Convert.ToInt32(await command.ExecuteScalarAsync());
                project.Pid = newId;
                
                return CreatedAtAction(nameof(GetProjectById), new { id = project.Pid }, project);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        // PUT: api/projects/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, Projects project)
        {
            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();
                
                var query = @"UPDATE Projects 
                             SET pName = @pName, pGivenDate = @pGivenDate, pFinishDate = @pFinishDate, 
                                 nameOfWorkerForProject1 = @nameOfWorkerForProject1, nameOfWorkerForProject2 = @nameOfWorkerForProject2, 
                                 nameOfWorkerForProject3 = @nameOfWorkerForProject3, nameOfWorkerForProject4 = @nameOfWorkerForProject4 
                             WHERE pid = @pid";
                
                using var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@pid", id);
                command.Parameters.AddWithValue("@pName", project.PName ?? "");
                command.Parameters.AddWithValue("@pGivenDate", project.PGivenDate);
                command.Parameters.AddWithValue("@pFinishDate", project.PFinishDate);
                command.Parameters.AddWithValue("@nameOfWorkerForProject1", project.NameOfWorkerForProject1 ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@nameOfWorkerForProject2", project.NameOfWorkerForProject2 ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@nameOfWorkerForProject3", project.NameOfWorkerForProject3 ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@nameOfWorkerForProject4", project.NameOfWorkerForProject4 ?? (object)DBNull.Value);
                
                var rowsAffected = await command.ExecuteNonQueryAsync();
                
                if (rowsAffected == 0)
                    return NotFound();
                    
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        // DELETE: api/projects/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();
                
                var query = "DELETE FROM Projects WHERE pid = @pid";
                using var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@pid", id);
                
                var rowsAffected = await command.ExecuteNonQueryAsync();
                
                if (rowsAffected == 0)
                    return NotFound();
                    
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }
    }
}