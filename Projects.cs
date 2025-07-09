namespace TodoWeb.Models
{
    public class Projects
    {
        public int Pid { get; set; }
        public string PName { get; set; } = string.Empty;
        public DateTime PGivenDate { get; set; }
        public DateTime PFinishDate { get; set; }
        public string? NameOfWorkerForProject1 { get; set; }
        public string? NameOfWorkerForProject2 { get; set; }
        public string? NameOfWorkerForProject3 { get; set; }
        public string? NameOfWorkerForProject4 { get; set; }
    }
}