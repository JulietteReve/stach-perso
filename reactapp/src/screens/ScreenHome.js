import React, {useEffect, useState} from 'react';
import '../App.css';
import {Container, InputGroup, InputGroupText, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem, Popover} from 'reactstrap';
import Nav from './Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSearch, faCalendar } from '@fortawesome/free-solid-svg-icons';
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {fr} from 'date-fns/locale';
import {Link, Redirect} from 'react-router-dom'
import {connect} from 'react-redux';

import Carousel from '../components/carousel';


function HomeScreen (props) {
  registerLocale('fr', fr)
  const prestations = ['TOUTES LES PRESTATIONS', 'COUPE HOMME','COUPE FEMME','COUPE HOMME + BARBE','COUPE HOMME COLORATION','COUPE FEMME COLORATION','COUPE FEMME AFRO', 'COUPE HOMME AFRO', 'COUPE FEMME BALAYAGE', 'COUPE FEMME PERMANENTE']

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);
  const { buttonLabel, fullscreen } = props;
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const [popoverOpen, setPopoverOpen] = useState(false);
  

  const [adress, setAdress] = useState('');
  const [experienceOnModalClick, setExperienceOnModalClick] = useState(null);
  const [adresses, setAdresses] = useState([]);
  const [adressIsSelected, setAdressIsSelected] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [prestation, setPrestation] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [experience, setExperience] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [dateExists, setDateExists] = useState(false);
  
  
  
  useEffect( () => {
    async function loadAdress() {
      if (adressIsSelected === false) {
        if (adress.length > 3) {
          let searchAdress = adress.replace(/ /g, '+');
          var rawResponse = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${searchAdress}&limit=5&autocomplete=1`);
          var response = await rawResponse.json();
          var listAdress = [];
          response.features.map(e => {
            listAdress.push({
              label: e.properties.label,
              latitude: e.geometry.coordinates[1],
              longitude: e.geometry.coordinates[0]
            })
          })
          setAdresses(listAdress)
          setPopoverOpen(true)
        } else {
          setPopoverOpen(false)
        }
      }
    }  
  loadAdress();
}, [adress]);


var adressesTab = adresses.map((element, i) => {
  return(
    <ListGroupItem onClick={() => selectAdress(element)}>{element.label}</ListGroupItem>
  )
})

  var prestationsTab = prestations.map((element, i) => {
    return(
        <DropdownItem key={i} onClick={() => prestationChoice(element)}>{element}</DropdownItem>
    )
  });

  var selectAdress = (element) => {
    
    setAdress(element.label);
    setPopoverOpen(false);
    setUserLocation(element);
    setAdresses([]);
    setAdressIsSelected(true)
  }

  var prestationChoice = (element) => {
    setPrestation(element);
    setExperience(null);
  }

  var handleClickExperience = (item) => {
    setExperienceOnModalClick(item);
    toggleModal();
  };

  var ModalClick = (experience) => {
    toggleModal();
    setExperience(experience);
    setPrestation(null);
    props.userChoice(userLocation, prestation, startDate, experience)
  }

  if (prestation === 'TOUTES LES PRESTATIONS') {
    setPrestation(null);
  }

  var validation = () => {
    if (startDate != null) {
      props.userChoice(userLocation, prestation, startDate, experience);
      setDateExists(true);
    } else {
      setErrorMessage('Veuillez saisir une date')
    } 
  }

  if (dateExists) {
    return(
      <Redirect to='/liste' />
    )
  }
 
  return (
      
    <div className='globalStyle'>
        <Nav />
        <Container className='homePage'>

          <Col xs='12' style={{display: 'flex', flexDirection: 'column' ,alignItems: 'center'}}>
            <h1 style={{fontFamily: 'Caveat', fontSize: '80px', margin: 20}}>'Stach</h1>
            <h3 style={{textAlign: 'center'}}>Trouvez enfin le coiffeur qui VOUS correspond, près de chez vous</h3>
          </Col>

          
          
          <Col xs="12" md="6" style={{height: '40%', display: 'flex', flexDirection:'column', justifyContent: 'space-around'}}>
              
                
                  <InputGroup style={{marginBottom: '10px'}} id="Popover1" onClick={() => setAdressIsSelected(false)}>
                    <InputGroupText>
                      <FontAwesomeIcon icon={faSearch} />
                    </InputGroupText>
                    <Input placeholder="Saisir une adresse" onChange={(e) => setAdress(e.target.value)} value={adress}/>
                  </InputGroup>
                  
                    <Popover placement="bottom" isOpen={popoverOpen} target="Popover1" >
                    {adresses ? 
                  <ListGroup>
                      {adressesTab}
                    </ListGroup>
                    : null }
                    </Popover>
                  
                <div>
              
                  <InputGroup>
                      <InputGroupText>
                        <FontAwesomeIcon icon={faCalendar} />
                      </InputGroupText>
                      <DatePicker 
                        selected={startDate} 
                        onChange={date => setStartDate(date)} 
                        locale='fr' 
                        dateFormat="d MMMM yyyy"
                        minDate={new Date()}
                        placeholderText='Choisir une date'
                      />
                  </InputGroup>
                
                  </div>

                    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                      <DropdownToggle caret style={{backgroundColor: 'white', color: 'black', width: '100%'}}>
                        {prestation ? 
                        prestation 
                        : 'TOUTES LES PRESTATIONS'}
                      </DropdownToggle>
                      <DropdownMenu>
                        {prestationsTab}
                      </DropdownMenu>
                    </Dropdown>

                    <p>{errorMessage}</p>
                    <Button style={{backgroundColor: '#4280AB', width: '100%', fontWeight: 'bold'}}onClick={() => validation()}>VALIDER</Button>
                 

                  {experienceOnModalClick ? 
                  <Modal isOpen={modal} toggle={toggleModal} fullscreen={fullscreen}>
                    <ModalHeader toggle={toggleModal}>{experienceOnModalClick.altText}</ModalHeader>
                    <img style={{width: '100%'}} src={experienceOnModalClick.src} alt={experienceOnModalClick.altText} />
                    <ModalBody>{experienceOnModalClick.description}</ModalBody>
                    <ModalFooter>
                      <Link to='/liste'> 
                        <Button style={{backgroundColor: "#4280AB"}} onClick={() => ModalClick(experienceOnModalClick) }>Vivre cette expérience</Button>{' '}
                      </Link>
                      <Button style={{backgroundColor: "#AB4242"}}  onClick={toggleModal}>Pas cette fois !</Button>
                      
                    </ModalFooter>
                  </Modal>
                  : null}
              </Col>
              <Col xs="12" md="6">
                <Carousel handleClickParent={handleClickExperience}/>
              </Col>
          
        </Container>
       
    </div>
  );
}

function mapDispatchToProps(dispatch){
  return {
    userChoice: function(userLocation, prestation, startDate, experience){
      dispatch({
          type: 'addUserChoice',
          userChoice: {userLocation: userLocation, prestation: prestation, experience: experience, date: startDate},
      })
    }
  }
}


export default connect(
  null,
  mapDispatchToProps
)(HomeScreen);


