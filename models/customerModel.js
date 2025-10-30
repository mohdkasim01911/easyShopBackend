const {Schema, model} = require('mongoose')

const customerSchema = new Schema({

    name : {
        type : String,
        require : true
    },

    email : {
        type : String,
        require : true
    },
    password : {
        type : String,
        require : true,
        select : false
    },
    method : {
        type : String,
        require : true,
    },

}, {timestamps : true})

module.exports = model('customers',customerSchema)