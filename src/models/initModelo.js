const User = require("./user.model");
const Repairs = require("./repairmen.model");

const initModel = () => {
  User.hasMany(Repairs);
  Repairs.belongsTo(User);
  // Repairs.hasMany(Repairs);
};

module.exports = initModel;
