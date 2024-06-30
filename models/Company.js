const mongoose=require('mongoose');

const mySchema=mongoose.Schema({
    url: String,
    name: String,
    title: String,
    description: String,
    logo: String,
    facebook: String,
    linkedin: String,
    twitter: String,
    instagram: String,
    address: String,
    phone: String,
    email: String,
    screenshot: String
});

const Company=mongoose.model('Company', mySchema);

module.exports=Company;
