import all from './all.js';

const landingPage = async function(req,res) {
    return {
        owner: await all.getOwnerContactDetails(req,res),
        products: await all.trendingProducts(req,res),
        newProducts: await all.newProducts(req,res),
        sale: await all.saleProducts(req,res),
        categories: await all.categories(req,res),
        randomProducts: await all.randomProducts(req,res),
        cart: req.session.cart != undefined ? req.session.cart : []
    }
};

export default landingPage;