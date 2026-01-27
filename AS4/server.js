const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
require('dotenv').config();
const AWS = require('aws-sdk');
const s3 = new AWS.S3({region: process.env.AWS_REGION});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public')); 
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api', apiRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));