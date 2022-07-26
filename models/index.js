const User = require("./User")
const Category = require("./Category")
const SubCategory = require("./SubCategory")

User.hasMany(Category);
Category.belongsTo(User);

Category.hasMany(SubCategory);
SubCategory.belongsTo(Category);

module.exports = {
    User,
    Category, 
    SubCategory
};