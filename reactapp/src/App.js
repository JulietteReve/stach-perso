import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { Provider} from 'react-redux'
import {createStore, combineReducers} from 'redux'

import HomeScreen from './screens/ScreenHome';
import AppointmentScreen from './screens/AppointmentScreen';
import ListScreen from './screens/ListScreen';
import LogOutScreen from './screens/LogOutScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShopScreen from './screens/ShopScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';


import userChoice from './reducers/userChoice.reducer';
import selectedShop from './reducers/selectShop.reducer';
import appointmentChoice from './reducers/appointmentChoice.reducer';
import user from './reducers/user.reducer'

const store = createStore(combineReducers( {userChoice, selectedShop, appointmentChoice, user}))

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route component={HomeScreen} path="/" exact />
          <Route component={AppointmentScreen} path="/rendezvous" exact />
          <Route component={ListScreen} path="/liste" exact />
          <Route component={LogOutScreen} path="/deconnexion" exact />
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
