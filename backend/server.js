require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cms_db';
mongoose.connect(MONGO, {useNewUrlParser:true, useUnifiedTopology:true})
  .then(()=> console.log('Mongo connected'))
  .catch(err=> console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server started on port', PORT));