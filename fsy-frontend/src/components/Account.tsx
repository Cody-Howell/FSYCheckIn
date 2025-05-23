import React, { FormEvent } from 'react';
import { addUser, changePassword, deleteUser, getAllUsers, resetPassword, updateRole } from '../api';

export class Account extends React.Component<{ auth: Auth, role: number, updateAuth: Function }, { users: Array<AccountType>, error: string }> {
  constructor(props: { auth: Auth, role: number, updateAuth: Function }) {
    super(props);
    this.state = {
      users: [],
      error: ""
    }
  }

  async componentDidMount(): Promise<void> {
    if (this.props.role >= 1) {
      await this.getAllUsers();
    }
  }

  getAllUsers = async (): Promise<void> => {
    const users = await getAllUsers(this.props.auth);
    this.setState({ users: users });
  }

  changePassword = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const nP = (document.getElementById('new-password') as HTMLInputElement).value;
    const npA = (document.getElementById('new-password-validate') as HTMLInputElement).value;

    if (nP !== npA) {
      this.setState({ error: "Passwords don't match." });
      return;
    }

    await changePassword(nP, this.props.auth);
    window.location.reload();
  }

  resetPassword = async (user: string): Promise<void> => {
    await resetPassword(user, this.props.auth);
    window.location.reload();
  }

  deleteUser = async (user: string): Promise<void> => {
    await deleteUser(user, this.props.auth);
    await this.getAllUsers();
  }

  addUser = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const newUser = (document.getElementById('new-user') as HTMLInputElement).value;
    await addUser(newUser, this.props.auth);
    await this.getAllUsers();
  }

  updateUser = async (id: number, role: number): Promise<void> => {
    await updateRole(id, role === 1 ? true : false, this.props.auth);
    window.location.reload();
  }

  signOut = (): void => {
    this.props.updateAuth({ name: "", key: "" });
    
    const a = document.createElement('a');
    a.href = "/";
    a.click();
  }

  render() {
    return (
      <div>
        <h1>Account</h1>
        <p>Change your password here.</p>
        <form onSubmit={this.changePassword}>
          <label>New password: </label>
          <input type='password' id='new-password' autoComplete='fsy-check-in new-password' /> <br />
          <label>New password (again): </label>
          <input type='password' id='new-password-validate' autoComplete='fsy-check-in new-password' /> <br />
          <button type='submit'>Update Password</button>
        </form>
        {this.state.error !== "" && (<p style={{backgroundColor: "red"}}>{this.state.error}</p>)}
        <button onDoubleClick={this.signOut}>Sign Out (double-click)</button>
        <hr />

        {this.props.role >= 1 && (
          <>
            <h2>For Admins Only</h2>
            <form onSubmit={this.addUser}>
              <input type='text' id='new-user' />
              <button type='submit'>New User</button>
            </form>
            <br /><br />
            {this.state.users.map((value, index) => (
              <div className='accountDisplay' key={index}>
                <p>{value.accountName}</p>
                <button onDoubleClick={() => this.resetPassword(value.accountName)}>Reset Password (double-click)</button>
                <button onDoubleClick={() => this.deleteUser(value.accountName)} style={{backgroundColor: "darkred"}}>Delete User (double-click)</button>
                <button onDoubleClick={() => this.updateUser(value.id, value.role)} style={{backgroundColor: "darkgreen"}}>
                  {value.role === 1 ? "Change to User (double-click)" : "Change to Admin (double-click)"}</button>
                
              </div>
            ))}
          </>
        )}
      </div>
    );
  }
}
