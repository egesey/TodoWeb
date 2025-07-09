namespace TodoWeb.Models
{
    public class Worker
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int Age { get; set; }
        public string Nationality { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string SchoolGraduated { get; set; } = string.Empty;
        public string ProjectsShortDescription { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string BeforeJobs { get; set; } = string.Empty;
    }
}