import React from 'react'
import './App.css'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { SignIn } from './components/SignIn'
import { Home } from './components/Home'

class App extends React.Component<Record<string, never>, { auth: Auth, level: number }> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      auth: {
        name: "",
        key: ""
      },
      level: 0
    }
  }

  updateAuth = (obj: Auth): void => {
    console.log(obj);
    this.setState((prevState) => ({
      auth: {
        ...prevState.auth,
        name: obj.name,
        key: obj.key
      }
    }));
  }

  render() {
    return (
      <div id='app'>
        <BrowserRouter>
          <Sidebar />
          <Routes>
            {this.state.auth.name === "" ?
              (<Route path='/' element={<SignIn updateAuth={this.updateAuth} />} />) :
              (<Route path='/' element={<Home auth={this.state.auth} />} />)}


            <Route path='*' element={<MissingPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    )
  }
}

class Sidebar extends React.Component {
  render() {
    return (
      <div id='sidebar'>
        <Link to="/">Home</Link>
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
