import React, {useEffect, useState} from 'react';
import {Container,Row, Col, Card, Button, Badge} from 'reactstrap';
import {connect} from 'react-redux';
import Nav from './Nav';
import '../App.css';


function ProfileScreen(props) {

  const [appointments, setAppointments] = useState([]);
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const data = await fetch(`/users/myProfile/${props.user.token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: props.user.appointments }),
      }
      );
      const body = await data.json();
      console.log('body', body)
      setShops(body.shops);
      setAppointments(body.appointments);
    };
    getUser();
  }, []);

  console.log('appointments', appointments)
  console.log('shops', shops)

  var futursAppointments = [];
  var pastAppointments = [];
  for (let i=0; i<appointments.length; i++) {
    if (new Date(appointments[i].startDate) > new Date()) {
      futursAppointments.push({appointment: appointments[i], shop: shops[i]})
    } else {
      pastAppointments.push({appointment: appointments[i], shop: shops[i]})
    }
  }

  console.log('futurs', futursAppointments)
  console.log('passé', pastAppointments)

  var pastAppointmentsTab = pastAppointments.map((element, i) => {

    var weekday = [
      'Dimanche',
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
    ][new Date(element.appointment.startDate).getDay()];

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
    ][new Date(element.appointment.startDate).getMonth()];

    var hours = new Date(element.appointment.startDate).getHours();
    if (hours<10) {
      hours = '0'+hours
    }

    var minutes = new Date(element.appointment.startDate).getMinutes();
    if (minutes<10) {
      minutes = '0'+minutes
    }
 
    var date = weekday +' '+ new Date(element.appointment.startDate).getDate() +' '+ month +' à '+ hours+'h'+ minutes

    return(
      <Card style={{width: '90%', padding: 10, marginBottom: 10}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <h5 style={{fontWeight: 'bold'}}>{element.shop.shopName}</h5>
          {element.appointment.chosenPayment === 'onshop' ?
          <Badge  style={{height: '60%', backgroundColor: 'red'}}>{element.appointment.chosenPrice}€</Badge>
          : 
          <Badge style={{height: '60%', backgroundColor: 'green'}}>{element.appointment.chosenPrice}€</Badge>
          }
        </div>
        <p>{element.shop.shopAddress}</p>
        <h5 style={{fontWeight: 'bold'}}>{element.appointment.chosenOffer}</h5>
        <h5>{date}</h5>
      </Card>
    )
  })

  var futursAppointmentsTab = futursAppointments.map((element, i) => {

    var weekday = [
      'Dimanche',
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
    ][new Date(element.appointment.startDate).getDay()];

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
    ][new Date(element.appointment.startDate).getMonth()];

    var hours = new Date(element.appointment.startDate).getHours();
    if (hours<10) {
      hours = '0'+hours
    }

    var minutes = new Date(element.appointment.startDate).getMinutes();
    if (minutes<10) {
      minutes = '0'+minutes
    }
 
    var date = weekday +' '+ new Date(element.appointment.startDate).getDate() +' '+ month +' à '+ hours+'h'+ minutes

    return(
      <Card style={{width: '90%', padding: 10, marginBottom: 10}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <h5 style={{fontWeight: 'bold'}}>{element.shop.shopName}</h5>
          {element.appointment.chosenPayment === 'onshop' ?
          <Badge  style={{height: '60%', backgroundColor: 'red'}}>{element.appointment.chosenPrice}€</Badge>
          : 
          <Badge style={{height: '60%', backgroundColor: 'green'}}>{element.appointment.chosenPrice}€</Badge>
          }
        </div>
        <p>{element.shop.shopAddress}</p>
        <h5 style={{fontWeight: 'bold'}}>{element.appointment.chosenOffer}</h5>
        <h5>{date}</h5>
      </Card>
    )
  })

  return (
    <div className='globalStyle'>
      <Nav />
      <Container className='profilPage' >
        <Col xs='12' style={{margin: 20}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h1 style={{fontWeight: 'bold'}}>{props.user.firstName} {props.user.lastName}</h1>
            <Badge style={{backgroundColor: '#AB4242', fontWeight: 'bold', fontSize: 25, height: 40}}>{props.user.loyaltyPoints} points</Badge>
          </div>
        </Col>
        <Col xs='12' md='6' style={{marginBottom: 20}}>
          <Card style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h3 style={{margin: 10, fontWeight: 'bold'}}>Vos rendez-vous à venir</h3>
            {futursAppointmentsTab}
          </Card>
        </Col >
        <Col xs='12' md='6'>
          <Card style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <h3 style={{margin: 10, fontWeight: 'bold'}}>Vos rendez-vous passés</h3>
          {pastAppointmentsTab}
          </Card>
        </Col>
      </Container>
    </div>
  );
}

function mapStateToProps(state) {
  return {user: state.user}
}

export default connect(
  mapStateToProps,
  null,
)(ProfileScreen);

