using Dapper;
using FSYCheckIn.Classes;
using System.Data;
using System.Xml.Linq;

namespace TemplateAPI;

public class DBService(IDbConnection conn) {
    public IEnumerable<FSYWeek> GetAllWeeks() {
        string getWeeks = """"
            select * from fsy_week;
            """";
        return conn.Query<FSYWeek>(getWeeks);
    }

    public void CreateFSYWeek(string name) {
        string createWeek = """"
            insert into fsy_week (weekName) values (@name);
            """";
        conn.Execute(createWeek, new { name });
    }

    public IEnumerable<Attendee> QueryAttendees(int weekId) {
        string attendees = """"
            select * from fsy_attendee where fsyWeek = @weekId order by id;
            """";
        return conn.Query<Attendee>(attendees, new { weekId });
    }

    public void AddAllAttendees(List<Attendee> people) {
        string addPeople = """"
                insert into fsy_attendee (fsyWeek, givenNames, surnames, apartmentComplex, apartmentKey, fsySession, checkedIn) values 
                (@fsyWeek, @givenNames, @surnames, @apartmentComplex, @apartmentKey, @fsySession, false)
                """";
        conn.Execute(addPeople, people);
    }

    public void UpdateAttendee(string user, int attendeeId, bool updateTo) {
        string updatePerson = """"    
            UPDATE fsy_attendee
            SET checkedIn = @updateTo
            WHERE id = @attendeeId;
            """";
        conn.Execute(updatePerson, new { attendeeId, updateTo });

        AddChangeLog(user, attendeeId, updateTo);
    }

    public IEnumerable<CheckInLog> GetLogs(int weekId) {
        string getLogs = """"
            select fl.id, fl.attendeeid, fl.logdescription as description, fl.timetaken from fsy_log fl 
            inner join fsy_attendee fa on (fa.id = fl.attendeeid)
            where fa.fsyweek = @weekId
            """";
        return conn.Query<CheckInLog>(getLogs, new { weekId });
    }

    private void AddChangeLog(string user, int attendeeId, bool changeTo) {
        DateTime now = DateTime.UtcNow;
        string createLog = $""""
            insert into fsy_log (attendeeId, logDescription, timeTaken) values 
            (@attendeeId, 'User {user} changed value to {changeTo}', @now);
            """";
        conn.Execute(createLog, new { attendeeId, user, changeTo, now });
    }
}
