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
  let MaxMinutes = 1439;
  let MinMinutes = 0;
  //let completeDate = null;
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
  

  // Nous convertissons l'heure choisi par le user en minutes. MaxMinutes pour filtrer sur l'heure d'ouverture et MinMinutes pour filtrer sur l'heure de fermeture
  if (req.body.data.hour) {
    let hourSelected = moment(new Date(req.body.data.hour)).locale('fr').format('LT');
    MaxMinutes = (+hourSelected.split(':')[0]) * 60 + (+hourSelected.split(':')[1]);
    MinMinutes = MaxMinutes - 60;
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
    // // atHome: type,
    rating: { $gte: rating },
    priceFork:  priceFork,
    shopFeatures: picto,
    schedule: {
      $elemMatch: {
        dayOfTheWeek: weekday,
        openingHours: { $lte: MaxMinutes },
        closingHours: { $gte: MinMinutes },
      },
    },
  })
    .populate('appointments')
    .populate('comments')
    .exec();

  
//Reconstitution de l'UTC si date et heure choisi par le user
let completeDate = null;
if (req.body.data.date && req.body.data.hour) {
  let d = req.body.data.date;
  let h = req.body.data.hour;
  completeDate = d.replace('T'+d[11]+d[12]+':'+d[14]+d[15], 'T'+h[11]+h[12]+':'+h[14]+h[15]);
  completeDate = new Date(completeDate)
}

// A partir de l'UTC reçu, nous filtrons les shops ayant des disponibilités à la date et l'horaire indiqué par le user. 
  let filteredAppointmentsShopsList = [];
  for (let i = 0; i < shopsList.length; i++) {
    if (completeDate != null) {
      let numberOfEmployees = null;
      let counterOfAppointments = null;
      numberOfEmployees = shopsList[i].shopEmployees.length;
      for (let j = 0; j < shopsList[i].appointments.length; j++) {
        if (
          completeDate > shopsList[i].appointments[j].startDate &&
          completeDate < shopsList[i].appointments[j].endDate
        ) {
          counterOfAppointments = counterOfAppointments + 1;
        }
      }
      if (counterOfAppointments < numberOfEmployees) {
        filteredAppointmentsShopsList.push(shopsList[i]);
      }
    } else {
      filteredAppointmentsShopsList.push(shopsList[i]);
    }
  }



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
  let distanceMax = 4000;

  let filteredDistanceShopsList = [];

  for (let i = 0; i < filteredAppointmentsShopsList.length; i++) {
    
    if (longitude && latitude) {
      let distance = Math.floor(
        getDistanceFromLatLonInKm(
          latitude,
          longitude,
          filteredAppointmentsShopsList[i].latitude,
          filteredAppointmentsShopsList[i].longitude,
        )
      );
      console.log
      if (distance < distanceMax) {
        filteredDistanceShopsList.push(filteredAppointmentsShopsList[i]);
      }
    } else {
      filteredDistanceShopsList.push(filteredAppointmentsShopsList[i]);
    }
  }
  res.json({ filteredDistanceShopsList });
});

