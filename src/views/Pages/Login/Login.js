import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import db from '../../../database/fire';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

class Login extends Component {
  state = {
    email: "",
    password: ""
  }
  componentDidMount() {
    
  }

  handleEnterKeyPress = (e) => {
    this.setState({ alert: { type: null, message: null } });
    if (e.charCode === '13') {
      this.doLogin(e);
    }
  }

  handleChange = (e) => {
    e.preventDefault();
    let name = e.target.name;
    this.setState({ [name]: e.target.value });
  }

  doLogin = (e) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      let self = this;
      const { email, password } = this.state;
      db.auth().signInWithEmailAndPassword(email, password).then(
        function (data) {
          var userdata = {
            email: data.user.email,
            uid: data.user.uid
          }
          localStorage.setItem("userdata", data.user.email);
          self.props.history.push('/dashboard');
        }
      ).catch(function (error) {
        //alert(error.code);
        alert(error.message);
      });
    } catch (e) {
      alert(e.message);
    }
  }
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container onChange={(e) => this.handleChange(e)}>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" name="email" placeholder="Username" autoComplete="username" />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" name="password" placeholder="Password" autoComplete="current-password" />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button onClick={(e) => this.doLogin(e)} color="primary" className="px-4">Login</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
