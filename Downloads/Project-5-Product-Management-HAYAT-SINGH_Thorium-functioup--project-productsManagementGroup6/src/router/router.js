const express = require('express')
const { route } = require('express/lib/application')
const res = require('express/lib/response')
const router = express.Router()
const userController = require('../controller/userContoller')
const auth = require('../middleware/middleware')
const productController = require('../controller/productController')
const cartController = require('../controller/cartController')
const orderController = require('../controller/orderController')


// user Api
router.post('/register' ,userController.registration)

router.post('/login' , userController.loginUser)

router.get('/user/:userId/profile' ,auth.authentication ,userController.getUser )

router.put('/user/:userId/profile',auth.authentication,userController.updateUser)

// product Api
router.post('/products' , productController.createProduct)

router.get('/products' , productController.getByFilter)

router.get('/products/:productId', productController.getproduct)

router.put('/products/:productId' , productController.productUpdate)

router.delete('/products/:productId' , productController.deleteProduct)

// CART API
router.post('/users/:userId/cart',auth.authentication, cartController.createCart )

router.put('/users/:userId/cart', auth.authentication,cartController.updateCart )

router.get('/users/:userId/cart', auth.authentication,cartController.getCart)

router.delete('/users/:userId/cart' ,auth.authentication, cartController.deleteCart)


// order api
router.post('/users/:userId/orders' ,auth.authentication, orderController.createOrder)

router.put('/users/:userId/orders', auth.authentication, orderController.UpdateOrder)



module.exports = router