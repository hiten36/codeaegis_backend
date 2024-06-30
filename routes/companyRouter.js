const express=require('express');
const { getCompanies, postCompany, putCompany, deleteCompany } = require('../controllers/companyController');
const router=express.Router();

router.get('/getCompanies', async(req,res)=>{
    try {
        const ans=await getCompanies({...req.query});

        if(!ans.status)
        {
            res.status(400).json(ans);
        }
        res.json(ans);
    } catch (error) {
        res.status(400).json({status: false, message: error?.message});
    }
});

router.post('/postCompany', async(req,res)=>{
    try {
        const ans=await postCompany({...req.body});

        if(!ans.status)
        {
            res.status(400).json(ans);
        }
        res.json(ans);
    } catch (error) {
        console.log(error);
        res.status(400).json({status: false, message: error?.message});
    }
});

router.put('/putCompany/:id', async(req,res)=>{
    try {
        const ans=await putCompany({...req.body, id: req.params.id});

        if(!ans.status)
        {
            res.status(400).json(ans);
        }
        res.json(ans);
    } catch (error) {
        res.status(400).json({status: false, message: error?.message});
    }
});

router.post('/deleteCompany', async(req,res)=>{
    try {
        const ans=await deleteCompany({...req.body});

        if(!ans.status)
        {
            res.status(400).json(ans);
        }
        res.json(ans);
    } catch (error) {
        res.status(400).json({status: false, message: error?.message});
    }
});

module.exports=router;
