import React from 'react'
import './App.css'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { SignIn } from './components/SignIn'
import { Home } from './components/Home'
import { getRole, isValid } from './api'
import { getSavedAuth, saveAuth } from './pers'
import { Account } from './components/Account'
import { CSVImport } from './components/CSVImport'
import { AdminWeekViewer } from './components/AdminWeekViewer'

class App extends React.Component<Record<string, never>, { auth: Auth, role: number }> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      auth: {
        name: "",
        key: ""
      },
      role: -1
    }
  }

  async componentDidMount(): Promise<void> {
    const value: { auth: Auth, role: number } = getSavedAuth();
    if (await isValid(value.auth)) {
      this.setState(value);
    }
  }

  updateAuth = async (obj: Auth): Promise<void> => {
    const role: number = await getRole(obj);

    this.setState((prevState) => ({
      auth: {
        ...prevState.auth,
        name: obj.name,
        key: obj.key
      },
      role: role
    }));

    saveAuth(obj, role);
  }

  render() {
    return (
      <div id='app'>
        <BrowserRouter>
          <Sidebar role={this.state.role} />
          <div id='page'>
            <Routes>
              {this.state.auth.name === "" ?
                (<Route path='/' element={<SignIn updateAuth={this.updateAuth} />} />) :
                (<>
                  <Route path='/' element={<Home auth={this.state.auth} role={this.state.role} />} />
                  <Route path='/account' element={<Account auth={this.state.auth} role={this.state.role} updateAuth={this.updateAuth} />} />
                </>)}

              {this.state.role >= 1 && (
                <>
                  <Route path='/admin/weeks' element={<AdminWeekViewer auth={this.state.auth} role={this.state.role} />} />
                  <Route path='/admin/import' element={<CSVImport auth={this.state.auth} role={this.state.role} />} />
                </>
              )}

              <Route path='*' element={<MissingPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    )
  }
}

class Sidebar extends React.Component<{ role: number }, Record<string, never>> {
  render() {
    return (
      <div id='sidebar'>
        <Link to="/">Home</Link> <br />
        {this.props.role >= 0 && (
          <>
            <Link to="/account">Account</Link> <br />
          </>
        )}
        {this.props.role >= 1 && (
          <>
            <hr/>
            <Link to="/admin/weeks">Weeks</Link> <br />
            <Link to="/admin/import">CSV Import</Link> <br />
          </>
        )}
      </div>
    )
  }
}

class MissingPage extends React.Component {
  render() {
    return (
      <div>
        <h1>Missing Page</h1>
        <p>Did you mean to end up here? <Link to="/">Head back home</Link>.</p>
      </div>
    )
  }
}

export default App
