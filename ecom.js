import express from 'express';
import hbs from 'hbs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { connect } from 'mongoose';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import session from 'express-session';
import bodyParser from 'body-parser';

import config from './config000.json' assert { type: 'json' };

import landingPage from './modules/landingPage.js';

// Create an Express application
const app = express();

// Get the __filename and __dirname blogsequivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var envConfig = config['development'];
Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
});

// Connect to MongoDB
connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, })
    .then(() => { console.log('MongoDB connected'); })
    .catch((err) => { console.error('MongoDB connection error:', err); });

mongoose.connection.once('open', () => {
    app.use(
        session({
            secret: process.env.sessionSecret,
            resave: false,
            saveUninitialized: true,
            cookie: {
                maxAge: 20 * 60 * 1000, // 20 minutes
            },
            rolling: true,
            store: MongoStore.create({
                mongoUrl: process.env.MONGODB_URI
            })
        })
    );
    
});

app.use(express.static(join(__dirname, 'static')));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 1000000
}));

// Set up view engine
app.set('view engine', 'hbs');
app.set('views', join(__dirname, 'views'));

// Register partials
hbs.registerPartials(join(__dirname, 'views/partials'));

hbs.registerHelper('getDay', function(date) {
    let input = new Date(date);

    return input.getDate();
});

// Helpers


// Route handling
app.get('/', async (req, res) => {
    req.params.brand = "dedicated_parents";
    const data = await landingPage(req, res);
    res.render('home', data);
});

// Error handling
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

// Start the server
const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});