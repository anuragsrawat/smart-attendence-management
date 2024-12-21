const express = require("express");
const app = express();
const methodOverride=require("method-override");

const path = require("path");
const mongoose = require("mongoose");
const Student = require("./models/attendance.js"); // Make sure this is defined if you're using it

// Set up EJS view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(methodOverride("_method"));

// Middleware to serve static files and parse incoming requests
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/student");
    console.log("Connection successful");
  } catch (err) {
    console.log("Error connecting to MongoDB:", err);
  }
}
main();

// Define LCS function for pattern matching
function lcs(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  let dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  // Build the dp table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n]; // Return the length of the longest common subsequence
}

// Render the pattern page
app.get("/", (req, res) => {
  res.render("pattern.ejs");
});

// Handle the attendance submission
// Handle the attendance submission
app.get("/yourattendance", (req, res) => {
  const { sapId, patternString, latitude, longitude } = req.query;

  // Check if patternString is provided
  if (!patternString || patternString.trim() === "") {
    return res.send("Pattern String cannot be empty.");
  }

  // Parse latitude and longitude
  const receivedLatitude = parseFloat(latitude);
  const receivedLongitude = parseFloat(longitude);

  // Predefined latitude, longitude, and pattern
  const predefinedData = {
    latitude: 30.344,  // Example latitude
    longitude: 77.903, // Example longitude
    pattern: "ABCDEFGHIJ" // Predefined 10-character pattern
  };

  // Check if latitude and longitude match (within a tolerance range)
  const latitudeTolerance = 0.001;  // You can adjust this tolerance based on your needs
  const longitudeTolerance = 0.001;

  const isLatitudeMatch = Math.abs(receivedLatitude - predefinedData.latitude) < latitudeTolerance;
  const isLongitudeMatch = Math.abs(receivedLongitude - predefinedData.longitude) < longitudeTolerance;

  // Calculate LCS for pattern matching
  const lcsLength = lcs(patternString, predefinedData.pattern);

  // Check if LCS length is at least a threshold (e.g., 7 out of 10 for a match)
  const lcsThreshold = 7;
  const isPatternMatch = lcsLength >= lcsThreshold;

  // Logging the received data
  console.log("Received Data:");
  console.log("SAP ID:", sapId);
  console.log("Pattern String:", patternString);
  console.log("Latitude:", receivedLatitude);
  console.log("Longitude:", receivedLongitude);
 
  // Send response based on validation
  if (isLatitudeMatch && isLongitudeMatch && isPatternMatch) {
    // Pass sapId to present.ejs
    res.render("present.ejs", { sapId: sapId });
  } else {
    // Pass sapId to absent.ejs
    res.render("absent.ejs", { sapId: sapId });
  }
  
});





app.put("/yourattendance/:sapId", async (req, res) => {
  try {
    // Extract sapId from URL parameters
    const { sapId } = req.params;

    // Find the student by sapId
    const student = await Student.findOne({ sapId });

    if (!student) {
      return res.status(404).send('Student not found');
    }

    // Increment totalClasses and classAttended
    student.totalClasses += 1;
    student.classesAttended += 1;

    // Save the updated student data
    await student.save();

    // Respond with a success message or render the appropriate view
    res.send("Attendance confirmed and updated successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating attendance");
  }
});





// Start the server
app.listen(8000, () => {
  console.log("Listening at port 8000");
});
