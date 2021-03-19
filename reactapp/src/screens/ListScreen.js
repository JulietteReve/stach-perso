
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
  console.log(props.userChoice)

  const [shopsData, setShopsData] = useState([]);
  const [defaultLat, setDefaultLat] = useState(48.8534);
  const [defaultLon, setDefaultLon] = useState(2.3488);

  const skater = new Icon({
    iconUrl: "/user.png",
    iconSize: [25, 25]
  });
  
  

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

  if (props.userChoice.date) {


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
      
        <Link to={`/salon`} style={{textDecoration: 'none', width: '40%', margin: '10px'}} >
          <Button style={{backgroundColor: 'white', border: '1px solid white' }} onClick={() => props.selectShop(element)}>
          <Card key={i} style={{border: '1px solid white'}}>
            <CardImg top width="100%" src={element.shopImages[0]} alt="Card image cap" />
            <CardBody>
              <CardTitle tag="h5" style={{fontWeight: 'bold', color: 'black' }}>{element.shopName}</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted" style={{margin: 5}}>{element.shopAddress}</CardSubtitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted" style={{margin: 5}}>{pictoTab}</CardSubtitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted" style={{margin: 5}}>{priceTab}</CardSubtitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted" style={{margin: 5}}>{starsTab}</CardSubtitle>
            </CardBody>
          </Card>
          </Button>
        </Link>
      
    )
  })

  var shopsMarkers = shopsData.map((element, i) => {
    return (
      <Marker key={i} position={[element.latitude, element.longitude]}>
        <Link to={`/salon`}>
        <Button style={{backgroundColor: 'white', border: '1px solid white' }} onClick={() => props.selectShop(element)}>
          <Popup>
          <Card key={i} style={{width: '150px', height: '200px'}}>
            <CardImg  src={element.shopImages[0]} alt="Card image cap" />
            <CardBody>
              <CardTitle style={{fontWeight: 'bold', color: 'black', textAlign: 'center', fontSize: '15px' }}>{element.shopName}</CardTitle>
              <CardTitle style={{color: 'black', textAlign: 'center', fontSize: '10px' }}>{element.shopAddress}</CardTitle>
            </CardBody>
          </Card>
          </Popup>
          </Button>
        </Link>
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
        <div className='listPage' style={{padding: 20}}>
          
            <Col xs='12' md='6' style={{display: 'flex', direction: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                {shopsTab}
            </Col>

            <Col xs='12' md='6' >
              <div className='leaflet-container' style={{display: 'flex', margin: 20, borderRadius: 30}}>
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
  } else {
    return(
      <Redirect to='/' />
    )
  }
}

function mapDispatchToProps(dispatch){
  return {
    selectShop: function(shop){
      dispatch({
        type: 'selectShop',
        shop: shop,
      })
    }
  }
}

function mapStateToProps(state){
  return {userChoice: state.userChoice}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListScreen);