const mongoose=require('mongoose');
//require('mongoose-type-url');

const urlSchema = new mongoose.Schema(
{ 

    longUrl: {type:String, required:true}, 

    shortUrl: {type:String, required:true, unique: true},

    urlCode: {type:String, required:true, unique: true, lowercase: true, trim:true }, 

},
{ timestamps: true }
);
module.exports = mongoose.model("URL", urlSchema);

