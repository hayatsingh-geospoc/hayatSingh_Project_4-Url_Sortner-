const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const mongoose = require('mongoose')
const router = require('./router/router')
const aws = require("aws-sdk")
const multer = require('multer')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(multer().any())


mongoose.connect('mongodb+srv://pankaj:XHR0F0IrqL14JxKZ@cluster0.ajtoy.mongodb.net/group6-Database-DB',{useNewUrlParser:true})
.then( () =>console.log("mongoose is contected..."))
.catch( err => console.log(err))

app.use('/', router)


app.listen(process.env.PORT || 3000, function() {
    console.log(" Express App Running on port " +  (process.env.PORT || 3000));
});