import React from 'react';
import {Container,Row, Col, Card, Button, Badge} from 'reactstrap';
import {connect} from 'react-redux';
import Nav from './Nav';
import '../App.css';





function ProfileScreen(props) {
  console.log('user', props.user)
  return (
    <div className='globalStyle'>
      <Nav />
      <Container className='profilPage' >
        <Col xs='12' style={{margin: 20}}>
          <h1>prénom et nom</h1>
        </Col>
        <Col xs='12' md='6'>
          <Card style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h3 style={{margin: 10, fontWeight: 'bold'}}>Vos rendez-vous à venir</h3>
            <Card style={{width: '90%', padding: 10, marginBottom: 10}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h5>nom du coiffeur</h5>
                <Badge color="secondary" style={{height: '60%'}}>prix</Badge>
              </div>
              <p>adresse adresse adresse adresse</p>
              <h5>prestation</h5>
              <h5>date et heure</h5>
            </Card>
            <Card style={{width: '90%', padding: 10,  marginBottom: 10}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h5>nom du coiffeur</h5>
                <p>prix</p>
              </div>
              <p>adresse adresse adresse adresse</p>
              <h5>prestation</h5>
              <h5>date et heure</h5>
            </Card>
          </Card>
        </Col >
        <Col xs='12' md='6'>
          <Card style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <h3 style={{margin: 10, fontWeight: 'bold'}}>Vos rendez-vous passés</h3>
          </Card>
        </Col>
      </Container>
    </div>
  );
}

function mapStateToProps(state){
  return {user: state.user}
}

export default connect(
  mapStateToProps,
  null,
)(ProfileScreen);

