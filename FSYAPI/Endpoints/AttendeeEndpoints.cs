using AccountAuthenticator;
using Dapper;
using FSYCheckIn.Classes;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using TemplateAPI;

namespace FSYCheckIn.Endpoints;

public static class AttendeeEndpoints {
    public static WebApplication AddAttendeeEndpoints(this WebApplication app) {
        app.MapGet("/api/week", (DBService service) => service.GetAllWeeks());
        app.MapPost("/api/week", (HttpContext context, AuthService aS, DBService service, string weekName) => {
            string username = context.Request.Headers["Account-Auth-Account"]!;

            if (IsAdmin(aS, username)) {
                service.CreateFSYWeek(weekName);
                return Results.Created();
            }
            return Results.BadRequest("You are not an admin");
        });

        app.MapGet("/api/week/people", (DBService service, int weekId) => {
            return Results.Ok(service.QueryAttendees(weekId));
        });
        app.MapPost("/api/week/people", (DBService service, [FromBody] List<Attendee> people) => {
            service.AddAllAttendees(people);
        });

        app.MapPost("/api/week/checkIn", (HttpContext context, DBService service, int attendee, bool checkedIn) => {
            string username = context.Request.Headers["Account-Auth-Account"]!;

            service.UpdateAttendee(username, attendee, checkedIn);
        });

        app.MapGet("/api/week/report", (DBService service, int weekId) => {
            List<Attendee> data = service.QueryAttendees(weekId).AsList();

            if (data.Count == 0) {
                return Results.NotFound("Week is empty.");
            }

            var csvBuilder = new StringBuilder();
            csvBuilder.AppendLine("Id; Given Names; Surnames; Ap. Complex; Ap. Key; Session; Checked In");

            foreach (var row in data) {
                csvBuilder.AppendLine($"{row.Id}; {row.GivenNames}; {row.Surnames}; {row.ApartmentComplex}; {row.ApartmentKey}; {row.FSYSession}; {row.CheckedIn}");
            }

            var csvBytes = Encoding.UTF8.GetBytes(csvBuilder.ToString());
            return Results.File(csvBytes, "text/csv", "report.csv");
        });

        app.MapGet("/api/week/report/logs", (DBService service, int weekId) => {
            List<CheckInLog> data = service.GetLogs(weekId).AsList();

            if (data.Count == 0) {
                return Results.NotFound("Week is empty.");
            }

            var csvBuilder = new StringBuilder();
            csvBuilder.AppendLine("Attendee Id; Log Description; Time");

            foreach (var row in data) {
                csvBuilder.AppendLine($"{row.AttendeeId}; {row.Description}; {row.TimeTaken}");
            }

            var csvBytes = Encoding.UTF8.GetBytes(csvBuilder.ToString());
            return Results.File(csvBytes, "text/csv", "report.csv");
        });

        return app;
    }

    private static bool IsAdmin(AuthService service, string username) {
        Account asking = service.GetUser(username);

        return asking.Role >= 1;
    }
}

