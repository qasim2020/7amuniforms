const changeCartQuantity = async function(req, res) {

        let cartItem = req.session && req.session.cart && req.session.cart.find( val => val.slug == req.body.slug );
        cartItem.quantity = req.body.quantity;

        let cart = req.session && req.session.cart || [];
        cart = cart.filter( val => val.slug != req.body.slug );
        cart.push(cartItem);

        req.session.cart = cart;

        return {
            cart: cart
        };

    };

export default changeCartQuantity;