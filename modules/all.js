import createModel from './createModel.js';

const all = {
    trendingProducts: async function(req, res) {
        let model = await createModel(`${req.params.brand}-products`);
        let output = await model.find({trending: "true"}).limit(8).lean();
        return output;
    },

    newProducts: async function(req, res) {
        let model = await createModel(`${req.params.brand}-products`);
        let output = await model.find({new: "true"}).limit(8).lean();
        return output;
    },

    saleProducts: async function(req, res) {
        let model = await createModel(`${req.params.brand}-products`);
        let output = await model.find({sale: { $exists: true} }).limit(8).lean();
        return output;
    },

    categories: async function(req,res) {
        let model = await createModel(`${req.params.brand}-products`);
        return await model.distinct("category").lean();
    },

    randomProducts: async function(req,res) {
        let model = await createModel(`${req.params.brand}-products`);
        return await model.aggregate([
            { $sample: { size: 5 } }
        ]);
    }
};

export default all;