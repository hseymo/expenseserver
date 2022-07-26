const express = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const router = express.Router();
const { withAuth } = require("../utils/auth");
const { SubCategory, Category } = require('../models');

router.get("/", (req, res) => {
    SubCategory.findAll()
      .then(dbSubCategory => {
        res.json(dbSubCategory);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
      });
  });

  router.get("/:id", (req, res) => {
    SubCategory.findByPk(req.params.id)
      .then(dbSubCategory => {
        if(!dbSubCategory) {
          return res.status(404).json({msg:'not found'})
        }
        res.json(dbSubCategory);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
      });
  }); 
  
  router.get("/user/me", withAuth, (req, res) => {
    SubCategory.findAll({ 
      where: {
        userId:req.user
      }
    })
      .then(dbSubCategory => {
        res.json(dbSubCategory);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
      });
  });

  router.post("/", withAuth, (req, res) => {
    console.log(req.user)
    SubCategory.create({
      userId:req.user,
      name: req.body.name
    })
      .then(newSubCategory => {
        res.json(newSubCategory);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
      });
  });

  router.put("/update", withAuth, (req, res) => {
    SubCategory.update(req.body, {
      where: {
        userId: req.user,
        name: req.body.name
      }
    }).then(updatedSubCategory => {
      if(!updatedSubCategory[0]) {
        return res.status(404).json({msg:'not found'})
      }
      res.json(updatedSubCategory);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: "an error occured", err });
    });
  });
  
  router.delete("/user/me/:name", withAuth, (req, res) => {
    SubCategory.destroy({
      where: {
        name: req.params.name,
        userId: req.user
      }
    }).then(delSubCategory => {
      if(!delSubCategory) {
        return res.status(404).json({msg:'not found'})
      }
      res.json(delSubCategory);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: "an error occured", err });
    });
  });
  
  module.exports = router;
  