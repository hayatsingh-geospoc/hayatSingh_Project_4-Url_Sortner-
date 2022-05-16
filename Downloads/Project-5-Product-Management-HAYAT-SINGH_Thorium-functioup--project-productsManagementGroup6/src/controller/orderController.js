const orderModel = require('../model/orderModel')
const cartModel = require('../model/cartModel')
const validator = require('../middleware/validation')
const userModel = require('../model/userModel')
const productModel = require('../model/productModel')
const { DataPipeline } = require('aws-sdk')

const createOrder = async (req, res) => {
    try {
        let data = req.body
        let Userid = req.params.userId


        // if (Object.keys(data).length == 0) {
        //     return res.status(400).send({ status: false, meassage: "please enter data in body " })
        // }

        if (!validator.isValidObjectId(Userid)) {
            return res.status(400).send({ status: false, message: "Enter valid UserId" })
        }

        if (req.decodedToken.UserId = Userid) {
            let user = await userModel.findById(Userid)
            if (!user) {
                return res.status(400).send({ status: false, message: "user is not present" })
            }

            let cartDeatils = await cartModel.findOne({ userId: Userid })

            data.userId = Userid   // assigning userid to req body

            const itemList = cartDeatils.items
            data.items = itemList     // assigning items to req body


            data.totalPrice = cartDeatils.totalPrice  // assigning totalprice to req body

            data.totalItems = cartDeatils.totalItems // assigning totalitems to req body

            let totalquantitye = 0
            for (let i = 0; i < itemList.length; i++) {
                totalquantitye += itemList[i].quantity
            }


            data.totalQuantity = totalquantitye  //assigning totalitems to req body



            // let totalitem=[]
            // const quantityArr = []

            // for(let i=0;i<itemList.length;i++){
            //     const prodid=req.body.items[i].productId

            //     const quantityarray = req.body.items[i].quantity
            //     quantityArr.push(quantityarray)

            //     if(!totalitem.includes(prodid)){
            //         totalitem.push(prodid)
            //     }
            // }

            // let totalpri=0
            // let prodPrice= await productModel.find({_id:items[i].productId})
            // for(i=0;i<prodPrice.length;i++){
            // totalpri= totalpri + prodPrice.price}


            // req.body.totalPrice=totalpri
            // req.body.totalItems=totalitem.length
            // req.body.totalQuantity=quantityArr.length



            let order = await orderModel.create(data)

            return res.status(201).send({ status: true, message: "order created succefully", data: order })


        } else {
            return res.status(403).send({ status: false, message: "authorizatin denied" })
        }

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}






const UpdateOrder = async function (req, res) {


   try {let userId = req.params.userId
    let OrderId = req.body.orderId

    if (Object.keys(req.body).length == 0) {
        return res.status(400).send({ status: false, meassage: "please enter data in body " })
    }

    if (!validator.isvalid(OrderId)) {
        return res.status(400).send({ status: "false" ,  msg: "please provide valid userId" })
    }

    if (!validator.isvalid(userId)) {
        return res.status(400).send({ status: "false" ,  msg: "please provide valid userId" })
    }

    if (!validator.isValidObjectId(userId)) {
        return res.status(400).send({ status: "false" ,  msg: "please provide  valid userid" })
    }

    if (!validator.isValidObjectId(OrderId)) {
        return res.status(400).send({ status: "false" ,  msg: "please provide  valid OrderId" })
    }

     let userDeatils = await userModel.findById(userId)
     if(!userDeatils){
        return res.status(400).send({ status: "false" ,  msg: "user is not present" })
     }


    const cartExist = await cartModel.findOne({ userId: userId })
    
    if (!cartExist) {
         return res.status(400).send({ status: false, message: "No Cart Exist with This User" }) }

    let findOrder = await orderModel.findById(OrderId)
  




    if (req.decodedToken.UserId == userId ) {

        // if (userId != findOrder.userId) { return res.status(400).send({ status: false, message: "User is not valid With this order" }) };

        if (findOrder.cancellable == true && findOrder.status == "pending") {

            let updateData = await orderModel.findOneAndUpdate({_id:OrderId }, { $set: { status: "cancelled" } }, { new: true })

            return res.status(200).send({ status: false, message: "Succesfully Cancled Order", data: updateData });

        }
        else{
            return res.status(400).send({ status: false, message: "this order is not cancellable" })
        }
    }else{
        return res.status(403).send({ status: false, message: "authorizatin denied" })
    }
}catch(err){
    return res.status(500).send({ status: false, message: err.message })
}
}

module.exports.createOrder = createOrder
module.exports.UpdateOrder = UpdateOrder




















