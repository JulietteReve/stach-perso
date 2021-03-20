import React, {useState, useEffect} from 'react';
import '../App.css';
import {Container,Row, Col, Card, CardText, CardBody, CardLink,
  CardTitle, CardSubtitle, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, ListGroup, ListGroupItem, ListGroupItemHeading, InputGroup, InputGroupText, } from 'reactstrap'
import {connect} from 'react-redux';
import Nav from './Nav';
import Carousel from '../components/shopCarousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHeart, faEuroSign, faCoffee, faLeaf, faPaw, faGlassMartini, faGamepad, faWheelchair, faStar, faCalendar, faClock} from '@fortawesome/free-solid-svg-icons';
import DatePicker, {registerLocale, setDefaultLocale} from "react-datepicker";
import {Link, Redirect} from 'react-router-dom'
import "react-datepicker/dist/react-datepicker.css";
import {fr} from 'date-fns/locale';



function ShopScreen(props) {
  
  registerLocale('fr', fr)

  const [dropdownOpenCoiffeur, setDropdownOpenCoiffeur] = useState(false);
  const toggleCoiffeur = () => setDropdownOpenCoiffeur(prevState => !prevState);
  const [dropdownOpenPrestation, setDropdownOpenPrestation] = useState(false);
  const togglePrestation = () => setDropdownOpenPrestation(prevState => !prevState);
  const [dropdownOpenExperience, setDropdownOpenExperience] = useState(false);
  const toggleExperience = () => setDropdownOpenExperience(prevState => !prevState);
  

  const [coiffeur, setCoiffeur] = useState('Coiffeur');
  const [prestation, setPrestation] = useState('Prestation');
  const [experience, setExperience] = useState('Expérience');
  //const [startDate, setStartDate] = useState(null);
  const [startHour, setStartHour] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [userExists, setUserExists] = useState(false);
  const [userDoesntExists, setUserDoesntExists] = useState(false);

 

  useEffect(() => {
    
   
    if (props.userChoice.experience != null) {
        setExperience(props.userChoice.experience.altText);
    }
    if (props.userChoice.prestation != null) {
      setPrestation(props.userChoice.prestation);
    }
  }, []);


  if (props.selectedShop.shopName) {

    var priceTab = [];
    for (let y = 0; y < 3; y++) {
        var color = 'white';
        if (y < props.selectedShop.priceFork) {
          color = 'black';
        }
        priceTab.push(
          <FontAwesomeIcon icon={faEuroSign} color={color} style={{margin: '5'}} />
        );
      }
    var pictoTab = [];
      for (let z = 0; z < props.selectedShop.shopFeatures.length; z++) {
      let picto = props.selectedShop.shopFeatures[z];
        if (picto === 'wheelchair-alt') {
          pictoTab.push(<FontAwesomeIcon icon={faWheelchair} color={'black'} style={{margin: '5'}}/>)
        } else if (picto === 'glass') {
          pictoTab.push(<FontAwesomeIcon icon={faGlassMartini} color={'black'} style={{margin: '5'}}/>)
        } else if (picto === 'paw') {
          pictoTab.push(<FontAwesomeIcon icon={faPaw} color={'black'} style={{margin: '5'}}/>)
        } else if (picto === 'leaf'){
          pictoTab.push(<FontAwesomeIcon icon={faLeaf} color={'black'} style={{margin: '5'}}/>)
        } else if (picto === 'gamepad') {
          pictoTab.push(<FontAwesomeIcon icon={faGamepad} color={'black'} style={{margin: '5'}}/>)
        } else {
          pictoTab.push(<FontAwesomeIcon icon={faCoffee} color={'black'} style={{margin: '5'}}/>)
        }
      }

      var starsTab = [];
      var flooredStarRating = Math.round(props.selectedShop.rating);
      for (let j = 0; j < 5; j++) {
        var color = 'black';
        if (j < flooredStarRating) {
          color = 'gold';
        }
        starsTab.push(
          <FontAwesomeIcon icon={faStar} color={color} style={{marginTop: '5', marginRight: '2'}}/>
        );
      }

      var coiffeursTab = [<DropdownItem onClick={() => setCoiffeur('Peu importe')}>{'Peu importe'}</DropdownItem>];
      for (let i=0; i<props.selectedShop.shopEmployees.length; i++) {
        coiffeursTab.push(<DropdownItem onClick={() => setCoiffeur(props.selectedShop.shopEmployees[i])}>{props.selectedShop.shopEmployees[i]}</DropdownItem>)
      }

      var prestationsTab = props.selectedShop.offers.map((element, i) => {
        return(
          <DropdownItem onClick={() => {setPrestation(element.type); setExperience('Expérience')}}>{`${element.type} ${element.price}€`}</DropdownItem>
        )
      })

      var experiencesTab = props.selectedShop.packages.map((element, i) => {
        return(
          <DropdownItem onClick={() => {setExperience(element.type); setPrestation('Prestation')}}>{`${element.type} ${element.price}€`}</DropdownItem>
        )
      })

      var commentsTab = props.selectedShop.comments.map((element, i) => {
        var starsCommentsTab = [];
        var flooredStarRating = Math.round(element.rating);
        for (let j = 0; j < 5; j++) {
            var color = 'black';
            if (j < flooredStarRating) {
              color = 'gold';
            }
            starsCommentsTab.push(
              <FontAwesomeIcon icon={faStar} color={color} style={{marginTop: '5', marginRight: '2'}}/>
            );
      }


        return(
            <div>
              <ListGroupItem>{starsCommentsTab}<p>{element.comment}</p></ListGroupItem>
            </div>
        )
      })

      var validation = () => {
        
        if (startHour != null && (prestation != 'Prestation' || experience != 'Expérience')) {
          
          props.appointmentChoice(coiffeur, startHour, props.userChoice.date, prestation, experience, props.selectedShop);
          if (props.user.email) {
            setUserExists(true);
          } else {
            setUserDoesntExists(true);
          }  
        } else {
          setErrorMessage('Veuillez indiquer vos choix');
        }
      }
    
      if (userExists) {
        return(
        <Redirect to='/rendezvous' />
        )
      }

      if (userDoesntExists) {
        return(
          <Redirect to='/connexion' />
          )
      }
    
    var jour = [
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
      'Dimanche',
    ][new Date(props.userChoice.date).getDay()]; 
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
    ][new Date(props.userChoice.date).getMonth()]; 

    var daySelected = jour + ' ' +new Date(props.userChoice.date).getDate()+' '+month

    var weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ][new Date(props.userChoice.date).getDay()];

  let appointmentHoursTab = [];
  var filtre = props.selectedShop.schedule.filter(item => item.dayOfTheWeek === weekday);

  var appointmentDay = new Date(props.userChoice.date).getDate() +' '+ new Date(props.userChoice.date).getMonth() +' '+ new Date(props.userChoice.date).getYear();
  var existingAppointments = []

   for (let i= 0; i<props.selectedShop.appointments.length; i++) {
     var appointment = new Date(props.selectedShop.appointments[i].startDate).getDate() +' '+ new Date(props.selectedShop.appointments[i].startDate).getMonth() +' '+ new Date(props.selectedShop.appointments[i].startDate).getYear();
    if (appointment === appointmentDay) {
      var time = new Date(props.selectedShop.appointments[i].startDate).getHours();
      var minute = new Date(props.selectedShop.appointments[i].startDate).getMinutes();
      existingAppointments.push({hour: time, minutes: minute})
    }
  }
  
  
   for (let i=filtre[0].openingHours; i<filtre[0].closingHours; i+=30) {
     let time = Math.floor(i/60)
     if (time<10) {
       time='0'+time
     }
     let minute = i % 60
     if (minute<10) {
       minute = '0'+minute;
     }


    let count = 0;
      for (let j=0; j<existingAppointments.length; j++) {
        if (existingAppointments[j].hour === time && existingAppointments[j].minutes === minute) {
          count++
        }
      }
    
    if (count >= props.selectedShop.shopEmployees.length) {
      appointmentHoursTab.push(<Button style={{margin: 5, backgroundColor: 'grey', color: 'black'}} >{time}h{minute}</Button>)
    } else {
      appointmentHoursTab.push(<Button style={{margin: 5, backgroundColor: '#FFCD41', color: 'black'}} onClick={() => setStartHour(i)}>{time}h{minute}</Button>)
    }
   }

    return (
      <div className='globalStyle'>
          <Nav />
          
          <Container className='shopPage'>
            

            <Col xs='12' lg='6' >
              <Card style={{marginTop: 50, marginBottom: 10}}>
                <CardBody>
                  <CardTitle tag="h4" style={{fontWeight: 'bold'}}>{props.selectedShop.shopName}</CardTitle>
                  <CardSubtitle tag="h6" className="mb-2 text-muted">{props.selectedShop.shopAddress}</CardSubtitle>
                  <div style={{display: 'flex', flexDirection: 'column'}}>

                    <FontAwesomeIcon icon={faHeart} color='black' style={{margin: '5'}} />
                    <div style={{display: 'flex'}}>{priceTab}</div>
                    <div style={{display: 'flex'}}>{pictoTab}</div>
                    <div style={{display: 'flex'}}>{starsTab}</div>
                    
                  </div>
                
                  <CardText style={{marginTop: 20}}>{props.selectedShop.shopDescription}</CardText>
                </CardBody>
              </Card>
              
              
            </Col>

            <Col xs='12' lg='6' >
              <div style={{marginTop: 50, marginBottom: 10}}>
              <Carousel />
              </div>
            </Col>

            <Col xs='12' lg='6'>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <Dropdown isOpen={dropdownOpenCoiffeur} toggle={toggleCoiffeur}>
                  <DropdownToggle caret style={{margin: 5, backgroundColor:"#AB4242", color: 'white', fontWeight: 'bold'}}>
                    {coiffeur}
                  </DropdownToggle>
                  <DropdownMenu>
                    {coiffeursTab}
                  </DropdownMenu>
                </Dropdown>
              
                <Dropdown isOpen={dropdownOpenPrestation} toggle={togglePrestation}>
                  <DropdownToggle caret style={{margin: 5, backgroundColor:"#AB4242", color: 'white', fontWeight: 'bold'}}>
                    {prestation}
                  </DropdownToggle>
                  <DropdownMenu>
                    {prestationsTab}
                  </DropdownMenu>
                </Dropdown>

                <Dropdown isOpen={dropdownOpenExperience} toggle={toggleExperience}>
                  <DropdownToggle caret style={{margin: 5, backgroundColor:"#AB4242", color: 'white', fontWeight: 'bold'}}>
                    {experience}
                  </DropdownToggle>
                  <DropdownMenu>
                    {experiencesTab}
                  </DropdownMenu>
                </Dropdown>
              </div>
              
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <h5 style={{fontWeight: 'bold', margin: 20}}>Date selectionnée : {daySelected} </h5>
                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                  {appointmentHoursTab}
                </div>

                <Button onClick={() => validation() } style={{margin: 20, backgroundColor:"#4280AB", color: 'white', fontWeight: 'bold', width: '50%'}}>Prendre rendez-vous</Button>
                <p>{errorMessage}</p>
              </div>
            </Col>

            <Col xs='12' lg='6' >
              <ListGroup >
                <div style={{margin: 10, padding: 5, backgroundColor: '#FFCD41'}}>
              <h3 style={{textAlign: 'center', fontWeight: 'bold'}}>Tous les avis du salon</h3>
              {commentsTab}
              </div>
              </ListGroup>
            </Col>

          </Container>
        
      </div>
    );
  } else {
    return(
    <Redirect to='/'/>
    )
  }
}

function mapDispatchToProps(dispatch){
  return {
    appointmentChoice: function(coiffeur, startHour, date, prestation, experience, selectedShop){
      dispatch({
          type: 'addAppointmentChoice',
          appointmentChoice: {coiffeur: coiffeur, startHour: startHour, startDate: date, prestation: prestation, experience: experience, shop: selectedShop},
      })
    }
  }
}

function mapStateToProps(state){
  return {selectedShop: state.selectedShop, userChoice: state.userChoice, user: state.user}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShopScreen);

