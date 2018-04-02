import React, { Component } from 'react'
import { Alert, Button, Card, CardText, CardBody, CardTitle, CardSubtitle } from 'reactstrap'
import axios from 'axios'
import logo from './logo.svg'
import './App.css'

const httpFecth = (URL, action, params) => {
  switch(action){
    case 'token':
      return axios.post(URL, params)
    case 'me':
      return axios.get(URL, params)
    default:
      return false
  }
}

const CardLogin = (props) => {
  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle>{props.name}</CardTitle>
          <CardSubtitle>{props.email}</CardSubtitle>
          <CardText>
            Token: {props.token}
          </CardText>
          <Button>Button</Button>
        </CardBody>
      </Card>
    </div>
  )
}

class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      isLoading: false,
      isError: false,
      token: '',
      Data: []
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
  }

  componentDidMount(){
    const token = localStorage.getItem('token')
    if(token){
      this.setState({ token })
      httpFecth('users/me', 'me', {
        headers: {
          "Authorization": "Bearer "+this.state.token
        }
      })
      .then( 
        res => {
          this.setState({ Data: res.data })
        }
      )
      .catch(
        res => console.log(res)
      )
    }
  }

  onSubmit(event){
    event.preventDefault()

    this.setState({ isLoading: true, isError: false })

    httpFecth('users/login', 'token', {
        email: this.refs.email.value,
        passwd: this.refs.passwd.value      
      })
      .then(
        res => {
          if(res.data.error){
            this.setState({ isError: res.data.message })
          } else {
            this.setState({ token: res.data.token })
            localStorage.setItem('token', res.data.token)
            this.handleLogin()
          }
          this.setState({ isLoading: false })
        }
      )      
  }

  handleLogin(){
    httpFecth('users/me', 'me', {
      headers: {
        "Authorization": "Bearer "+this.state.token
      }
    })
    .then( 
      res => {
        this.setState({ Data: res.data })
      }
    )
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {
          this.state.isLoading &&
          <Alert color="primary">Aguarde...</Alert>
        }

        {
          this.state.isError &&
          <Alert color="danger">Error: {this.state.isError}</Alert>
        }        

        { 
          !this.state.token &&
          <form method="post" onSubmit={this.onSubmit}>
            <input ref="email" type="text" placeholder="Qual seu Email?"/>
            <input ref="passwd" type="password" placeholder="Qual sua Senha?"/>
            <Button color="primary">Entrar</Button>
          </form>
        }

        {
          this.state.token &&
          <CardLogin token={this.state.token} name={this.state.Data.name} email={this.state.Data.email}/>
        }
      </div>
    )
  }
}

export default App
