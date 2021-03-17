
import React, {useEffect} from 'react';
import '../App.css';
import {Container, Row, Col, Card, Button, CardImg, CardTitle, CardText, CardGroup,
  CardSubtitle, CardBody} from 'reactstrap';
import Nav from './Nav';
import {connect} from 'react-redux'
import { useState } from 'react';
import {Link, Redirect} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEuroSign, faCoffee, faLeaf, faPaw, faGlassMartini, faGamepad, faWheelchair, faStar} from '@fortawesome/free-solid-svg-icons';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from "leaflet";


function ListScreen(props) {

  const [shopsData, setShopsData] = useState([]);
  const [defaultLat, setDefaultLat] = useState(48.8534);
  const [defaultLon, setDefaultLon] = useState(2.3488);

  const skater = new Icon({
    iconUrl: "/user.png",
    iconSize: [25, 25]
  });
  console.log('userChoice', props.userChoice);

  useEffect(() => {
    async function getShops() {
      let shopsFetch = await fetch(`/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: props.userChoice }),
      });
      let body = await shopsFetch.json();
      setShopsData(body.filteredDistanceShopsList);
    }
    getShops();
  }, []);

  var shopsTab = shopsData.map((element, i) => {
    var priceTab = [];
    for (let y = 0; y < 3; y++) {
      var color = 'white';
      if (y < element.priceFork) {
        color = '#4280AB';
      }
      priceTab.push(
        <FontAwesomeIcon icon={faEuroSign} color={color} style={{marginRight: '5'}} />
      );
    }

    var pictoTab = [];
    for (let z = 0; z < element.shopFeatures.length; z++) {
      
      let picto = element.shopFeatures[z];
      if (picto === 'wheelchair-alt') {
        pictoTab.push(<FontAwesomeIcon icon={faWheelchair} color={'#4280AB'} style={{marginRight: '5'}}/>)
      } else if (picto === 'glass') {
        pictoTab.push(<FontAwesomeIcon icon={faGlassMartini} color={'#4280AB'} style={{marginRight: '5'}}/>)
      } else if (picto === 'paw') {
        pictoTab.push(<FontAwesomeIcon icon={faPaw} color={'#4280AB'} style={{marginRight: '5'}}/>)
      } else if (picto === 'leaf'){
        pictoTab.push(<FontAwesomeIcon icon={faLeaf} color={'#4280AB'} style={{marginRight: '5'}}/>)
      } else if (picto === 'gamepad') {
        pictoTab.push(<FontAwesomeIcon icon={faGamepad} color={'#4280AB'} style={{marginRight: '5'}}/>)
      } else {
        pictoTab.push(<FontAwesomeIcon icon={faCoffee} color={'#4280AB'} style={{marginRight: '5'}}/>)
      }
    }

    var starsTab = [];
    var flooredStarRating = Math.round(element.rating);
    for (let j = 0; j < 5; j++) {
      var color = '#4280AB';
      if (j < flooredStarRating) {
        color = 'gold';
      }
      starsTab.push(
        <FontAwesomeIcon icon={faStar} color={color}/>
      );
    }



    return (
      <Link to='/shop' style={{textDecoration: 'none', width: '40%', margin: '10px'}}>
        <Card key={i} >
          <CardImg top width="100%" src={element.shopImages[0]} alt="Card image cap" />
          <CardBody>
            <CardTitle tag="h5" style={{fontWeight: 'bold', color: 'black' }}>{element.shopName}</CardTitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted">{element.shopAddress}</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted">{pictoTab}</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted">{priceTab}</CardSubtitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted">{starsTab}</CardSubtitle>
          </CardBody>
        </Card>
      </Link>
    )
  })

  var shopsMarkers = shopsData.map((element, i) => {
    return (
      <Marker key={i} position={[element.latitude, element.longitude]}>
        <Popup>
        <Card key={i} style={{width: '150px', height: '200px'}}>
          <CardImg  src={element.shopImages[0]} alt="Card image cap" />
          <CardBody>
            <CardTitle style={{fontWeight: 'bold', color: 'black', textAlign: 'center', fontSize: '15px' }}>{element.shopName}</CardTitle>
            <CardTitle style={{color: 'black', textAlign: 'center', fontSize: '10px' }}>{element.shopAddress}</CardTitle>
          </CardBody>
        </Card>
        </Popup>
      </Marker>
  )})
  
  let userMarker;
  if (props.userChoice.userLocation) {
    userMarker = 
    <Marker position={[props.userChoice.userLocation.latitude, props.userChoice.userLocation.longitude]} icon={skater}>
    <Popup>
      ma position
    </Popup>
  </Marker>
  }


  

  return (
      
    <div className='globalStyle'>
        <Nav />
        <div className='listPage'>
          
            <Col xs='12' md='6' style={{display: 'flex', direction: 'row', flexWrap: 'wrap', alignContent: 'space-around'}}>
                {shopsTab}
            </Col>

            <Col xs='12' md='6' >
              <div className='leaflet-container'>
                <MapContainer center={[defaultLat, defaultLon]} zoom={12}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {userMarker}
                {shopsMarkers}
              </MapContainer>
            </div> 
          </Col>
         

          
          
        </div>
       
    </div>
  );
}

function mapStateToProps(state){
  return {userChoice: state.userChoice}
}

export default connect(
  mapStateToProps,
  null
)(ListScreen);