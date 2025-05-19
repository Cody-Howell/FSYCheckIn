import React, { FormEvent } from 'react';
import { signIn } from '../api';

export class SignIn extends React.Component<{ updateAuth: Function }, { error: string }> {
  state = {
    error: ""
  }

  signIn = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('current-password') as HTMLInputElement).value;

    let key = await signIn(username, password);
    if (key === "" || key === null) {
      this.setState({ error: "Invalid combination." });
      return;
    }

    key = key.replace(/"/g, '');

    this.props.updateAuth({name: username, key: key});
  }

  render() {
    return (
      <div>
        <h1>Sign In</h1>
        <form onSubmit={this.signIn}>
          <label htmlFor='username'>Username: </label>
          <input type='text' id='username' autoComplete='fsy-check-in username' required /> <br />
          <label htmlFor='username'>Password: </label>
          <input type='password' id='current-password' autoComplete='fsy-check-in password' required /><br />
          <input type='submit' />
        </form>

        {this.state.error !== "" && (<p style={{ color: "red" }}>{this.state.error}</p>)}
      </div>
    );
  }
}
