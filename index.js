require('dotenv').config();
require('./db/conn');
const cors=require('cors');
const express=require('express');
const path = require('path');
const port=5001;
const app=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/screenshots', express.static(path.join(__dirname, 'screenshots')));

const companyRouter=require('./routes/companyRouter');
const Company = require('./models/Company');
app.use('/company', companyRouter);

// const t=async()=>{
//     await Company.deleteMany();
// }
// t();

app.listen(port, ()=>{
    console.log('Listening ...');
});
