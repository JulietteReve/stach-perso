import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {provider, Provider} from 'react-redux'
import {createStore, combineReducers} from 'redux'

import HomeScreen from './screens/ScreenHome';
import AppointmentScreen from './screens/AppointmentScreen';
import ContactScreen from './screens/ContactScreen';
import DetailScreen from './screens/DetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import FiltresScreen from './screens/FiltresScreen';
import ListScreen from './screens/ListScreen';
import LogOutScreen from './screens/LogOutScreen';
import MapScreen from './screens/MapScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShopScreen from './screens/ShopScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';

import userChoice from './reducers/userChoice.reducer'

const store = createStore(combineReducers( {userChoice}) )

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route component={HomeScreen} path="/" exact />
          <Route component={AppointmentScreen} path="/rendezvous" exact />
          <Route component={ContactScreen} path="/contact" exact />
          <Route component={DetailScreen} path="/detail" exact />
          <Route component={FavoritesScreen} path="/favoris" exact />
          <Route component={FiltresScreen} path="/filtres" exact />
          <Route component={ListScreen} path="/liste" exact />
          <Route component={LogOutScreen} path="/deconnexion" exact />
          <Route component={MapScreen} path="/plan" exact />
          <Route component={ProfileScreen} path="/profil" exact />
          <Route component={ShopScreen} path="/salon" exact />
          <Route component={SignInScreen} path="/connexion" exact />
          <Route component={SignUpScreen} path="/inscription" exact />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
