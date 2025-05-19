import React from 'react';

export class Home extends React.Component<{auth: Auth}, Record<string, never>> {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <p>User: {this.props.auth.name}</p>
        <p>Key: {this.props.auth.key}</p>
      </div>
    );
  }
}
