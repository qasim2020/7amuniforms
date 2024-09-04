import mongoose from 'mongoose';
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
    },

    getProduct: async function(req,res) {
        let model = await createModel("7am-products");
        return await model.findOne({_id: req.params.id}).lean();
    },

    getSizes: async function(req,res) {
        let model = await createModel("7am-products");
        return await model.aggregate([
            {
                $match: {
                  _id: new mongoose.Types.ObjectId(req.params.id)
                }
              },
            {
                $project: {
                  category: {
                    $toLower: "$category"
                  },
                  items: 1
                }
            },
            {
                $lookup: {
                  from: "7am-sizes",
                  localField: "category",
                  foreignField: "category",
                  as: "sizes"
                }
            },
            {
                $unwind: {
                  path: "$sizes",
                  preserveNullAndEmptyArrays: true 
                }
            },
            {
                $unwind: "$items" 
            },
            {
                $lookup: {
                  from: "7am-items",
                  let: {
                    mySlug: "$items.slug",
                    mySize: "$sizes.slug"
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            {
                              $eq: ["$slug", "$$mySlug"]
                            },
                            {
                              $eq: ["$size", "$$mySize"]
                            }
                          ]
                        }
                      }
                    }
                  ],
                  as: "stock"
                }
            },
            {
                $unwind: {
                  path: "$stock",
                  preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                  _id: {
                    stock: "$sizes.slug",
                    label: "$sizes.label",
                    ser: "$sizes.ser"
                  },
                  items: {
                    $addToSet: "$stock"
                  }
                }
            },
            {
                $project: {
                  size: "$_id.stock",
                  label: "$_id.label",
                  ser: {
                    $toInt: "$_id.ser"
                  },
                  stock: {
                    $toInt: {
                        $arrayElemAt: ["$items.qty", 0]
                    }
                  },
                  items: "$items",
                  _id: 0
                }
            },
            {
                $sort: {
                  ser: 1
                }
            }
        ])
    }
};

export default all;