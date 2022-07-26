const express = require('express');
const router = express.Router();
const {User} = require("../models")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { withAuth } = require("../utils/auth")

router.get("/", (req, res) => {
    User.findAll({})
    .then(dbUsers => {
        res.json(dbUsers);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
    });
  });

router.get("/verifyToken", withAuth, (req,res) => {
    res.json({userId: req.user})
})

router.get("/me", withAuth, (req, res) => {
    User.findByPk(req.user,{})
    .then(dbUser => {
        if(!dbUser) {
          return res.status(404).json({msg:'not found'})
        }
        res.json(dbUser);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
    });
});

router.post("/", (req, res) => {
    User.create(req.body, {individualHooks: true})
    .then(newUser => {
        const token = jwt.sign(
          {
            username: newUser.username,
            userId: newUser.id
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "2h"
          }
        );
        res.json({ 
            token: token, 
            user: newUser
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
    });
});

router.post("/login", (req, res) => {
    User.findOne({
      where:{
        username:req.body.username
      }
    })
    .then(dbUser=>{
        if(!dbUser){
          console.log("no user")
            return res.status(403).send({msg:"invalid credentials"})
        } 
        if (bcrypt.compareSync(req.body.password,dbUser.password)) {
            const token = jwt.sign(
              {
                username: dbUser.username,
                userId: dbUser.id
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "2h"
              }
            );
            return res.json({ 
                token: token, 
                user: dbUser
            });
          } else {
            return res.status(403).send({msg:"invalid credentials"});
          }
    }).catch(err=>{
        console.log(err)
        res.status(500).json({msg:"an error occured",err})
    })
});

router.get("/dashboard", (req, res) => {
    //logging header data
    console.log(req.headers);
    //stripping token info from header data
    const token = req.headers?.authorization?.split(" ").pop();
    //login token
    console.log(token);
    //verifying token is valid, was signed with same secret
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      //if err, invalid token, user not authorized
      if (err) {
        console.log(err);
        res.status(403).json({ msg: "invalid credentials", err });
      } else {
        //if no err, user valid, can continue 
        User.findByPk(data.id).then(userData=>{
            console.log(userData.get({plain:true}));
            res.json(`Welcome, ${userData.username}!`)
        })
      }
    });
});
  
module.exports = router;
