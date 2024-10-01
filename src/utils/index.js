const _ = require("lodash");
const mongoose = require("mongoose");
const getInfoData = ({ object = {}, fields = [] }) => {
  return _.pick(object, fields);
};
const convertToObjectId = (id) => {
  return new mongoose.Types.ObjectId(id);
}
module.exports = {getInfoData, convertToObjectId};