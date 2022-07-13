const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

//import routes
const authRoutes = require('./routes/auth');
const { db } = require('./models/User');

//app  RockyM3 
const app = express();

// setting up and connecting to our mongoDB db
mongoose
 .connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
 .then(() => console.log('DB Connected'));

//middlewares
app.use(bodyParser.json());
app.use(cors());

// routes middleware
app.use('/api', authRoutes);

// listening to port 8000  
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on ${port}`)
});