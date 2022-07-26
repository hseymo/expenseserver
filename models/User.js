const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require("bcrypt");

class User extends Model {}

User.init({
    email: {
        type: DataTypes.STRING,
        unique:true,
        allowNull:false,
        validate:{
            isEmail:true
        }
   },
    username: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    password: {
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            len:[8]
        }
    }
},{
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user', 
    hooks:{
        beforeCreate: newUser=>{
            newUser.password = bcrypt.hashSync(newUser.password,4);
            return newUser
        }
    }
});

module.exports=User