import React, { useState } from 'react';
import {Container, Col, Card, Button, CardImg, FormGroup, Label, Input} from 'reactstrap';
import {connect} from 'react-redux';
import '../App.css';
import Nav from './Nav';
import { Redirect } from 'react-router-dom';

function AppointmentScreen(props) {

console.log(props.appointmentChoice)
  const [paiement, setPaiement] = useState('onshop');
  const [validationOk, setValidationOk] = useState(false);

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

 
    let time = Math.floor(props.appointmentChoice.startHour/60)
    if (time<10) {
      time='0'+time
    }
    let minute = props.appointmentChoice.startHour % 60
    if (minute<10) {
      minute = '0'+minute;
    }

   var completeDate = new Date(props.appointmentChoice.startDate);
   completeDate.setHours(time);
   completeDate.setMinutes(minute);
   

   var duration;
   if (props.appointmentChoice.experience != "Expérience") {
     var filtre = props.appointmentChoice.shop.packages.filter(item => item.type === props.appointmentChoice.experience);
     console.log('duration experience', filtre)
     duration = filtre[0].duration
   } else {
     var filtre = props.appointmentChoice.shop.offers.filter(item => item.type === props.appointmentChoice.prestation);
     console.log('duration offer', filtre)
     duration = filtre[0].duration
   }
   

   let endTime = Math.floor((props.appointmentChoice.startHour + duration) /60);
   if (endTime<10) {
    endTime='0'+endTime
  }
   let endMinute = (props.appointmentChoice.startHour+duration) % 60
   if (endMinute<10) {
    endMinute = '0'+endMinute;
  }
  
   var endDate = new Date(props.appointmentChoice.startDate);
   endDate.setHours(endTime);
   endDate.setMinutes(endMinute);
   

   
    var price;
    if (props.appointmentChoice.experience != "Expérience") {
      var filtre = props.appointmentChoice.shop.packages.filter(item => item.type === props.appointmentChoice.experience);
      price = filtre[0].price
    } else {
      var filtre = props.appointmentChoice.shop.offers.filter(item => item.type === props.appointmentChoice.prestation);
      price = filtre[0].price
    }



    var loyaltyPoints = 0;
    
    if (props.appointmentChoice.experience === "Expérience") {
      loyaltyPoints = 50
    } else {
      loyaltyPoints = 100
    }


    var validation = async (appointment, price, loyaltyPoints) => {
      
      let chosenOffer;
      if (appointment.prestation === "Prestation") {
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
          startDate: completeDate,
          endDate: endDate,
          chosenPayment: paiement,
          appointmentStatus: 'validated',
          shop_id: appointment.shop._id,
          loyaltyPoints: loyaltyPoints,
        }),
      });
      setValidationOk(true)
    }

  if (validationOk) {
    return(
      <Redirect to='/profil' />
    )
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
            {props.appointmentChoice.experience != "Expérience" ?
            <h5>Prestation: {props.appointmentChoice.experience} - {price}€</h5>
            :
            <h5>Prestation: {props.appointmentChoice.prestation} - {price}€</h5>
            }
             <h5>Date: {weekday} {new Date(props.appointmentChoice.startDate).getDate()} {month} à {time}h{minute}</h5>
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
          {/* <Link to='/profil' style={{display: 'flex', justifyContent: 'center'}}> */}
            <Button style={{width: '50%', backgroundColor: '#4280AB', fontWeight: 'bold'}} onClick={() => validation(props.appointmentChoice, price, loyaltyPoints)}>Valider</Button>
          {/* </Link> */}

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

