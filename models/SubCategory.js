const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class SubCategory extends Model {}

SubCategory.init({
    name: {
        type: DataTypes.STRING,
        allowNull:false,
    },
},{
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'subcategory'
});

module.exports=SubCategory