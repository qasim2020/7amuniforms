import all from "./all.js";
import createModel from "./createModel.js";
import quickView from "./quickView.js";

const getProduct = async function(req, res) {

    console.log(req.params.slug);

    let model = await createModel(`${req.params.brand}-products`);
    let product = await model.findOne({slug: req.params.slug}).lean();
    let school_products = await model.find({school: product.school}).lean();

    let getSiblings = function(product, allProducts) {

        let indexing = allProducts.map( (val, index) => {
            return {
                product: val,
                match: val.ser == product.ser,
                index: index
            }
        } );

        let this_product = indexing.find( val => val.match == true );

        indexing.forEach( ( val , key )=> {
            Object.assign( val, {
                distance: val.index - this_product.index,
                last: indexing[key + 1] == undefined ? true : false,
                first: indexing[key - 1] == undefined ? true : false
            });
        });

        let siblings = [];

        console.log( allProducts.length )
        if (allProducts.length > 2 ) {
            if (this_product.first) {
                siblings = [
                    indexing[ indexing.length - 1 ],
                    this_product,
                    indexing[ this_product.index + 1 ]
                ]
            } else if (this_product.last) {
                siblings = [
                    indexing[ this_product.index - 1 ],
                    this_product,
                    indexing[0]
                ]
            } else {
                siblings = [
                    indexing[ this_product.index - 1 ],
                    this_product,
                    indexing[ this_product.index + 1 ],
                ]
            }
        } else if ( allProducts.length == 2 ) {

                    
            if (this_product.first) {
                siblings = [
                    indexing[ this_product.index + 1 ],
                    this_product,
                    indexing[ this_product.index + 1 ]
                ]
            } else if (this_product.last) {
                siblings = [
                    indexing[ this_product.index - 1 ],
                    this_product,
                    indexing[ this_product.index - 1 ]
                ]
            }

        } else {
            siblings = false
        }
        
        return siblings;

    };

    let product_details = await quickView(req,res);
    let first_aval_size = product_details.sizes.find( val => val.stock > 0 );

    console.log(product_details);

    return {
        owner: await all.getOwnerContactDetails(req,res),
        siblings: getSiblings(product, school_products),
        product: product_details.product,
        sizes: product_details.sizes,
        avalSize: first_aval_size,
        cart: req.session.cart != undefined ? req.session.cart : []
    }

};

export default getProduct;