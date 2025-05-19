async function getResponse(path: string, auth: Auth): Promise<string> {
  const url = "/api";
  try {
    const response = await fetch(url + path, {
      headers: {
        User: auth.name,
        ApiKey: auth.key,
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
          User: auth.name,
          ApiKey: auth.key,
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
        User: auth.name,
        ApiKey: auth.key,
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
