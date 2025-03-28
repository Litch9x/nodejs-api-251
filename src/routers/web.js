const express = require("express");
const router = express.Router();
const config = require("config");
//import controller
const CategoryController = require("../app/controllers/apis/site/category");
const OrderController = require("../app/controllers/apis/site/order");
const ProductController = require("../app/controllers/apis/site/product");
const AuthController = require("../app/controllers/apis/auth");
const CustomerController = require("../app/controllers/apis/site/customer");

//import middleware
const authMiddleware = require("../app/middlewares/auth")



//router
router.get(`/products`, ProductController.index);
router.get(`/products/:id`, ProductController.show);
router.get(`/products/:id/comments`, ProductController.comments);
router.post(`/products/:id/comments`, ProductController.storeComment);
router.get(`/categories`, CategoryController.index);
router.get(`/categories/:id`, CategoryController.show);
router.get(`/categories/:id/products`, CategoryController.categoryProducts);
router.post("/order", OrderController.order);
router.patch("/order/:id/delivered", OrderController.delivered);

router.post(`/customers/:id/update`,
    // authMiddleware.verifyAuthenticationCustomer,
    CustomerController.update);
router.get(`/customers/:id/orders`,
    // authMiddleware.verifyAuthenticationCustomer,
    OrderController.index);
router.get(`/orders/:id`,
    // authMiddleware.verifyAuthenticationCustomer,
    OrderController.show);
router.patch(`/orders/:id/cancelled`,
    // authMiddleware.verifyAuthenticationCustomer,
    OrderController.cancelled);

router.post(`/customer/login`,
    // authMiddleware.verifyAuthenticationCustomer,
    AuthController.loginCustomer);
router.get(`/auth/refresh-token`, AuthController.refreshToken);
router.post(`/customer/register`, AuthController.registerCustomer);
router.post(`/customer/logout`,
    authMiddleware.verifyAuthenticationCustomer,
    AuthController.logoutCustomer);



module.exports = router;

