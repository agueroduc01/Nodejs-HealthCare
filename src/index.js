import morgan from 'morgan';
import express from 'express';

import configViewEngine from './config/viewEngine';
import initWebRouter from './routes/web';
import db from './config/connectDB';
import initAPIRouter from './routes/api';
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// HTTP logger (middleware)
// app.use(morgan('combined'));

// Config to send data from client to server (POST)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    next();
})

//Template Engine
configViewEngine(app);

initWebRouter(app);

// init API Route
initAPIRouter(app);

db.connection();

// Middleware handle 404 not Found
app.use((req, res, next) => {
    return res.render('404notFound', {layout: false});
})

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));