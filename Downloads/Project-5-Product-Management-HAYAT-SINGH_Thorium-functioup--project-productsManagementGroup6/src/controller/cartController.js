const cartModel = require('../model/cartModel')
const userModel = require('../model/userModel')
const prodModel = require('../model/productModel')
const validator = require('../middleware/validation')
const { findOneAndUpdate, update } = require('../model/cartModel')


// const createCart = async (req, res) => {
//     try {

//         const data = req.body
//         const UserId = req.params.userId
//         for(let i=0;i<data.items;i++){
//             if(data.items[i].quantity == 0){
//                 return res.status(400).send({status:false, message:"enter valiald quality"})
//             }
//         }


//         if (Object.keys(data).length == 0) {
//             return res.status(400).send({ status: false, meassage: "please enter data in body " })
//         }
//         if (req.decodedToken.UserId == UserId) {
//             let prevCart = await cartModel.findOne({ userId: UserId })
//             if (!prevCart || prevCart == null) {
//                 const pricearr = []
//                 const quantityArr = []
//                 let totalPriceOfProducts = 0
//                 let totalQualityOfProducts = 0
//                 const itemList = req.body.items
//                 for (let i = 0; i < itemList.length; i++) {
//                     const productIds = itemList[i].productId
//                     const productDetails = await prodModel.findById(productIds)
//                     if (!productDetails) { return res.status(400).send({ status: false, message: "product not found" }) }
//                     const priceDetailsarray = productDetails.price
//                     pricearr.push(priceDetailsarray)
//                     const quantityarray = req.body.items[i].quantity
//                     quantityArr.push(quantityarray)
//                     // its always coming in a new array every time  
//                 }
//                 for (let j = 0; j < quantityArr.length; j++) {
//                     totalPriceOfProducts += pricearr[j] * quantityArr[j]
//                     totalQualityOfProducts += quantityArr[j]
//                 }
//                 req.body.totalPrice = totalPriceOfProducts
//                 req.body.totalItems = data.items.length

//                 let cart = await cartModel.create(data)
//                 return res.status(201).send({ status: true, message: "cart data created successfully", data: cart })

//             } else {
//                 const {items} = data
//                 console.log(items[0].productId)
//                 console.log(prevCart.items.productId)
//                  givenitems = data.items
//                 if(items[0].productId ==prevCart.items[0].productId ){

//                 }

//                 let upCart = await cartModel.findOneAndUpdate({ userId: UserId }, { $push: { items: data.items }, $set: filter }, { new: true })
//                 return res.status(200).send({ status: true, message: "cart data added successfully in a cart", data: upCart })
//             }
//         }
//         else {
//             return res.status(403).send({ status: false, message: "authorizatin denied" })
//         }


//     } catch (err) {

//         return res.status(500).send({ status: false, message: err.message })

//     }
// }

