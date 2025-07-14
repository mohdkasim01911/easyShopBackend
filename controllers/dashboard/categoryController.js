const { responseReturn } = require("../../utiles/response");
const cloudinary = require('cloudinary').v2
const categoryModel = require('../../models/categoryModel')
const formidabel = require('formidable');

class categoryController { 
  
    add_category = async (req, res) => {
        
        const form = formidabel();

        form.parse(req, async(err, fields, files) => {

            if (err) {
                responseReturn(res, 404, {error : 'something went wrong'});
            } else {
                    
                let { name }  = fields;
                let { image } = files
                name = name.trim();
                const slug = name.split(' ').join('-');

                
                cloudinary.config({
                    cloud_name : process.env.cloud_name,
                    api_key : process.env.api_key,
                    api_secret : process.env.api_secret,
                    secure : true
                })

                try {
                    const result = await cloudinary.uploader.upload(image.filepath, {folder : 'categorys'})
                      
                    if (result) {

                        const category = await categoryModel.create({
                            name,
                            slug,
                            image : result.url
                        })

                        responseReturn(res, 201, {category, message : "Category Added Successfully"});
                        
                    } else {
                        responseReturn(res, 404, {error : "Image Uplaod Files"});
                    }

                } catch (error) {
                    responseReturn(res, 500, {error : "internal server error"})
                }


            }
        })


    }

    get_category = async (req, res) => {
         
        const {page, searchValue, parPage} = req.query;
        const skipPage = parseInt(parPage) * (parseInt(page) - 1)

        try {

            let skipPage = '';

            if(parPage && page){
                 skipPage = parseInt(parPage) * (parseInt(page) - 1)
            }
          
            if(searchValue && page && parPage){
 
              const category = await categoryModel.find({
                 $text : { $search : searchValue }
              }).skip(skipPage).limit(parPage).sort({ createdAt : -1 })

              const totalCategory = await categoryModel.find({
                 $text : { $search : searchValue }
              }).countDocuments()
              responseReturn(res, 200, {category, totalCategory})

            }else if(searchValue == '' && page && parPage){
                const category = await categoryModel.find({ }).skip(skipPage).limit(parPage).sort({ createdAt : -1 })
                const totalCategory = await categoryModel.find({}).countDocuments()
                responseReturn(res, 200, {category, totalCategory})
            }else{
                const category = await categoryModel.find({ }).sort({ createdAt : -1 })
                 const totalCategory = await categoryModel.find({ }).countDocuments()
                 responseReturn(res, 200, {category, totalCategory})
            }

            
        } catch (error) {
            console.log(error.message)
        }
        


    }


}

module.exports = new categoryController();