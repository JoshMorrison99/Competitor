const express = require('express')
const mongoose = require('mongoose')
const User  = require('./models/user')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const validator = require('validator');
const usernameGenerator = require('username-generator');
require('dotenv').config();

const app = express()

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log("Connected to MongoDB"))

// Create User
app.post('/api/user/create', (req, res) => {
  console.log(req.body)
  email = req.body.email
  password = req.body.password

  // Check if the email is valid
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Check if the password meets the policy criteria
  if (!isPasswordValid(password)) {
    return res.status(400).json({ error: 'Password must be longer than 6 characters' });
  }

  console.log(`[*] Creating User with email: ${email} and password ${password}`)
  const newUser = new User({
    username: usernameGenerator.generateUsername(), // TODO: You will need to check if this random username already exists
    email: email,
    password: password
  })

  newUser.save()
  .then(() => {
    console.log('[*] User Created')
    res.status(201).json({message: 'User created successfully'})
  })
  .catch((error) => {
    console.log(error)
    res.status(500).json({error: 'Error creating user'})
  })
})

// User Login
app.post('/api/user/login', async (req, res) => {
  console.log(req.body)
  try {
      const user = await User.findOne({
          email: req.body.email,
          password: req.body.password
      })

      if (user) {
          const token = jwt.sign({
              userId: user._id, // Add the user ID to the JWT payload
          }, process.env.JWT_SECRET)
          console.log('[*] User login successful')
          res.status(201).json({message: 'User created successfully', jwt: token})

      } else {
        console.log("Error logging in user: User does not exist")
        res.status(500).json({error: 'Email not registered'})
      }
  } catch (error) {
    console.log(error)
    res.status(500).json({error: 'Database Error logging in user'})
  }
})

// Fetch All Runs for a User
app.get('/api/user/run', async (req, res) => {
  console.log(req.body) // This request will be the user's JWT
  const { authorization } = req.headers; // Assuming the JWT is sent in the 'Authorization' header

  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.substring(7); // Remove 'Bearer ' from the token

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId; // Extract the user ID from the decoded JWT payload

      // Use the extracted user ID to perform further operations or queries
      // For example, you can save the run with the associated user ID

      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  } else {
    res.status(401).json({ error: 'No token provided' });
  }
})

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})

// Function to validate the password
function isPasswordValid(password) {
  // Check if the password meets your desired criteria
  // For example, enforce a minimum length of 6 characters
  if (password.length < 6) {
    return false;
  }

  return true;
}
