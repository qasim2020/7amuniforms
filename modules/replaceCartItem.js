const replaceCartItem = async function(req,res) {

    let cart = req.session && req.session.cart || [];
    cart = cart.filter( val => val.slug != req.body.oldSlug );
    cart = cart.filter( val => val.slug != req.body.slug );
    delete req.body.oldSlug;
    cart.push( req.body );
    req.session.cart = cart;

    return {
        cart: cart
    };

};

export default replaceCartItem;
