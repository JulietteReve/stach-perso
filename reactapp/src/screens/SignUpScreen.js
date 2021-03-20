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
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  

  var validation = async () => {
    if (email === null || password === null || firstName === null || lastName === null || phoneNumber === null) {
      setErrorMessage('Veuillez remplir tous les champs');
    } else {
      const data = await fetch(`/users/signUp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          email: email,
          password: password,
        }),
      });
      
      const body = await data.json();
     console.log(body)
      if (body.emaiExist) {
        setErrorMessage(body.emaiExist);
      } else if (body.error) {
        setErrorMessage('Certains champs sont invalides');
      } else if (body.savedUser) {
        props.user(body.savedUser);
        setUserExists(true);
      }
    }
  }

  if (userExists === true) {
    return(<Redirect to='/rendezvous' />)
  }

  return (
    <div className='globalStyle'>
          <Nav />
          
          <Container className='signUpPage'>
            <Col xs='12' >
            <Link to='/connexion' style={{textDecoration: 'none', color: 'black'}}> 
                <div style={{display: 'flex', margin: 10}}>
                  <h3 style={{marginRight: 10}}>Vous possédez déjà un compte ? </h3>
                  <Button style={{color: 'white', fontWeight: 'bold', backgroundColor: '#AB4242'}}>Connectez-vous</Button>
                </div>
              </Link>
              <h1 style={{fontWeight: 'bold', marginBottom: 10}}>Inscrivez-vous : </h1>
              <Card style={{height: '80%'}}>
                <div style={{width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 20, fontWeight: 'bold'}}>

                  <FormGroup style={{width: '80%'}}>
                    <Label for="exampleEmail">Votre prénom :</Label>
                    <Input type="text" onChange={(e) => setFirstName(e.target.value)} value={firstName}/>
                  </FormGroup>

                  <FormGroup style={{width: '80%'}}>
                    <Label for="exampleEmail">Votre nom :</Label>
                    <Input type="text" onChange={(e) => setLastName(e.target.value)} value={lastName}/>
                  </FormGroup>

                  <FormGroup style={{width: '80%'}}>
                    <Label for="exampleEmail">Votre numéro de téléphone :</Label>
                    <Input type="text" onChange={(e) => setPhoneNumber(e.target.value)} value={phoneNumber}/>
                  </FormGroup>

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