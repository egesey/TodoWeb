using Microsoft.AspNetCore.Mvc;
using TodoWeb.Models;
using MySqlConnector;

namespace TodoWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkerController : ControllerBase
    {
        private readonly string _connectionString;
        
        public WorkerController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ??
                                      throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        // GET: api/worker
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Worker>>> GetAllWorkers()
        {
            var workers = new List<Worker>();
            
            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();
                
                var query = "SELECT * FROM Worker";
                using var command = new MySqlCommand(query, connection);
                using var reader = await command.ExecuteReaderAsync();
                
                while (await reader.ReadAsync())
                {
                    workers.Add(new Worker
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name"),
                        LastName = reader.GetString("lastName"),
                        Age = reader.GetInt32("age"),
                        Nationality = reader.GetString("nationality"),
                        Department = reader.GetString("department"),
                        SchoolGraduated = reader.GetString("schoolGraduated"),
                        ProjectsShortDescription = reader.GetString("projectsShortDescription"),
                        Gender = reader.GetString("gender"),
                        BeforeJobs = reader.GetString("beforeJobs")
                    });
                }
                
                return Ok(workers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        // GET: api/worker/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Worker>> GetWorkerById(int id)
        {
            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();
                
                var query = "SELECT * FROM Worker WHERE id = @id";
                using var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@id", id);
                
                using var reader = await command.ExecuteReaderAsync();
                
                if (await reader.ReadAsync())
                {
                    var worker = new Worker
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name"),
                        LastName = reader.GetString("lastName"),
                        Age = reader.GetInt32("age"),
                        Nationality = reader.GetString("nationality"),
                        Department = reader.GetString("department"),
                        SchoolGraduated = reader.GetString("schoolGraduated"),
                        ProjectsShortDescription = reader.GetString("projectsShortDescription"),
                        Gender = reader.GetString("gender"),
                        BeforeJobs = reader.GetString("beforeJobs")
                    };
                    return Ok(worker);
                }
                
                return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        // POST: api/worker
        [HttpPost]
        public async Task<ActionResult<Worker>> CreateWorker(Worker worker)
        {
            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();
                
                var query = @"INSERT INTO Worker (name, lastName, age, nationality, department, schoolGraduated, projectsShortDescription, gender, beforeJobs) 
                             VALUES (@name, @lastName, @age, @nationality, @department, @schoolGraduated, @projectsShortDescription, @gender, @beforeJobs);
                             SELECT LAST_INSERT_ID();";
                
                using var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@name", worker.Name);
                command.Parameters.AddWithValue("@lastName", worker.LastName);
                command.Parameters.AddWithValue("@age", worker.Age);
                command.Parameters.AddWithValue("@nationality", worker.Nationality);
                command.Parameters.AddWithValue("@department", worker.Department);
                command.Parameters.AddWithValue("@schoolGraduated", worker.SchoolGraduated);
                command.Parameters.AddWithValue("@projectsShortDescription", worker.ProjectsShortDescription);
                command.Parameters.AddWithValue("@gender", worker.Gender);
                command.Parameters.AddWithValue("@beforeJobs", worker.BeforeJobs);
                
                var newId = Convert.ToInt32(await command.ExecuteScalarAsync());
                worker.Id = newId;
                
                return CreatedAtAction(nameof(GetWorkerById), new { id = worker.Id }, worker);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        // PUT: api/worker/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWorker(int id, Worker worker)
        {
            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();
                
                var query = @"UPDATE Worker 
                             SET name = @name, lastName = @lastName, age = @age, nationality = @nationality, 
                                 department = @department, schoolGraduated = @schoolGraduated, 
                                 projectsShortDescription = @projectsShortDescription, gender = @gender, beforeJobs = @beforeJobs 
                             WHERE id = @id";
                
                using var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@id", id);
                command.Parameters.AddWithValue("@name", worker.Name);
                command.Parameters.AddWithValue("@lastName", worker.LastName);
                command.Parameters.AddWithValue("@age", worker.Age);
                command.Parameters.AddWithValue("@nationality", worker.Nationality);
                command.Parameters.AddWithValue("@department", worker.Department);
                command.Parameters.AddWithValue("@schoolGraduated", worker.SchoolGraduated);
                command.Parameters.AddWithValue("@projectsShortDescription", worker.ProjectsShortDescription);
                command.Parameters.AddWithValue("@gender", worker.Gender);
                command.Parameters.AddWithValue("@beforeJobs", worker.BeforeJobs);
                
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

        // DELETE: api/worker/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorker(int id)
        {
            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();
                
                var query = "DELETE FROM Worker WHERE id = @id";
                using var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@id", id);
                
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


