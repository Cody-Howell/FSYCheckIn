namespace FSYCheckIn.Classes;

public class Attendee {
    public int Id { get; set; }
    public int FsyWeek { get; set; }
    public string GivenNames { get; set; } = "";
    public string Surnames { get; set; } = "";
    public string ApartmentComplex { get; set; } = "";
    public string ApartmentKey { get; set; } = "";
    public string FSYSession { get; set; } = "";
    public bool CheckedIn { get; set; }

    public override string ToString() {
        return $"Id: {Id}, {GivenNames} {Surnames} at {ApartmentComplex}, key {ApartmentKey}, session {FSYSession}.";
    }
}