const createCart = async (req, res) => {
    try {

        const data = req.body
        const UserId = req.params.userId

        // if (!validator.isValidObjectId(req.body.productId)) {
        //     return res.status(400).send({ status: false, message: "productid is not valid" })
        // }

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, meassage: "please enter data in body " })
        }

        if (!validator.isValidObjectId(UserId)) {
            return res.status(400).send({ status: false, message: "Enter valid UserId" })
        }
        if (!validator.isValidObjectId(req.body.userId)) {
            return res.status(400).send({ status: false, message: "Enter valid UserId" })
        }


        if (req.decodedToken.UserId == UserId) {
            let prevCart = await cartModel.findOne({ userId: UserId })

            if (!prevCart || prevCart == null) {
                const { items } = data

                if (items.length == 0) {
                    return res.status(400).send({ status: false, message: "enter items to add" })
                }

                if (items[0].quantity == 0) {
                    return res.status(400).send({ status: false, message: "Enter valid quantity" })
                }

                let productId = items[0].productId

                let productDetails = await prodModel.findById(productId)
                if (!productDetails) {
                    return res.status(400).send({ status: false, message: "enter valiad product id" })
                }

                let totalValue = productDetails.price * items[0].quantity
                data.totalPrice = totalValue
                let totalItems = items.length
                data.totalItems = totalItems

                let cart = await cartModel.create(data)
                return res.status(201).send({ status: true, message: "cart data created successfully", data: cart })

            } else {
                if (!validator.isValidObjectId(req.body.cartId)) {
                    return res.status(400).send({ status: false, message: "cartid is not valid" })
                }
                let newitems = prevCart.items
                let filter = {}
                const { items } = data
                if (items.length == 0) {
                    return res.status(400).send({ status: false, message: "enter items to add" })
                }

                if (items[0].quantity == 0) {
                    return res.status(400).send({ status: false, message: "Enter valid quantity" })
                }

                let productId = items[0].productId

                let productDetails = await prodModel.findById(productId)
                if (!productDetails) {
                    return res.status(400).send({ status: false, message: "enter valiad product id" })
                }

                let newQuanity = items[0].quantity
                let newPrice = productDetails.price * items[0].quantity
                console.log(data.items[0].quantity)

                let initial = 0
                for (let i = 0; i < prevCart.items.length; i++) {
                    if (prevCart.items[i].productId == productId) {
                        newitems[i].quantity = prevCart.items[i].quantity + newQuanity
                        initial = 1
                        console.log("hi+ match")
                    }
                }

                if (initial == 0) {
                    newitems.push(items[0])
                }
                console.log(initial)

                tatalvalue = prevCart.totalPrice + newPrice



                let upCart = await cartModel.findOneAndUpdate({ userId: UserId }, { $set: { items: newitems, totalPrice: tatalvalue, totalItems: newitems.length } }, { new: true })
                return res.status(200).send({ status: true, message: "cart data added successfully in a cart", data: upCart })
            }
        }
        else {
            return res.status(403).send({ status: false, message: "authorizatin denied" })
        }


    } catch (err) {

        return res.status(500).send({ status: false, message: err.message })

    }
}


// update api
const updateCart = async (req, res) => {
    try {
        let data = req.body
        let removeProduct = req.body.removeProduct
        let userId = req.params.userId
        let cartId = req.body.cartId
        let productId = req.body.productId

        if (Object.keys(data).length === 0) { return res.status(400).send({ status: false, message: "Please enter Data in body" }) }

        if (!validator.isvalid(productId)) {
            return res.status(400).send({ status: false, message: "enter productid...it is required" })
        }
        if (!validator.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Enter valid productId" })
        }
        let productDeatils = await prodModel.findOne({ _id: productId, isDeleted: false })
        if (!productDeatils) {
            return res.status(400).send({ status: false, message: "product is not present" })
        }

        if (!validator.isvalid(cartId)) {
            return res.status(400).send({ status: false, message: "enter cartId...it is required" })
        }
        if (!validator.isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, message: "Enter valid cartId" })
        }
        let cartDeatils = await cartModel.findById(cartId)
        if (!cartDeatils) {
            return res.status(400).send({ status: false, message: "cart is not present" })
        }

        if (!validator.isvalid(userId)) {
            return res.status(400).send({ status: false, message: "enter userId...it is required" })
        }
        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Enter valid userId" })
        }
        let userDeatils = await userModel.findById(userId)
        if (!userDeatils) {
            return res.status(400).send({ status: false, message: "user is not present" })
        }

        if (!validator.isvalid(removeProduct)) {
            return res.status(400).send({ status: false, message: "enter removeProduct...it is required" })
        }
        if (!(removeProduct == 1 || removeProduct == 0)) {
            return res
                .status(400)
                .send({ status: false, message: `invalid input - remove Product key Should Be a number 1 or 0` })
        }

        if (req.decodedToken.UserId == userId) {
            if (removeProduct == 0) {

                let filter = {}
                let CartProductQuantity = 0
                let flage = 0
                if (cartDeatils.items.length == 0) {
                    return res.status(404).send({ status: false, message: "no product found" })
                }

                let count = 0
                for (let k = 0; k < cartDeatils.items.length; k++) {
                    if (cartDeatils.items[k].productId == productId.trim()) {
                        count++
                    }

                }


                if (count < 1) { return res.status(400).send({ Status: true, msg: "Product does not exist in cart" }) }

                for (let i = 0; i < cartDeatils.items.length; i++) {

                    if (productId == cartDeatils.items[i].productId) {
                        filter['items'] = cartDeatils.items[i]
                        CartProductQuantity = cartDeatils.items[i].quantity

                    }
                }

                console.log(filter)

                let productpriceofcart = CartProductQuantity * productDeatils.price
                let totalprices = cartDeatils.totalPrice - productpriceofcart
                let filterlength = Object.keys(filter).length
                let totalitem = cartDeatils.items.length - filterlength

                let reduceCart = await cartModel.findOneAndUpdate({ _id: cartId }, { $pull: filter, $set: { totalPrice: totalprices, totalItems: totalitem } })

                return res.status(200).send({ status: true, message: "Product Removed from Cart", data: productDeatils })




            }



            if (removeProduct == 1) {
                let newitems = cartDeatils.items
                let lessValue = productDeatils.price
                let totalprices = cartDeatils.totalPrice

                console.log(newitems)
                for (let i = 0; i < cartDeatils.items.length; i++) {

                    if (productId == newitems[i].productId) {
                        if (cartDeatils.items[i].quantity > 1 || cartDeatils.items[i].quantity == 2) {
                            console.log(newitems[i].quantity)
                            newitems[i].quantity = newitems[i].quantity - 1
                            console.log(newitems[i].quantity)
                            break;
                        }
                        if (cartDeatils.items[i].quantity == 1) {
                            newitems.pull(cartDeatils.items[i])
                            break;
                        }

                    }
                }


                let reduceCart = await cartModel.findOneAndUpdate({ _id: cartId }, { $set: { items: newitems, totalPrice: totalprices - lessValue, totalItems: newitems.length } })

                return res.status(200).send({ status: true, message: "its quantity has to be decremented by 1", data: productDeatils })


            }
        } else {
            return res.status(403).send({ status: false, message: "authorizatin denied" })
        }



    } catch (err) {

        return res.status(500).send({ status: false, message: err.message })

    }
}





