var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const uid2 = require('uid2');
const { signUpValidation, signInValidation } = require('../validation');
const UserModel = require('../models/users');
const CommentModel = require('../models/comments');
const AppointmentModel = require('../models/appointments');
const ShopModel = require('../models/shops');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// SIGN UP
router.post('/signUp', async function (req, res, next) {
  //validation des données via join (validation.js)
  const { error } = signUpValidation(req.body);
  if (error) {
    console.log(error.details[0].message);
    return res.json({ result: false, error: error.details[0].message });
  }

  // on vérifie que le iuse rn'existe pas encore en base de données (via son email)
  const emailIsExist = await UserModel.findOne({ email: req.body.email });
  if (emailIsExist) {
    return res.json({ result: false, emaiExist: "l'email existe déjà" });
  }

  // Chiffrage du mot de passe
  const cost = 10;
  const hashedPassword = bcrypt.hashSync(req.body.password, cost);

  const newUser = new UserModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    password: hashedPassword,
    favorites: [],
    status: 'customer',
    token: uid2(32),
    loyaltyPoints: 0,
  });

  try {
    const savedUser = await newUser.save();
    console.log(savedUser);
    res.json({ result: true, savedUser, token: savedUser.token });
  } catch (error) {
    console.log(error);
    res.json({ result: false, error });
  }

});

// SIGN IN
router.post('/signIn', async function (req, res, next) {
  let result = false;

  // validation des données via join (validation.js)
  const { error } = signInValidation(req.body);

  if (error) {
    return res.json({ result: false, error: error.details[0].message });
  }

  // validation de l'existance du user, populate avec ses appointment 
  const user = await UserModel.findOne({ email: req.body.email }).populate('appointments').exec();;

  if (!user) {
    return res.json({
      result: false,
      emailNotFound: "L'e-mail est introuvable",
    });
  }

  // validation du mot de passe 
  const validPass = await bcrypt.compareSync(req.body.password, user.password);

  if (!validPass) {
    result = false;
    return res.json({
      result: false,
      invalidPassword: 'Mot de passe non associé',
    });
  } else {
    res.json({ result: true, user, token: user.token });
  }
});


router.get('/myProfile/:token', async function (req, res, next) {

  // création tableau des Id des appointments du user
  const tokenUser = req.params.token;
  const user = await UserModel.findOne({ token: tokenUser })

  const appointIds = [];
  user.appointments.forEach((userAppoint) => {
    appointIds.push(userAppoint._id);
  });

  console.log('user', user);


  try {
    
    const appointments = await AppointmentModel.find({
      _id: { $in: appointIds },
    });

    // création du tableau des shops associés aux appointments précédents
    const shopsIds = [];
    appointments.forEach((appointment) => {
      shopsIds.push(appointment.shopId);  
    });

    const shops = [];
    for (let i = 0; i < shopsIds.length; i++) {
      const shop = await ShopModel.findById(shopsIds[i]);
      shops.push(shop);
    }

    res.json({ result: true, appointments, shops });
  } catch (error) {
    res.json({ result: false, error });
  }
});


router.put('/addcomment', async function (req, res, next) {

  var shop = await ShopModel.findById(req.body.shop_id);

  var newComment = new CommentModel({
    comment: req.body.comment,
    rating: +req.body.rating,
    commentDate: new Date(),
  });

  var saveComment = await newComment.save();

  await UserModel.updateOne(
    { token: req.body.token },
    { $push: { comments: saveComment._id } }
  );

  await ShopModel.updateOne(
    { _id: req.body.shop_id },
    { $push: { comments: saveComment._id } }
  );

  var newRating =
    (+req.body.rating + shop.rating * shop.comments.length) /
    (shop.comments.length + 1);

  await ShopModel.updateOne({ _id: req.body.shop_id }, { rating: newRating });

  await AppointmentModel.updateOne(
    { _id: req.body.appointmentId },
    { commentExists: true }
  );

  res.json({ result: true, comment: saveComment });
});

module.exports = router;
