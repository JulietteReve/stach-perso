import React, {useEffect, useState} from 'react';
import {Container,Row, Col, Card, Button, Badge, Input, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {connect} from 'react-redux';
import Nav from './Nav';
import '../App.css';
import { Redirect } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';


function ProfileScreen(props) {

  const {
    buttonLabel,
    className
  } = props;

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [shopId, setShopId] = useState('');
  const [appointmentId, setAppointmentId] = useState('');

  const [appointments, setAppointments] = useState([]);
  const [shops, setShops] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
 

  useEffect(() => {
    const getUser = async () => {
      const data = await fetch(`/users/myProfile/${props.user.token}`
      );
      const body = await data.json();
      setShops(body.shops);
      setAppointments(body.appointments);
      
    };
    getUser();
  }, [shopId]);
 
 

  if (props.user.token) {

    var starsTab = [];
    for (let i=0; i<5; i++) {
      var color = 'black';
      if (i<rating) {
        color = 'gold'
      }
      let count = i+1
      starsTab.push(<FontAwesomeIcon key={i} style={{marginRight: 5}} icon={faStar} color={color} onClick={() => setRating(count)} />)
    };

    
    
    var openComment = (shopId, appointmentId) => {
      setShopId(shopId);
      setAppointmentId(appointmentId)
      toggle()
    }

    var closeComment = () => {
      setShopId('');
      setAppointmentId('');
      setRating(0);
      setComment('');
      toggle();
      setErrorMessage(null);
    } 

    var sendComment = async () => {
      if (rating === 0) {
        setErrorMessage('Veuillez noter votre coiffeur')
      } else if (comment === '') {
        setErrorMessage('Veuillez laisser un commentaire')
      } else {
        console.log(rating, comment, shopId, appointmentId);
        var newComment = await fetch(`/users/addcomment`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `comment=${comment}&rating=${rating}&shop_id=${shopId}&token=${props.user.token}&appointmentId=${appointmentId}`,
        });
        var rawResponse = await newComment.json();
        console.log(rawResponse)
        setShopId('');
        setAppointmentId('');
        setRating(0);
        setComment(null);
        setErrorMessage(null);
        toggle();
      } 
    }

    var futursAppointments = [];
    var pastAppointments = [];
    for (let i=0; i<appointments.length; i++) {
      if (new Date(appointments[i].startDate) > new Date()) {
        futursAppointments.push({appointment: appointments[i], shop: shops[i]})
      } else {
        pastAppointments.push({appointment: appointments[i], shop: shops[i]})
      }
    }

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
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <img src={element.shop.shopImages[0]} style={{width: '20%'}}></img>
              <div style={{width: '70%'}}>
                <h5 style={{fontWeight: 'bold'}}>{element.shop.shopName}</h5>
                <p>{element.shop.shopAddress}</p>
              </div>
              {element.appointment.chosenPayment === 'onshop' ?
              <Badge  style={{height: '60%', backgroundColor: '#AB4242'}}>{element.appointment.chosenPrice}€</Badge>
              : 
              <Badge style={{height: '60%', backgroundColor: '#51AB42'}}>{element.appointment.chosenPrice}€</Badge>
              }
            </div>
            
          </div>
          
          <h5 style={{fontWeight: 'bold', marginTop: 10}}>{element.appointment.chosenOffer}</h5>
          <h5>{date}</h5>
          { element.appointment.commentExists ?
          null
          :
          <div style={{display: 'flex', justifyContent: 'center'}}>
          <Button style={{backgroundColor: '#4280AB', fontWeight: 'bold'}} onClick={() => openComment(element.shop._id, element.appointment._id) }>Ecrire un commentaire</Button>
          </div>
          }
          
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
        <Card style={{width: '90%', padding: 10, marginBottom: 10} }>
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <img src={element.shop.shopImages[0]} style={{width: '20%'}}></img>
              <div style={{width: '70%'}}>
                <h5 style={{fontWeight: 'bold'}}>{element.shop.shopName}</h5>
                <p>{element.shop.shopAddress}</p>
              </div>
              {element.appointment.chosenPayment === 'onshop' ?
              <Badge  style={{height: '60%', backgroundColor: '#AB4242'}}>{element.appointment.chosenPrice}€</Badge>
              : 
              <Badge style={{height: '60%', backgroundColor: '#51AB42'}}>{element.appointment.chosenPrice}€</Badge>
              }
            </div>
          </div>
          <h5 style={{fontWeight: 'bold', marginTop: 10}}>{element.appointment.chosenOffer}</h5>
          <h5>{date}</h5>
        </Card>
      )
    })

    return (
      <div className='globalStyle'>
        <Nav />
        <Container className='profilPage' >
          <Col xs='12' style={{marginTop: 20, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h1 style={{fontWeight: 'bold'}}>{props.user.firstName} {props.user.lastName}</h1>
              <Badge style={{backgroundColor: '#AB4242', fontWeight: 'bold', fontSize: 25, height: 40}}>{props.user.loyaltyPoints} points</Badge>
          </Col>
          <Col xs='12' md='6' style={{marginBottom: 20}}>
            <Card style={{display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#FFCD41'}}>
              <h3 style={{margin: 10, fontWeight: 'bold'}}>Vos rendez-vous à venir</h3>
              {futursAppointmentsTab}
            </Card>
          </Col >
          <Col xs='12' md='6'>
            <Card style={{display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#FFCD41'}}>
            <h3 style={{margin: 10, fontWeight: 'bold'}}>Vos rendez-vous passés</h3>
            {pastAppointmentsTab}
            </Card>
          </Col>
        </Container>
        <Modal isOpen={modal} toggle={toggle} className={className}>
          <ModalHeader toggle={toggle}>Ecrivez votre commentaire</ModalHeader>
          <ModalBody>
            {starsTab}
            <Input placeholder="Votre commentaire" onChange={(e) => setComment(e.target.value)} value={comment}></Input>
            {errorMessage}
          </ModalBody>
          <ModalFooter>
            <Button style={{backgroundColor: '#4280AB'}} onClick={() => sendComment()}>Envoyer</Button>{' '}
            <Button color="secondary" onClick={() => closeComment()}>Annuler</Button>
          </ModalFooter>
        </Modal>
      </div>
    );

  } else {
    return(
      <Redirect to='/' />
    )
  }
}



function mapStateToProps(state) {
  return {user: state.user}
}

export default connect(
  mapStateToProps,
  null,
)(ProfileScreen);

