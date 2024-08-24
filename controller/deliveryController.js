const Cuisine = require('./../models/cuisineModel');
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
// const Reservation = require('../models/reservationModel');
const FoodMenu = require('../models/foodItemModal');
const Delivery = require('../models/deliveryModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.createADelivery = catchAsync(async (req, res, next) => {
  let foodMenu = await FoodMenu.find();
  const allCuisines = await Cuisine.find();
  const orderObject = req.body;

  const user = await User.findById(orderObject.userId);
  if (!user) {
    return next(new AppError('No user with given ID was found', 404));
  }
  if (user.onGoingDeliveriesId.length == 3) {
    return next(
      new AppError('You already have enough on going orders right now', 403),
    );
  }
  // filtering out cuisines with invalid id
  orderObject.orders.cart = allCuisines
    .map((cuisine) =>
      orderObject.orders.cart.filter((order) =>
        cuisine._id.equals(order.cuisineId),
      ),
    )
    .flatMap((item) => item);

  newOrderObj = orderObject.orders.cart.map((item) => {
    return {
      ...item,
      userId: user.id,
      total: item.total,
    };
  });
  await Promise.all(
    newOrderObj.map(async (order) => {
      const newDelivery = await Delivery.create(order);
      // console.log(user);

      await User.findByIdAndUpdate(
        { _id: user.id },
        {
          $push: { onGoingDeliveriesId: newDelivery._id },
        },
      );
    }),
  );

  res.status(200).json({
    status: 'success',
    newOrderObj,
  });
});

exports.getADeliveryData = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const delivery = await Delivery.find({ userId: userId });

  res.status(200).json({
    status: 'success',
    data: {
      delivery,
    },
  });
});

// Business Endpoint - BS
exports.getAllDeliveryDataBS = catchAsync(async (req, res, next) => {
  // for testing purpose only we are taking cuisineId from the url later it will be changed to loggedin user id
  const cuisineId = req.params.cuisineId;
  console.log(cuisineId);

  const allOnGoingDeliveries = await Delivery.findOne({
    cuisineId,
  });

  res.status(200).json({
    status: 'success',
    allOnGoingDeliveries,
  });
});

exports.approveOrRejectADeliveryBS = catchAsync(async (req, res, next) => {
  const orderId = req.params.orderId;
  const order = await Delivery.findById(orderId);
  if (!order) {
    return next(new AppError('No order with given ID was found', 404));
  }
});