// get Api
let getCart = async function (req, res) {
    try {

        let UserId = req.params.userId.trim()

        if (!validator.isValidObjectId(UserId)) {
            return res.status(400).send({ status: false, message: "please provide valid UserId" })
        }



        if (req.decodedToken.UserId == UserId) {
            let productDeatils = []
            let userDetails = await userModel.findById(UserId)
            if (!userDetails) {
                return res.status(400).send({ status: false, message: "user not found" })
            }

            let cartData = await cartModel.findOne({ userId: UserId })
            if (!cartData) {
                return res.status(200).send({ status: false, message: "cart is not present" })
            }

            for (let i = 0; i < cartData.items.length; i++) {
                let idOfproductinCart = cartData.items[i].productId
                let pwd = await prodModel.find({ _id: idOfproductinCart })
                productDeatils.push(pwd)
            }

            res.status(200).send({ status: true, message: "successful", Cart: cartData, Products: productDeatils })

        }

        else {
            return res.status(403).send({ status: false, message: "authorization failed" })
        }

    }
    catch (err) { res.status(500).send({ msg: err.message }) }
}




// Delete Api
const deleteCart = async (req, res) => {
    try {

        let userid = req.params.userId

        if (!validator.isValidObjectId(userid)) {
            return res.status(400).send({ status: false, message: "please enter valid userid" })
        }

        let userDetails = await userModel.findById(userid)
        if (!userDetails) {
            return res.status(400).send({ status: false, message: "user is not present" })
        }

        if (req.decodedToken.UserId == userid) {

            let cart = await cartModel.findOne({ userId: userid })
            if (cart.totalPrice == 0) {
                return res.status(404).send({ status: false, message: "cart not found" })
            }
            if (cart) {

                let deleteC = await cartModel.findOneAndUpdate({ userId: userid }, { $set: { items: [], totalItems: 0, totalPrice: 0 } }, { new: true })
                return res.status(204).send({ status: true, message: "cart deleted successfully", data: deleteC })

            } else {
                return res.status(404).send({ status: false, message: "cart not found for given userId" })
            }

        } else {
            return res.status(403).send({ status: false, message: "authorization failed" })
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.createCart = createCart
module.exports.updateCart = updateCart
module.exports.getCart = getCart
module.exports.deleteCart = deleteCart









