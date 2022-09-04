const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const taskRoute = require('./task.route');
const orderRoute = require('./order.route');
const collectRoute = require('./collect.route');
const linePayRoute = require('./linepay.route');
const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/task',
    route: taskRoute,
  },
  {
    path: '/order',
    route: orderRoute,
  },
  {
    path: '/collect',
    route: collectRoute,
  },
  {
    path: '/linepay',
    route: linePayRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
