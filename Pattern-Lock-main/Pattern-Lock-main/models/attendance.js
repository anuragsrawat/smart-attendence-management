const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/studentAttendance', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Connection failed', err));

// Define the Schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sapId: {
    type: String,
    required: true,
    unique: true, 
  },
  classesAttended: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalClasses: {
    type: Number,
    default: 0,
    min: 0, 
  },
});


const Student = mongoose.model('Student', studentSchema);

module.exports = Student;