const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const addsRouter = require('./Routers/addsRouter'); // Import adds router
const { sequelize } = require('./Models/addsModel'); // Import Sequelize connection
const path = require('path'); 

const app = express();

// Middleware
app.use(cors({
    origin: '*',  // Allow all origins, or specify your frontend origin
  }));
  
app.use(express.json());
dotenv.config(); 


// Serve the images folder
app.use('/dialus/api/images', express.static(path.join(__dirname, 'images')));

// Email sending route
app.post('/dialus/api/send-email', async (req, res) => {
    const { name, email, message } = req.body;
  
    // Check if all fields are provided
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      // Create a transporter using Gmail SMTP
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,  // Your Gmail address from .env file
          pass: process.env.GMAIL_PASS,  // Your Gmail App Password from .env file
        },
      });
  
      // Define email options
      let mailOptions = {
        from: email,  // Sender's email address (user input)
        to: process.env.GMAIL_USER,  // Your email address to receive messages
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
  
      // Success response
      return res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Error sending email:', error.message);
      return res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
  });
  
  app.get('/dialus/api/test', async (req, res) => {
    return res.status(200).json({ message: 'test successfully!' });
  })

// Connect to MySQL
// sequelize.authenticate()
//     .then(() => {
//         console.log('Connected to MySQL database!');
//         return sequelize.sync();
//     })
//     .then(() => {
//         console.log('database connected sucessfully!');
//     })
//     .catch((error) => {
//         console.error('Unable to connect to the database:', error);
//     });

// Adds routing
app.use('/dialus/api/adds', addsRouter);

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


