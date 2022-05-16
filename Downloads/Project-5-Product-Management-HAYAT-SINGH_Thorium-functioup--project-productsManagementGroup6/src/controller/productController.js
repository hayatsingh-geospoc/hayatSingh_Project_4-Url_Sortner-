const res = require('express/lib/response')
const productModel = require('../model/productModel')
const validator = require('../middleware/validation')
const aws = require('../middleware/awsConfig')
const { find, findOneAndUpdate, findByIdAndUpdate } = require('../model/productModel')


const createProduct = async (req, res) => {
    try {
        const data = req.body

        if (Object.keys(data).length === 0) { return res.status(400).send({ status: false, message: "Please enter Data in body" }) }

        const { title, description, price, currencyId, currencyFormat, availableSizes, installments } = data

        if (!validator.isvalid(title)) {
            return res.status(400).send({ status: false, message: "enter title...it is required" })
        }

        const prevTitle = await productModel.findOne({ title: title })
        if (prevTitle) {
            return res.status(400).send({ status: false, message: "Title is already exist...use another one " })
        }

        if (!validator.isvalid(description)) {
            return res.status(400).send({ status: false, message: "enter description...it is required" })
        }


        if (!validator.isvalid(price)) {
            return res.status(400).send({ status: false, message: "enter price...it is required" })
        }
        const convertPrice = Number(price)
        if (isNaN(convertPrice)) {

            return res.status(400).send({ status: false, message: "enter price...it should be number/decimal form" })
        }
        if (price < 1) {
            return res.status(400).send({ status: false, message: "please enter valid price" })
        }


        if (!validator.isvalid(currencyId)) {
            return res.status(400).send({ status: false, message: "enter currencyId...it is required" })
        }
        const CurrencyIds = ['INR', 'USD', 'EUR', 'JPY']
        if (!CurrencyIds.includes(currencyId.trim())) {
            return res.status(400).send({ status: false, message: "enter currencyId format correct you can use ['INR' , 'USD' , 'EUR' ,] it is required" })
        }

        if (!validator.isvalid(currencyFormat)) {
            return res.status(400).send({ status: false, message: "enter  currencyFormat...it is required" })
        }

        const Currencyformate = ['$', '₹', '¥', '€']
        if (!Currencyformate.includes(currencyFormat.trim())) {
            return res.status(400).send({ status: false, message: "enter  currencyFormat correct formate ['$' , '₹' , '¥' , '€']...it is required" })
        }

       
        if (availableSizes == undefined) {
            return res.status(400).send({ status: false, message: "enter at least 1 size" })
        }

        let gavailableSizes = ["S", "XS", "M", "X", "L", "XXL", "XL"]
        for (let i of availableSizes)
            if (!gavailableSizes.includes(i)) return res.status(400).send({ status: false, message: "availableSizes should be from [S, XS,M,X, L,XXL, XL]" })


        const productPic = req.files
        if (productPic && productPic.length > 0) {

            let uploadedFileURL = await aws.productuploadFile(productPic[0])
            data.productImage = uploadedFileURL
        }
        else {
            return res.status(400).send({ message: "No file found" })
        }

        if (installments) {
            if (isNaN(installments)) {
                return res.status(400).send({ status: false, message: "please enter number of month in installment" })
            }
            const changeInstallement = Number(installments)
            const Installments = [3, 6, 9, 12, 24]
            if (!Installments.includes(changeInstallement)) {
                return res.status(400).send({ status: false, message: "please enter valild Installments ['3' , '6' , '9' , '12' , '24] this is required" })
            }
        }

        const createProduct = await productModel.create(data)
        return res.status(201).send({ status: true, message: "product created successfully", data: createProduct })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }

}

const getByFilter = async (req, res) => {
    try {

        let querySize = req.query.size
        let quaryName = req.query.name
        let quarypriceGreaterThan = req.query.priceGreaterThan
        let quarypriceLessThan = req.query.priceLessThan

        let filterquery = { isDeleted: false }

        if (validator.isvalid(querySize)) {
            let gavailableSizes = ["S", "XS", "M", "X", "L", "XXL", "XL"]
            if (!gavailableSizes.includes(querySize)) return res.status(400).send({ status: false, message: "availableSizes should be from [S, XS,M,X, L,XXL, XL]" })
            filterquery['availableSizes'] = querySize
        }


        if (validator.isvalid(quaryName)) {
            filterquery['title'] = { $regex: '^' + `${quaryName}`, $options: 'i' }
        }

        if (validator.isvalid(quarypriceGreaterThan) || validator.isvalid(quarypriceLessThan)) {
            if (validator.isvalid(quarypriceGreaterThan) && validator.isvalid(quarypriceGreaterThan)) {
                if (isNaN(quarypriceGreaterThan) && isNaN(quarypriceGreaterThan)) {
                    res.status(400).send({ status: false, message: "plase enter number" })
                }
                filterquery['price'] = { $gt: quarypriceGreaterThan, $lt: quarypriceLessThan }
            }
            if (validator.isvalid(quarypriceGreaterThan) && !validator.isvalid(quarypriceLessThan)) {
                filterquery['price'] = { $gt: quarypriceGreaterThan }
            }
            if (!validator.isvalid(quarypriceGreaterThan) && validator.isvalid(quarypriceLessThan)) {
                filterquery['price'] = { $lt: quarypriceLessThan }
            }

        }
        let detailsByFilter = await productModel.find(filterquery).sort({price:1})
        if(detailsByFilter.length==0){
            res.status(404).send({status:false,Message:"No such a products available "})
        }else{
        
       return res.status(200).send({ status: true, message: "data fetch successfully", data: detailsByFilter })
        }
        
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

// GET PRODUCT BY PRAMAS
const getproduct = async function (req, res) {
    try {
        const productId = req.params.productId
        console.log(productId)
        if (!validator.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "please provide valid productId" })
        }
        console.log(productId)
        let productData = await productModel.findOne({ _id: productId, isDeleted: false })
        console.log(productData)
        if (productData) {
            return res.status(200).send({ status: true, message: "successfull data found", data: productData })
        } else {
            return res.status(400).send({ status: false, message: "no such product is available" })
        }

    } catch (error) {
        return res.status(500).send({ status: false, err: error.message })

    }
}

