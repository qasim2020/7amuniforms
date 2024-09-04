import createModel from './createModel.js';

const loadMore = async function(req,res) {

    let model = await createModel(`${req.params.brand}-products`);

    let trending = await model.aggregate([
        {
            $match: {
                trending: "true"
            },
        },{
            $skip: Number(req.body.skip)
        },{
            $limit: 8
        }]);

    let count = await model.find({trending: "true"}).countDocuments();

    return {
        products: trending,
        count
    };

};

export default loadMore;