import React, {useState} from 'react';
import {Container, Col, Button, FormGroup, Label, Input, Card} from 'reactstrap';
import Nav from './Nav';
import '../App.css';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

function SignInScreen(props) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [userExists, setUserExists] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  

  var validation = async () => {
    const data = await fetch(`/users/signIn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const body = await data.json();
    if (body.result === false) {
      if (body.emailNotFound) {
        setErrorMessage(body.emailNotFound)
      } else if (body.invalidPassword) {
        setErrorMessage(body.invalidPassword)
      } else if (body.error) {
        setErrorMessage('E-mail non valide')
      }
    } else {
      setUserExists(true);
      props.user(body.user)
    }
  }

  if (userExists === true) {
    return(<Redirect to='/rendezvous' />)
  }

  return (
    <div className='globalStyle'>
          <Nav />
          
          <Container className='signPage'>
            <Col xs='12' >
            <Link to='/inscription' style={{textDecoration: 'none', color: 'black'}}> 
                <div style={{display: 'flex', margin: 10}}>
                  <h3 style={{marginRight: 10}}>Pas encore de compte ? </h3>
                  <Button style={{color: 'white', fontWeight: 'bold', backgroundColor: '#AB4242'}}>Inscrivez-vous</Button>
                </div>
              </Link>
              <h1 style={{fontWeight: 'bold', marginBottom: 10}}>Connectez-vous avec vos identidiants: </h1>
              <Card style={{height: '45vh'}}>
                <div style={{width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 20, fontWeight: 'bold'}}>
                  <FormGroup style={{width: '80%'}}>
                    <Label for="exampleEmail">Votre adresse mail :</Label>
                    <Input type="email" name="email" id="exampleEmail" onChange={(e) => setEmail(e.target.value)} value={email}/>
                  </FormGroup>
                  <FormGroup style={{width: '80%'}}>
                    <Label for="examplePassword">Votre mot de passe :</Label>
                    <Input type="password" name="password" id="examplePassword" onChange={(e) => setPassword(e.target.value)} value={password}/>
                  </FormGroup>
                  <p>{errorMessage}</p>
                  <Button style={{backgroundColor: '#4280AB', color: 'white', fontWeight: 'bold', width: '50%', margin: 20}} onClick={() => validation()}>Valider</Button>
                </div>
              </Card>
              
            </Col>
            
          </Container>
    </div>  

  );
}

function mapDispatchToProps(dispatch){
  return {
    user: function(user){
      dispatch({
          type: 'user',
          user: user,
      })
    }
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(SignInScreen);