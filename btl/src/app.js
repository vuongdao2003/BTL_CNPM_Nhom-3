const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const webRouter =require('./routes/web.js')
const configViewEngine = require('./config/viewEngine.js')
const path =require('path');
const cookieParser = require('cookie-parser')
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// Connect to MongoDB
mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process if unable to connect to MongoDB
  });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//Khai bao router
app.use('/',webRouter);
app.use(express.static('./public'));
//config template engine
configViewEngine(app);
// Start the server
app.listen(PORT, () => {
    console.log('http://localhost:'+PORT);
  });
  