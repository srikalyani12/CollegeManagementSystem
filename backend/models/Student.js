const mongoose = require('mongoose');
const StudentSchema = new mongoose.Schema({
  name: String,
  rollNo: String,
  course: String,
  feesPaid: Number,
  feesDue: Number
}, {timestamps:true});
module.exports = mongoose.model('Student', StudentSchema);