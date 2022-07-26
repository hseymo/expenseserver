const express = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const router = express.Router();
const { withAuth } = require("../utils/auth");
const { Category, SubCategory } = require('../models');

router.get("/", (req, res) => {
    Category.findAll({include:[SubCategory]})
      .then(dbCategory => {
        res.json(dbCategory);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
      });
  });

  router.get("/:id", (req, res) => {
    Category.findByPk(req.params.id)
      .then(dbCategory => {
        if(!dbCategory) {
          return res.status(404).json({msg:'not found'})
        }
        res.json(dbCategory);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
      });
  }); 
  
  router.get("/user/me", withAuth, (req, res) => {
    Category.findAll({ 
      where: {
        userId:req.user
      }
    })
      .then(dbCategory => {
        res.json(dbCategory);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
      });
  });

  router.post("/", withAuth, (req, res) => {
    console.log(req.user)
    Category.create({
      userId:req.user,
      name: req.body.name
    })
      .then(newCategory => {
        res.json(newCategory);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
      });
  });

  router.put("/update", withAuth, (req, res) => {
    Category.update(req.body, {
      where: {
        userId: req.user,
        name: req.body.name
      }
    }).then(updatedCategory => {
      if(!updatedCategory[0]) {
        return res.status(404).json({msg:'not found'})
      }
      res.json(updatedCategory);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: "an error occured", err });
    });
  });
  
  router.delete("/user/me/:name", withAuth, (req, res) => {
    Category.destroy({
      where: {
        name: req.params.name,
        userId: req.user
      }
    }).then(delCategory => {
      if(!delCategory) {
        return res.status(404).json({msg:'not found'})
      }
      res.json(delCategory);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: "an error occured", err });
    });
  });
  
  module.exports = router;
  