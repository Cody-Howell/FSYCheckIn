namespace FSYCheckIn.Classes;

public class CheckInLog {
    public int Id { get; set; }
    public int AttendeeId { get; set; }
    public string Description { get; set; } = "";
    public DateTime TimeTaken { get; set; }
}
