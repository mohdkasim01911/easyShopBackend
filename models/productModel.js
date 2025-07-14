const {Schema, model} = require('mongoose')

const productSchema = new Schema({

    sellerId: {
        type : Schema.ObjectId,
        require : true
    },
    name: {
        type : String,
        require : true
    },
    slug: {
        type : String,
        require : true
    },
    category: {
        type : String,
        require : true
    },
    brand: {
        type : String,
        require : true
    },
    price: {
        type : Number,
        require : true
    },
    stock: {
        type : Number,
        require : true
    },
    discount: {
        type : Number,
        require : true
    },
    description: {
        type : String,
        require : true
    },
    shopName: {
        type : String,
        require : true
    },
    images : {
        type : Array,
        require : true
    },
    rating : {
        type : Number,
        default : 0
    },

}, {timestamps : true})


productSchema.index({
    name : "text",
    category : "text",
    brand : "text",
    description : "text",
}, {
    weights : {
        name : 5,
        category : 4,
        brand : 3,
        description : 2,

    }
})

module.exports = model('products',productSchema)