require('dotenv').config;
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
//https://myaccount.google.com/lesssecureapps 
//Allow less secure apps: OFF / ON

router.get('/contactus', function (req, res, next){
    // get all form fields and then send email to the user with all form fields.
    res.render('contact/contactus');
  });

  router.post('/contactus', function (req, res, next){
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    
    let mailOptions = {
        from: req.body.email,
        to: req.body.email,
        subject: req.body.need,
        text: req.body.message
    };
    
    transporter.sendMail(mailOptions, function(error,data){
        if(error){
            console.log('Error in sending Email');
        }else{
            console.log('Email Sent');
        }
    });

   res.render('contact/contactus');
  });

module.exports = router;