const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { dbConnect } = require('./utiles/db');

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));
app.use(bodyParser.json())
app.use(cookieParser())

app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/dashboard/categoryRoutes'));
app.use('/api', require('./routes/dashboard/productRoutes'));

const port = process.env.PORT || 5000;

dbConnect()

app.listen(port, () => console.log(`Server is running on port ${port}`));
