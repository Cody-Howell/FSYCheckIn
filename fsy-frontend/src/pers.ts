export function getSavedAuth(): {auth: Auth, role: number} {
  const item: string | null = window.localStorage.getItem("fsy-stored-auth");
  if (item === null) {
    return {auth: {name: "", key: ""}, role: 0};
  } else {
    return JSON.parse(item);
  }
}

export function saveAuth(auth: Auth, role: number): void {
  const string = JSON.stringify({auth: auth, role: role});
  window.localStorage.setItem("fsy-stored-auth", string);
}