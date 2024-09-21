const removeCartItem = async function(req,res) {
        
        let cart = req.session && req.session.cart || [];
        cart = cart.filter( val => val.slug != req.body.slug );
        req.session.cart = cart;

        return {
            cart: cart
        };

    };

export default removeCartItem;