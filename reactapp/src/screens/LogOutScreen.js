import React, {useState} from 'react';
import {Container, Col, Button} from 'reactstrap';
import {connect} from 'react-redux';
import '../App.css';
import Nav from './Nav';
import { Redirect } from 'react-router-dom';





function LogOutScreen(props) {
  const [noconnexion, setNoconnexion] = useState(false)

  var deconnexion = () => {
    props.selectedShop();
    props.appointmentChoice();
    props.user();
    props.userChoice();
    setNoconnexion(true);
  }

  if (noconnexion === true) {
    return(
    <Redirect to='/' />
    )
  }

  
  return (
    <div>
       <div className='globalStyle'>
    <Nav />
    
    <Container className='signUpPage'>
      <Col xs='12' style={{display: 'flex', flexDirection: 'column', marginTop: 40, alignItems: 'center'}} >
        <h3 style={{margin: 20, fontWeight: 'bold'}}>Souhaitez-vous vous déconnecter ?</h3>
          <Button style={{backgroundColor: '#4280AB', fontWeight: 'bold' }} onClick={() => deconnexion()}>OUI</Button>
      </Col>
    </Container>
    </div>
    </div>
  );
}

function mapDispatchToProps(dispatch){
  return {
    appointmentChoice: function(){
      dispatch({
          type: 'deleteAppointmentChoice',
      })
    },
    selectedShop: function(){
      dispatch({
        type: 'deselectShop',
    })
    },
    user: function(){
      dispatch({
        type: 'noUser',
    })
    },
    userChoice: function(){
      dispatch({
        type: 'deleteUserChoice',
    })
    }
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(LogOutScreen);