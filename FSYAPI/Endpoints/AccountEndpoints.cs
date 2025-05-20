using AccountAuthenticator;
using System.Runtime.CompilerServices;

namespace FSYCheckIn.Endpoints;

public static class AccountEndpoints {
    public static WebApplication AddAccountEndpoints(this WebApplication app) {
        // Returns int role of the user.
        app.MapGet("/api/valid", (HttpContext context, AuthService service) => { 
            string username = context.Request.Headers["Account-Auth-Account"]!;
            Account user = service.GetUser(username);

            return Results.Ok(user.Role); 
        });
        app.MapPost("/api/signin/create", (HttpContext context, AuthService service, string accountName) => {
            string username = context.Request.Headers["Account-Auth-Account"]!;

            if (IsAdmin(service, username)) {
                service.AddUser(accountName);
                return Results.Created();
            } else {
                return Results.BadRequest("You are not an admin");
            }
        });
        app.MapPost("/api/signin", (AuthService service, SignInClass user) => {
            if (service.IsValidUserPass(user.User, user.Pass)) {
                string newKey = service.NewSignIn(user.User);
                return Results.Ok(newKey);
            } else {
                return Results.BadRequest("Not valid combination.");
            }
        });
        app.MapPatch("/api/signin/update", (HttpContext context, AuthService service, string newPassword) => {
            string username = context.Request.Headers["Account-Auth-Account"]!;
            service.UpdatePassword(username, newPassword);
        });
        app.MapPost("/api/signin/reset", (HttpContext context, AuthService service, string user) => {
            string username = context.Request.Headers["Account-Auth-Account"]!;

            if (IsAdmin(service, username)) {
                service.UpdatePassword(user, "password");
                return Results.Accepted();
            }

            return Results.BadRequest("You are not an admin.");
        });
        app.MapGet("/api/users", (HttpContext context, AuthService service) => {
            string username = context.Request.Headers["Account-Auth-Account"]!;

            if (IsAdmin(service, username)) {
                return Results.Ok(service.GetAllUsers());
            }

            return Results.BadRequest("You are not an admin.");
        });
        app.MapGet("/api/user/delete", (HttpContext context, AuthService service, string user) => {
            string username = context.Request.Headers["Account-Auth-Account"]!;

            if (user != username && IsAdmin(service, username)) {
                service.DeleteUser(user);
                return Results.Ok();
            }

            return Results.BadRequest("You are not an admin.");
        });

        return app;
    }

    private static bool IsAdmin(AuthService service, string username) {
        Account asking = service.GetUser(username);

        return asking.Role >= 1;
    }
}

public class SignInClass {
    public string User { get; set; } = "";
    public string Pass { get; set; } = "";
}
