const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const taskRoute = require('./task.route');
const orderRoute = require('./order.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
