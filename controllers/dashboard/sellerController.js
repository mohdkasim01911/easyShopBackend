const { responseReturn } = require("../../utiles/response");
const cloudinary = require('cloudinary').v2
const sellerModel = require('../../models/sellerModel')
const formidabel = require('formidable');

class selleryController { 
  
    request_seller_get = async (req, res) => {

        const {page, searchValue, parPage} = req.query;
        const skipPage = parseInt(parPage) * (parseInt(page) - 1)

         try {

            if(searchValue){

            }else{
               const sellers = await sellerModel.find({status: 'pending'}).skip(skipPage).limit(parPage).sort({ createdAt : -1 })
               const totalSeller = await sellerModel.find({ status: 'pending'}).countDocuments()
                responseReturn(res, 200, {sellers, totalSeller})
           
            }
            
         } catch (error) {
            responseReturn(res, 500, {error:error.message})
         }
         
       


    }


}

module.exports = new selleryController();