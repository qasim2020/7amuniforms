import all from "./all.js";

const quickView = async function(req, res) {
    return {
        product: await all.getProduct(req,res),
        sizes: await all.getSizes(req,res)
    };
};

export default quickView;
