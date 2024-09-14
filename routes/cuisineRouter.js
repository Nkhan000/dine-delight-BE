const express = require('express');
const cuisineController = require('../controller/cuisineController');
const authController = require('../controller/authController');
const reviewController = require('../controller/reviewController');
const reservationController = require('../controller/reservationController');
const deliveryController = require('../controller/deliveryController');

const router = express.Router();

// Param middleware -> here middleware func should be in the controller file as a middleware
// router.params("id", middlewareFunc)

router.route('/').get(cuisineController.getAllCuisines);
router
  .route('/create-new-cuisine')
  .post(authController.protect, cuisineController.createACuisine);

// CREATE A CUSINE
// router.route("/").get(cuisineController.createACuisine)

// IMPLEMENT A ROUTE TO GET A CUISINE DATA FOR BUSINESS DASHBOARD CONTAINING ALL THE USEFULL INFORMATION AND INSIGHTS OF THE CUISINE
router
  .route('/businessProfile')
  .get(
    cuisineController.cuisineExist,
    authController.protect,
    cuisineController.getCuisineForBusiness,
  );

// Get All cuisines with similar services
router.route('/service/:serviceName').get(cuisineController.getService);

// THIS ROUTE IS PUBLIC SO THAT IMPORTANT AND SENSITIVE DATA LIKE CERTIFICATE, NUMBER,OWNER,ETC MUST BE HIDDEN IN THIS ROUTE. NOT IMPLEMENTED YET
// GETCUISINE AND FOOD MENU/ RESERVATION / VENUES
router
  .route('/:id')
  .get(cuisineController.cuisineExist, cuisineController.getCuisineData);

// FOOD MENU

router
  .route('/update-menu-items')
  .post(authController.protect, cuisineController.addItemsToMenu)
  .patch(cuisineController.cuisineExist, cuisineController.removeItemsFromMenu);

// -----------------REVIEW ROUTES FOR A CUISINES-------------------- //

// CREATE a new review
router
  .route('/:id/new-review')
  .post(authController.protect, reviewController.createAReview);

// GET all reviews for a cuisine
router
  .route('/:id/get-all-reviews')
  .get(cuisineController.cuisineExist, reviewController.getAllReviews);

// GET a review for a cuisine
router.route('/get-review/:reviewId').get(reviewController.getAReview);

// ---------------- BOOKING ITEMS AND BOOKINGS ROUTES FOR A CUISINE --------------------- //
router
  .route('/add-new-venue')
  .post(authController.protect, cuisineController.addVenueItem);

// ---------------- RESERVATION ROUTEES FOR A CUISINE --------------------- //

// GET All reservations for a single cuisine
// router
//   .route('/reservations/all-reservations/:id')
//   .get(
//     authController.protect,
//     reservationController.getAllReservationsForBussiness,
//   );

// GET a reservation by ID for a cuisine
// router
//   .route('/reservations/:reservationId')
//   .get(authController.protect, reservationController.getAReservation);

// CREATE a new reservation from user
router
  .route('/:id/reservations/new-reservation')
  .post(authController.protect, reservationController.createAReservation);

// VERIFY/CANCEL functionality for reservations
router
  .route('/reservations/verify-reservation/:reservationId')
  .patch(authController.protect, reservationController.verifyReservation);

// ---------------- DELIVERY ROUTEES FOR A CUISINE --------------------- //

router
  .route('/delivery/new')
  .post(authController.protect, deliveryController.createADelivery);
router
  .route('/delivery/get-one')
  .get(authController.protect, deliveryController.getADeliveryData);

// ---------------- DELIVERY ROUTEES FOR A CUISINE (BUSINESS) --------------------- //
router
  .route('/business/delivery/all/:cuisineId')
  .get(deliveryController.getAllDeliveryDataBS);
module.exports = router;
