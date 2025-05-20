import React from 'react';
import { deleteUser, getAllUsers, resetPassword } from '../api';

export class Account extends React.Component<{ auth: Auth, role: number }, { users: Array<AccountType> }> {
  constructor(props: { auth: Auth, role: number }) {
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

  resetPassword = async (user: string): Promise<void> => {
    await resetPassword(user, this.props.auth);
  }

  deleteUser = async (user: string): Promise<void> => {
    await deleteUser(user, this.props.auth);
    await this.getAllUsers();
  }

  render() {
    return (
      <div>
        <h1>Account</h1>
        <p>Change your password here.</p>

        {this.props.role >= 1 && (
          <>
            <h2>For Admins Only</h2>
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
