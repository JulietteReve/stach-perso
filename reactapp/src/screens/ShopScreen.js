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
  console.log('user', props.user)

  const [dropdownOpenCoiffeur, setDropdownOpenCoiffeur] = useState(false);
  const toggleCoiffeur = () => setDropdownOpenCoiffeur(prevState => !prevState);
  const [dropdownOpenPrestation, setDropdownOpenPrestation] = useState(false);
  const togglePrestation = () => setDropdownOpenPrestation(prevState => !prevState);
  const [dropdownOpenExperience, setDropdownOpenExperience] = useState(false);
  const toggleExperience = () => setDropdownOpenExperience(prevState => !prevState);
  

  const [coiffeur, setCoiffeur] = useState('Coiffeur');
  const [prestation, setPrestation] = useState('Prestation');
  const [experience, setExperience] = useState('Expérience');
  const [startDate, setStartDate] = useState(null);
  const [startHour, setStartHour] = useState(null);
  // const [userValidation, setUserValidation] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [userExists, setUserExists] = useState(false);
  const [userDoesntExists, setUserDoesntExists] = useState(false);

  useEffect(() => {
    setStartHour(props.userChoice.hour);
    setStartDate(props.userChoice.date)
    if (props.userChoice.experience != null) {
        setExperience(props.userChoice.experience);
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
          <DropdownItem onClick={() => {setPrestation(element.type); setExperience('Choisir un expérience')}}>{`${element.type} ${element.price}€`}</DropdownItem>
        )
      })

      var experiencesTab = props.selectedShop.packages.map((element, i) => {
        return(
          <DropdownItem onClick={() => {setExperience(element.type); setPrestation('Choisir une prestation')}}>{`${element.type} ${element.price}€`}</DropdownItem>
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
        console.log('je rentre dans la validation')
        if (startHour != null && startDate != null && (prestation != 'Prestation' || experience != 'Expérience')) {
          console.log('tout existe')
          props.appointmentChoice(coiffeur, startHour, startDate, prestation, experience, props.selectedShop);
          if (props.user.email) {
            console.log('jai un email')
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

    return (
      <div className='globalStyle'>
          <Nav />
          
          <Container className='shopPage'>
            <Col xs='12' lg='6' >
              <div style={{marginTop: 50, marginBottom: 10}}>
              <Carousel />
              </div>
            </Col>

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
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: 10}}>
              <InputGroup >
                        <InputGroupText style={{backgroundColor: '#FFCD41'}}>
                          <FontAwesomeIcon icon={faCalendar} color='black' />
                        </InputGroupText>
                        <DatePicker 
                          selected={startDate} 
                          onChange={date => setStartDate(date)} 
                          locale='fr' 
                          dateFormat="d MMMM yyyy"
                          minDate={new Date()}
                        />
                    </InputGroup>

                    <InputGroup>
                    <InputGroupText style={{backgroundColor: '#FFCD41'}}>
                      <FontAwesomeIcon icon={faClock} color='black' />
                    </InputGroupText>
                    <DatePicker 
                      selected={startHour} 
                      onChange={date => setStartHour(date)} 
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Time"
                      dateFormat="hh:mm aa"
                      // locale='fr' 
                    />
                </InputGroup>
                
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                      <Button onClick={() => validation() } style={{margin: 5, backgroundColor:"#4280AB", color: 'white', fontWeight: 'bold', width: '50%'}}>Prendre rendez-vous</Button>
                      <p>{errorMessage}</p>
                </div>
              
            </Col>

            <Col xs='12' lg='12' >
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
    appointmentChoice: function(coiffeur, startHour, startDate, prestation, experience, selectedShop){
      dispatch({
          type: 'addAppointmentChoice',
          appointmentChoice: {coiffeur: coiffeur, startHour: startHour, startDate: startDate, prestation: prestation, experience: experience, shop: selectedShop},
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

