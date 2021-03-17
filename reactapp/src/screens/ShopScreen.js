import React, {useState} from 'react';
import {Container,Row, Col, Card, CardText, CardBody, CardLink,
  CardTitle, CardSubtitle, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import {connect} from 'react-redux';
import Nav from './Nav';
import Carousel from '../components/shopCarousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHeart, faEuroSign, faCoffee, faLeaf, faPaw, faGlassMartini, faGamepad, faWheelchair, faStar} from '@fortawesome/free-solid-svg-icons';



function ShopScreen(props) {
  console.log(props.selectedShop.offers)

  const [dropdownOpenCoiffeur, setDropdownOpenCoiffeur] = useState(false);
  const toggleCoiffeur = () => setDropdownOpenCoiffeur(prevState => !prevState);
  const [dropdownOpenPrestation, setDropdownOpenPrestation] = useState(false);
  const togglePrestation = () => setDropdownOpenPrestation(prevState => !prevState);
  const [dropdownOpenExperience, setDropdownOpenExperience] = useState(false);
  const toggleExperience = () => setDropdownOpenExperience(prevState => !prevState);

  const [coiffeur, setCoiffeur] = useState('Choisir un coiffeur');
  const [prestation, setPrestation] = useState('Choisir une prestation');
  const [experience, setExperience] = useState('Choisir un expérience');

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


  return (
    <div className='globalStyle'>
        <Nav />
        <div className='shopPage'>
          <Col xs='12' md='6' >
            <div style={{marginTop: 50, marginBottom: 50}}>
            <Carousel />
            </div>
          </Col>

          <Col xs='12' md='6' >
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
            <div style={{display: 'flex', justifyContent: 'center'}}>

            <Dropdown isOpen={dropdownOpenCoiffeur} toggle={toggleCoiffeur}>
              <DropdownToggle caret style={{margin: 5, backgroundColor:"#4280AB", color: 'white', fontWeight: 'bold'}}>
                {coiffeur}
              </DropdownToggle>
              <DropdownMenu>
                {coiffeursTab}
              </DropdownMenu>
            </Dropdown>

            <Dropdown isOpen={dropdownOpenPrestation} toggle={togglePrestation}>
              <DropdownToggle caret style={{margin: 5, backgroundColor:"#4280AB", color: 'white', fontWeight: 'bold'}}>
                {prestation}
              </DropdownToggle>
              <DropdownMenu>
                {prestationsTab}
              </DropdownMenu>
            </Dropdown>

            <Dropdown isOpen={dropdownOpenExperience} toggle={toggleExperience}>
              <DropdownToggle caret style={{margin: 5, backgroundColor:"#4280AB", color: 'white', fontWeight: 'bold'}}>
                {experience}
              </DropdownToggle>
              <DropdownMenu>
                {experiencesTab}
              </DropdownMenu>
            </Dropdown>
            </div>
          </Col>
        </div>
       
    </div>
  );
}

function mapStateToProps(state){
  return {selectedShop: state.selectedShop}
}

export default connect(
  mapStateToProps,
  null,
)(ShopScreen);

