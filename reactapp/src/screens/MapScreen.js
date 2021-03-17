import React from 'react';
import {Container,Row} from 'reactstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'




function MapScreen() {
  return (
    <MapContainer center={[45.4, -75.7]} zoom={12}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    />
  </MapContainer>
  );
}

export default MapScreen; 