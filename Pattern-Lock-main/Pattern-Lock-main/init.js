const mongoose = require("mongoose");
const Student = require("./models/attendance.js"); // Make sure this is defined if you're using it
async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/student");
    console.log("Connection successful");
  } catch (err) {
    console.log("Error connecting to MongoDB:", err);
  }
}
Student.insertMany([
  {
    name: "Amit Sharma",
    sapId: "500109933",
    classesAttended: 20,
    totalClasses: 20
  },
  {
    name: "Priya Verma",
    sapId: "500109934",
    classesAttended: 15,
    totalClasses: 20
  },
  {
    name: "Ravi Patel",
    sapId: "500109935",
    classesAttended: 18,
    totalClasses: 20
  },
  {
    name: "Sanya Gupta",
    sapId: "500109936",
    classesAttended: 17,
    totalClasses: 20
  },
  {
    name: "Rahul Kumar",
    sapId: "500109937",
    classesAttended: 19,
    totalClasses: 20
  },
  {
    name: "Neha Reddy",
    sapId: "500109938",
    classesAttended: 16,
    totalClasses: 20
  },
  {
    name: "Vikram Singh",
    sapId: "500109939",
    classesAttended: 20,
    totalClasses: 20
  },
  {
    name: "Anjali Mehta",
    sapId: "500109940",
    classesAttended: 14,
    totalClasses: 20
  },
  {
    name: "Manish Joshi",
    sapId: "500109941",
    classesAttended: 18,
    totalClasses: 20
  },
  {
    name: "Shivani Sharma",
    sapId: "500109942",
    classesAttended: 15,
    totalClasses: 20
  }
]).then(() => {
  console.log("students inserted successfully");
}).catch((err) => {
  console.error("Error inserting students", err);
});
