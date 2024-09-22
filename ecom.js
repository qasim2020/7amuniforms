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

import { registerHelpers } from './helpers/hbsHelpers.js';
import landingPage from './modules/landingPage.js';
import loadMore from './modules/loadMore.js';
import quickView from './modules/quickView.js';
import cartUpdate from './modules/cartUpdate.js';
import replaceCartItem from './modules/replaceCartItem.js';
import removeCartItem from './modules/removeCartItem.js';
import changeCartQuantity from './modules/changeCartQuantity.js';
import getProduct from './modules/getProduct.js';

// Create an Express application
const app = express();

// Get the __filename and __dirname equivalent
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

// Move session middleware outside of MongoDB connection callback
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

// Register Handlebars helpers
registerHelpers(); 

// Route handling
app.get('/', async (req, res) => {
    req.params.brand = "7am";
    const data = await landingPage(req, res);
    res.render('home', data);
});

app.get('/product/:slug', async (req,res) => {
    req.params.brand = "7am";
    const data = await getProduct(req,res);
    res.render('product.hbs', data);
});


app.post('/cartUpdate', async (req, res) => {
    req.params.brand = "7am";
    const data = await cartUpdate(req, res);
    res.status(200).send(data);
});

app.post('/replaceCartItem', async (req, res) => {
    req.params.brand = "7am";
    const data = await replaceCartItem(req, res);
    res.status(200).send(data);
});

app.post('/removeCartItem', async (req, res) => {
    req.params.brand = "7am";
    const data = await removeCartItem(req, res);
    res.status(200).send(data);
});

app.post('/changeCartQuantity', async (req, res) => {
    req.params.brand = "7am";
    const data = await changeCartQuantity(req, res);
    res.status(200).send(data);
});

app.get('/quick-view/:id', async (req,res) => {
    req.params.brand = "7am";
    const data = await quickView(req,res);
    res.status(200).send(data);
});

app.post('/load-more', async (req,res) => {
    req.params.brand = "7am";
    const data = await loadMore(req,res);
    res.status(200).send(data);
});

// Error handling
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

// Start the server
const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
