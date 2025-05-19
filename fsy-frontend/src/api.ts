async function getResponse(path: string, auth: Auth): Promise<string> {
  const url = "/api";
  try {
    const response = await fetch(url + path, {
      headers: {
        "Account-Auth-Account": auth.name,
        "Account-Auth-ApiKey": auth.key,
      },
    });
    if (!response.ok) {
      throw new Error(`Response error: ${response.status}`);
    }

    return await response.text();
  } catch (error: any) {
    console.error(error.message);
    return "";
  }
}

async function postResponse(path: string, obj: any, auth: Auth | null): Promise<string> {
  const url = "/api";
  try {
    let response;
    if (auth !== null) {
      response = await fetch(url + path, {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json",
          "Account-Auth-Account": auth.name,
          "Account-Auth-ApiKey": auth.key,
        },
      });
    } else {
      response = await fetch(url + path, {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.text();
  } catch (error: any) {
    console.error(error.message);
    return "";
  }
}

async function patchResponse(path: string, auth: Auth): Promise<string> {
  const url = "/api";
  try {
    const response = await fetch(url + path, {
      method: "PATCH",
      headers: {
        "Account-Auth-Account": auth.name,
        "Account-Auth-ApiKey": auth.key,
      },
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.text();
  } catch (error: any) {
    console.error(error.message);
    return "";
  }
}

export async function signIn(user: string, pass: string): Promise<string> {
  return await postResponse("/signin", { User: user, Pass: pass }, null);
}

export async function getRole(auth: Auth): Promise<number> {
  const response = await getResponse("/valid", auth);
  const number = Number.parseInt(response);
  console.log(response);
  console.log(number);
  if (isNaN(number)) return 0;

  return number;
}

export async function isValid(auth: Auth): Promise<boolean> {
  return await getResponse("/valid", auth) !== "";
}
