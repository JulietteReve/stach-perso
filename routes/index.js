var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var uid2 = require('uid2')
var moment = require('moment')
var UserModel = require('../models/users');
var ShopModel = require('../models/shops');
var CommentModel = require('../models/comments');
var AppointmentModel = require('../models/appointments');
const { date } = require('joi');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/search', async function (req, res, next) {
  
  // par defaut, tous les éléments du filtre sont initialisé à {$exists: true} afin que si le champ n'est pas rempli, nous allions chercher tous les shops 
  let latitude = null;
  let longitude = null;
  let weekday = { $exists: true };
  let quoi = { $exists: true };
  let package = { $exists: true };
  let picto = { $exists: true };
  let rating = 0;
  let priceFork = { $exists: true };

  // puis on initialise les éléments du filtre avec les données récupérés dans la recherche en frontend
  req.body.data.rating ? (rating = req.body.data.rating) : null;
  req.body.data.priceFork ? (priceFork = req.body.data.priceFork) : null;
  req.body.data.prestation ? (quoi = req.body.data.prestation) : null;
  req.body.data.experience ? (package = req.body.data.experience.altText) : null;
  req.body.data.service ? (picto = req.body.data.service) : null;
  req.body.data.userLocation ? (latitude = req.body.data.userLocation.latitude) : null;
  req.body.data.userLocation ? (longitude = req.body.data.userLocation.longitude) : null;

  
  // nous souhaitons récupérer la jour de la semaine choisi grace à la methide getDay()
  if (req.body.data.date != null) {
    weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ][new Date(req.body.data.date).getDay()];
  }

// je récupère la liste des shops filtrés par prestations, experience, note, fourchette de prix, services, et horaires d'ouverture
  var shopsList = await ShopModel.find({
    offers: {
      $elemMatch: {
        type: quoi,
      },
    },
    packages: {
      $elemMatch: {
        type: package,
      },
    },
    rating: { $gte: rating },
    priceFork:  priceFork,
    shopFeatures: picto,
    schedule: {
      $elemMatch: {
        dayOfTheWeek: weekday,
      },
    },
  })
    .populate('appointments')
    .populate('comments')
    .exec();

// fonction de calcul de la distance entre deux points grace à leur latitude et leur longitude
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 3963; // Radius of the earth in miles
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in miles
    return d;
  }
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  
  // dernier filtre pour limiter la distance des shops autour de l'adresse saisie par le user (4 miles)
  let distanceMax = 4;

  let filteredDistanceShopsList = [];

  for (let i = 0; i < shopsList.length; i++) {
    
    if (longitude && latitude) {
      let distance = Math.floor(
        getDistanceFromLatLonInKm(
          latitude,
          longitude,
          shopsList[i].latitude,
          shopsList[i].longitude,
        )
      );
      console.log
      if (distance < distanceMax) {
        filteredDistanceShopsList .push(shopsList[i]);
      }
    } else {
      filteredDistanceShopsList .push(shopsList[i]);
    }
  }
  res.json({ filteredDistanceShopsList });
});

// cette route enregistre les rendez-vous en base de données, dans la collection rendez-vous mais aussi comme clefs étrangères dans le user et le shop
router.post('/addappointment/:token', async function (req, res, next) {
  
  try {
  var newAppointment = new AppointmentModel({
    chosenOffer: req.body.chosenOffer,
    chosenPrice: req.body.chosenPrice,
    chosenEmployee: req.body.chosenEmployee,
    startDate: new Date(req.body.startDate),
    endDate: new Date(req.body.endDate),
    chosenPayment: req.body.chosenPayment,
    appointmentStatus: req.body.appointmentStatus,
    shopId: req.body.shop_id,
    commentExists: false,
  });

  var saveAppointment = await newAppointment.save();

  await ShopModel.updateOne(
    { _id: req.body.shop_id },
    { $push: { appointments: saveAppointment._id } }
  );

  await UserModel.updateOne(
    { token: req.params.token },
    { $push: { appointments: saveAppointment._id },
      $inc: {loyaltyPoints: req.body.loyaltyPoints},
    }
  );

    res.json({ result: true });
  } catch {
    res.json({ result: false });
  }
});


module.exports = router;
