import React, { Component } from 'react';
import { Checkbox, Button, Form } from 'semantic-ui-react';
import { instanceOf } from 'prop-types';
import Cookies from 'js-cookie';
const fetch = require('node-fetch');

class LoginForm extends Component{

  state = { 
    email:'', 
    password:'', 
    stay:false // whether or not the user wants to stay logged in
  };


  handleChange = (e, {name, value}) => this.setState({ [name]: value })

  handleCheckChange = (e, {checked}) => this.setState({ stay : checked })

  handleSubmit = () => {
    const { email, password, stay } = this.state;
    var req = "https://api.chaptercommand.net/players/token/email/".concat(email,"/password/",password);
    var options = {
      secure: true,
    };
    fetch(req)
      .then(res => res.json())
      .then(json => {
        if(stay){
          options.expires = json.expires; //the user will stay logged in for however many days the backend says they should
        }
        console.log(options);
        Cookies.set('access_token', json.token, options);//, {maxAge: json.expires*60*60, secure:true, path: "/"});
      })
      .catch(err => console.log(err));
  }

  render(){
    const { email, password, stay } = this.state;

    return(
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Input
            label='Email'
            type='email' 
            name='email'
            placeholder='name@domain.com'
            value={email}
            onChange={this.handleChange}
          />
          <Form.Input
            label='Password'
            type='password' 
            name='password'
            placeholder='Password'
            value={password}
            onChange={this.handleChange}
          />
          <Form.Field>
            <Checkbox
              label='Stay Signed In'
              name="stay"
              onChange={this.handleCheckChange}
            />
          </Form.Field>
          <Button type='submit'>Log In</Button>
        </Form>
        <strong>onChange:</strong>
        <pre>{JSON.stringify({ email, password, stay }, null, 2)}</pre>
        <strong>onSubmit:</strong>
        <pre>{JSON.stringify(Cookies.getJSON(), null, 2)}</pre>
      </div>
    )
  }
}

export default LoginForm;