// PRODUCT UPDATE
let productUpdate = async function (req, res) {
    try {
        let data1 = req.body
        const data = JSON.parse(JSON.stringify(data1))
        let productID = req.params.productId
        // if (!productID) { res.status(400).send({ status: false, message: "please provide valid ProductId" }) }

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "Invalid request parameters. please provide  details" })
        }
        if (!validator.isValidObjectId(productID)) {
            return res.status(400).send({ status: false, message: "Enter valid productId" })
        }

        console.log()
        const productDetails = await productModel.findById(productID)
        if(!productDetails){
            return res.status(404).send({ status: false, message: "productId not found" })
        }
        console.log(productDetails)
        if (productDetails.isDeleted == false) {

            const { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = data

            let Products = {}

            if (validator.isvalid(title)) {

                const dulipTitle = await productModel.findOne({ title: title })
                if (dulipTitle) { return res.status(400).send({ status: false, message: "please enter another title" }) }
                Products['title'] = title
            }

            if (validator.isvalid(description)) {
                Products['description'] = description
            }

            if (validator.isvalid(isFreeShipping)) {
                Products['isFreeShipping'] = isFreeShipping
            }


            if (validator.isvalid(price)) {
                const convertPrice = Number(price)
                if (isNaN(convertPrice)) {

                    return res.status(400).send({ status: false, message: "enter price...it should be number/decimal form" })
                }
                if (price < 1) {
                    return res.status(400).send({ status: false, message: "please enter valid price" })
                }
                Products['price'] = price    
            }

            if (validator.isvalid(currencyId)) {
                const CurrencyIds = ['INR', 'USD', 'EUR', 'JPY']
                if (!CurrencyIds.includes(currencyId)) {
                    return res.status(400).send({ status: false, message: "enter currencyId format correct you can use ['INR' , 'USD' , 'EUR' ,] it is required" })
                }
                Products['currencyId'] = currencyId
            }

            if (validator.isvalid(currencyFormat)) {
                const Currencyformate = ['$', '₹', '¥', '€']
                if (!Currencyformate.includes(currencyFormat)) {
                    return res.status(400).send({ status: false, message: "enter  currencyFormat correct formate ['$' , '₹' , '¥' , '€']...it is required" })
                }
                Products['currencyFormat'] = currencyFormat
            }


            if (validator.isvalid(style)) {
                Products['style'] = style
            }
            let addavailableSizes = ""
            if (validator.isvalid(availableSizes)) {
                let gavailableSizes = ["S", "XS", "M", "X", "L", "XXL", "XL"]
                if (!gavailableSizes.includes(availableSizes)) return res.status(400).send({ status: false, message: "availableSizes should be from [S, XS,M,X, L,XXL, XL]" })
                addavailableSizes= availableSizes
            }

            if (validator.isvalid(installments)) {
                if (isNaN(installments)) {
                    return res.status(400).send({ status: false, message: "please enter number of month in installment" })
                }
                Products['installments'] = installments
            }

            const profilePic = req.files
            if (profilePic && profilePic.length > 0) {

                let uploadedFileURL = await uploadAws.productuploadFile(profilePic[0])
                Products['profileImage'] = uploadedFileURL
            }

            let newData = await productModel.findOneAndUpdate({ _id: productID }, { $set: Products, $push:{availableSizes:addavailableSizes} }, { new: true })
            return res.status(200).send({ status: true, message: "data updated successfully", data: newData })


        }

        else { res.status(400).send({ status: false, message: "Document already deleted cannot update" }) }
    }
    catch (err) { res.status(500).send({ status: false, message: err.message }) }
}

// DELETE PRODUCT
let deleteProduct = async function (req, res) {
    try {
        let data = req.params.productId

        if (!validator.isValidObjectId(data)) {
            return res.status(400).send({ status: "false" , msg: "please provide  valid productid" })
        }

        let productDetails = await productModel.findById(data)
        console.log(productDetails)
        if (!productDetails) return res.status(404).send({ status: false, message: "product not exist" })
        if (productDetails.isDeleted == false) {
            let deleteProduct = await productModel.findOneAndUpdate({ _id: data }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
            return res.status(200).send({ status: true, message: "successfull delected", data: deleteProduct })
        } else {
            return res.status(404).send({ status: false, message: "product not found" })
        }



    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



module.exports.createProduct = createProduct
module.exports.getByFilter = getByFilter
module.exports.getproduct = getproduct
module.exports.productUpdate = productUpdate
module.exports.deleteProduct = deleteProduct