// route pour enregistrer les shops via postman - NE PAS EFFACER LES CHAMPS COMMENTÉS //
// router.post('/addShop', async function (req, res, next) {
//   var newShop = new ShopModel({
//     shopName: req.body.shopName,
//     shopImages: [
//       req.body.shopImage1,
//       req.body.shopImage2,
//       req.body.shopImage3,
//       req.body.shopImage4,
//     ],
//     shopAddress: req.body.shopAddress,
//     shopPhone: req.body.shopPhone,
//     shopMail: req.body.shopMail,
//     shopDescription: req.body.shopDescription,
//     shopFeatures: [
//       req.body.shopFeatures1,
//       req.body.shopFeatures2,
//       req.body.shopFeatures3,
//       req.body.shopFeatures4,
//     ],
//     shopEmployees: [
//       req.body.shopEmployee1,
//       req.body.shopEmployee2,
//       req.body.shopEmployee3
//     ],
//     offers: [
//       {
//         type: req.body.offerName1,
//         price: req.body.offerPrice1,
//         duration: req.body.offerDuration1,
//       },
//       {
//         type: req.body.offerName2,
//         price: req.body.offerPrice2,
//         duration: req.body.offerDuration2,
//       },
//       {
//         type: req.body.offerName3,
//         price: req.body.offerPrice3,
//         duration: req.body.offerDuration3,
//       },
//       {
//         type: req.body.offerName4,
//         price: req.body.offerPrice4,
//         duration: req.body.offerDuration4,
//       },
//       {
//         type: req.body.offerName5,
//         price: req.body.offerPrice5,
//         duration: req.body.offerDuration5,
//       },
//       {
//         type: req.body.offerName6, 
//         price: req.body.offerPrice6, 
//         duration: req.body.offerDuration6
//       }
//     ],
//     packages: [
//       {
//         type: req.body.packageName1,
//         price: req.body.packagePrice1,
//         duration: req.body.packageDuration1,
//         description: req.body.packageDescription1,
//       },
//       {
//         type: req.body.packageName2,
//         price: req.body.packagePrice2,
//         duration: req.body.packageDuration2,
//         description: req.body.packageDescription2,
//       },
//       {
//         type: req.body.packageName3, 
//         price: req.body.packagePrice3, 
//         duration: req.body.packageDuration3, 
//         description: req.body.packageDescription3
//       }
//     ],
//     schedule: [
//       {
//         dayOfTheWeek: 'Monday', 
//         openingHours: req.body.openingHoursMonday, 
//         closingHours: req.body.closingHoursMonday
//       },
//       {
//         dayOfTheWeek: 'Tuesday',
//         openingHours: req.body.openingHoursTuesday,
//         closingHours: req.body.closingHoursTuesday,
//       },
//       {
//         dayOfTheWeek: 'Wednesday',
//         openingHours: req.body.openingHoursWednesday,
//         closingHours: req.body.closingHoursWednesday,
//       },
//       {
//         dayOfTheWeek: 'Thursday',
//         openingHours: req.body.openingHoursThursday,
//         closingHours: req.body.closingHoursThursday,
//       },
//       {
//         dayOfTheWeek: 'Friday',
//         openingHours: req.body.openingHoursFriday,
//         closingHours: req.body.closingHoursFriday,
//       },
//       {
//         dayOfTheWeek: 'Saturday',
//         openingHours: req.body.openingHoursSaturday,
//         closingHours: req.body.closingHoursSaturday,
//       },
//       {
//       dayOfTheWeek: 'Sunday', 
//       openingHours: req.body.openingHoursSunday, 
//       closingHours: req.body.closingHoursSunday
//     },
//     ],
//     atHome: req.body.atHome,
//     rating: 0,
//     latitude: req.body.latitude,
//     longitude: req.body.longitude,
//   });

//   await newShop.save();

//   res.json({ result: true });
// });

// router.put('/addPriceFork', async function (req, res, next) {
//   var shop = await ShopModel.findOne({ shopName: req.body.shopName });

//   var totalPrice = 0;
//   var numberOfOffer = 0;
//   for (let i = 0; i < shop.offers.length; i++) {
//     totalPrice += shop.offers[i].price;
//     numberOfOffer++;
//   }
//   var averagePrice = totalPrice / numberOfOffer;

//   var priceFork;
//   if (averagePrice < 50) {
//     priceFork = 1;
//   } else if (averagePrice < 70) {
//     priceFork = 2;
//   } else {
//     priceFork = 3;
//   }

//   await ShopModel.updateOne(
//     { shopName: req.body.shopName },
//     { priceFork: priceFork }
//   );

//   res.json({ result: true });
// });

/* route de validation de la base de données 
  -> reducer stockant toutes les infos du rdv choisis (reducer créé au moment de la validation du rdv sur la page détail coiffeur)  
*/
router.post('/addappointment/:token', async function (req, res, next) {
  console.log(req.body);
  console.log(req.params.token)
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

router.get('/shop/:id', async function (req, res, next) {
  var shop = await ShopModel.findById(req.params.id)
    .populate('appointments')
    .populate('comments')
    .exec();
  // console.log(shop);

  res.json({ result: true, shop: shop });
});


router.get('/favorites', async function (req, res, next){
  
  var favoriteShops = await UserModel.findOne({token: req.query.token})
// console.log(favoriteShops.favorites)
var listID = []
favoriteShops.favorites.forEach((item)=>{
  listID.push(item)
})

// console.log(listID)
// db.collection.find( { _id : { $in : [ObjectId('1'),ObjectId('2')] } } );
 var foundFavorites =  await ShopModel.find({_id: { $in: listID} }).populate('comments').populate('appointments').exec()
// console.log("FOUND", foundFavorites)
  res.json({result: true, favoriteShops: foundFavorites})
})

router.post('/favorites', async function (req, res, next){
  
    await UserModel.updateMany(
    {token : req.body.token},
    {$push : {favorites: req.body.id}}
    )
    

    res.json({result: true})

})


router.post('/deleteFavorites', async function (req, res, next){
  
  await UserModel.updateMany(
  {token : req.body.token},
  {$pull : {favorites: req.body.id}}
  )

  res.json({result: true})

})

module.exports = router;
