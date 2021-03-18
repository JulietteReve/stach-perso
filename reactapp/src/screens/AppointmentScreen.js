import React, { useState } from 'react';
import {Container,Row, Col, Card, Button, CardImg, FormGroup, Label, Input} from 'reactstrap';
import {connect} from 'react-redux';
import '../App.css';
import Nav from './Nav';
import { Link, Redirect } from 'react-router-dom';

function AppointmentScreen(props) {

  const [paiement, setPaiement] = useState('onshop');

 if (props.appointmentChoice.coiffeur) {

  var weekday = [
      'Dimanche',
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
    ][new Date(props.appointmentChoice.startDate).getDay()];
    var month = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Aout',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre'
    ][new Date(props.appointmentChoice.startDate).getMonth()];  
 
    var hour = new Date(props.appointmentChoice.startHour).getHours();
    if (hour < 10) {
      hour = '0'+hour
    }

    var minute = new Date(props.appointmentChoice.startHour).getMinutes();
    if (minute < 10) {
      minute = '0'+minute
    }
   

    var price;
    if (props.appointmentChoice.experience != "Choisir un expérience") {
      var filtre = props.appointmentChoice.shop.packages.filter(item => item.type === props.appointmentChoice.experience);
      price = filtre[0].price
    } else {
      var filtre = props.appointmentChoice.shop.offers.filter(item => item.type === props.appointmentChoice.prestation);
      price = filtre[0].price
    }

    var duration;
    if (props.appointmentChoice.experience != "Choisir un expérience") {
      var filtre = props.appointmentChoice.shop.packages.filter(item => item.type === props.appointmentChoice.experience);
      duration = filtre[0].duration
    } else {
      var filtre = props.appointmentChoice.shop.offers.filter(item => item.type === props.appointmentChoice.prestation);
      duration = filtre[0].duration
    }

    var loyaltyPoints = 0;
    console.log(props.appointmentChoice.experience)
    if (props.appointmentChoice.experience === "Choisir un expérience") {
      loyaltyPoints = 50
    } else {
      loyaltyPoints = 100
    }


    var validation = async (appointment, price, duration, loyaltyPoints) => {
      console.log('loyaltypoints', loyaltyPoints)
      let chosenOffer;
      if (appointment.prestation === "Choisir une prestation") {
        chosenOffer = appointment.experience
      } else {
        chosenOffer = appointment.prestation
      }
      const data = await fetch(`/addappointment/${props.user.token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chosenOffer: chosenOffer,
          chosenPrice: price,
          chosenEmployee: appointment.coiffeur,
          startDate: new Date(appointment.startDate),
          endDate: new Date(appointment.startDate + duration),
          chosenPayment: paiement,
          appointmentStatus: 'validated',
          shop_id: appointment.shop._id,
          loyaltyPoints: loyaltyPoints,
        }),
      });
      const body = await data.json();
      console.log(body);
    }
    

  return (
    <div className='globalStyle'>
    <Nav />
    
    <Container className='signUpPage'>
      <Col xs='12' >
        <h3 style={{margin: 20, fontWeight: 'bold'}}>Récapitulatif de votre rendez-vous </h3>
        
        <Card style={{height: '70vh', padding: 20}}>
          
          <div style={{display: 'flex'}}>
            <CardImg src={props.appointmentChoice.shop.shopImages[0]} alt={props.appointmentChoice.shop.shopName} style={{ maxWidth: '30%', marginRight: 10}}/>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              <h3 style={{fontWeight: 'bold'}}>{props.appointmentChoice.shop.shopName}</h3>
              <h5>{props.appointmentChoice.shop.shopAddress}</h5>
            </div>
          </div>

          <div style={{margin: 10, height: '40%', display: 'flex', flexDirection: 'column' ,justifyContent: 'center'}}>
            {props.appointmentChoice.coiffeur != "Coiffeur" ? 
            <h5>Professionnel: {props.appointmentChoice.coiffeur}</h5>
            :
            <h5>Professionnel: pas de préférence</h5>
            }
            {props.appointmentChoice.experience != "Choisir un expérience" ?
            <h5>Prestation: {props.appointmentChoice.experience} {price}€</h5>
            :
            <h5>Prestation: {props.appointmentChoice.prestation} - {price}€</h5>
            }
             <h5>Date: {weekday} {new Date(props.appointmentChoice.startDate).getDate()} {month} à {hour}h{minute}</h5>
             <FormGroup check>
          <Label check>
            <Input type="radio" name="radio1" defaultChecked onClick={() => setPaiement('onshop')}/>{' '}
            Paiement sur place
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input type="radio" name="radio1" onClick={() => setPaiement('online')}/>{' '}
            Paiement en ligne
          </Label>
        </FormGroup>
          </div>
          <Link to='/profil' style={{display: 'flex', justifyContent: 'center'}}>
            <Button style={{width: '50%', backgroundColor: '#4280AB', fontWeight: 'bold'}} onClick={() => validation(props.appointmentChoice, price, duration, loyaltyPoints)}>Valider</Button>
          </Link>

        </Card>
        
      </Col>
    </Container>
    </div>
  );
  } else {
    return(
      <Redirect to='/' />
    )
  }
}

function mapStateToProps(state){
  return {appointmentChoice: state.appointmentChoice, user: state.user}
}

export default connect(
  mapStateToProps,
  null,
)(AppointmentScreen);

