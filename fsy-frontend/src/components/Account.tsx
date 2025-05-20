import React, { FormEvent } from 'react';
import { addUser, changePassword, deleteUser, getAllUsers, resetPassword } from '../api';

export class Account extends React.Component<{ auth: Auth, role: number, updateAuth: Function }, { users: Array<AccountType> }> {
  constructor(props: { auth: Auth, role: number, updateAuth: Function }) {
    super(props);
    this.state = {
      users: []
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

  signOut = (): void => {
    this.props.updateAuth({ name: "", key: "" });
    window.location.reload();
  }

  render() {
    return (
      <div>
        <h1>Account</h1>
        <p>Change your password here.</p>
        <form onSubmit={this.changePassword}>
          <input type='password' id='new-password' autoComplete='fsy-check-in new-password' />
          <button type='submit'>Update Password</button>
        </form>
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
                <button onDoubleClick={() => this.deleteUser(value.accountName)}>Delete User (double-click)</button>
              </div>
            ))}
          </>
        )}
      </div>
    );
  }
}
