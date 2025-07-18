const { responseReturn } = require("../../utiles/response");
const cloudinary = require('cloudinary').v2
const formidabel = require('formidable');
const productModel = require('../../models/productModel')

class productController {

  add_product = async (req, res) => {

    const { id } = req;

    const form = formidabel({ multiples: true });

    form.parse(req, async (err, field, files) => {

      let { name, description, discount, price, brand, stock, shopName, category } = field;
      const { images } = files;

      name = name.trim();
      const slug = name.split(' ').join('-');

      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true
      })

      try {

        let allImageUrl = [];

        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.uploader.upload(images[i].filepath, { folder: 'products' })
          allImageUrl = [...allImageUrl, result.url];
        }

        await productModel.create({

          sellerId: id,
          name,
          slug,
          shopName,
          category: category.trim(),
          description: description.trim(),
          brand: brand.trim(),
          stock: parseInt(stock),
          price: parseInt(price),
          discount: parseInt(discount),
          images: allImageUrl,
        });

        responseReturn(res, 201, { message: "Product Added Successfully" });

      } catch (error) {
        responseReturn(res, 500, { message: error.message });
      }


    })

  }

  // end function 

  products_get = async (req, res) => {

    const { page, searchValue, parPage } = req.query;
    const { id } = req;

    const skipPage = parseInt(parPage) * (parseInt(page) - 1)

    try {

      if (searchValue) {

        const products = await productModel.find({
          $text: { $search: searchValue },
          sellerId: id
        }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })

        const totalProduct = await productModel.find({
          $text: { $search: searchValue },
          sellerId: id
        }).countDocuments()
        responseReturn(res, 200, { products, totalProduct })

      } else {

        const products = await productModel.find({ sellerId: id }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
        const totalProduct = await productModel.find({ sellerId: id }).countDocuments()
        responseReturn(res, 200, { products, totalProduct })


      }

    } catch (error) {
      console.log(error.message)
    }
  }
  //end function

  product_get = async (req, res) => {

    try {

      const product = await productModel.findById(req.params.id);
      responseReturn(res, 200, { product })

    } catch (error) {
      console.log(error.message)
    }



  }

  //end function


  update_product = async (req, res) => {

    let { name, description, discount, price, brand, stock, productId } = req.body;

    name = name.trim();
    const slug = name.split(' ').join('-');

    try {

      await productModel.findByIdAndUpdate(productId, {
        name, description, stock, price, discount, brand, slug
      });

      const product = await productModel.findById(productId);

      responseReturn(res, 201, { product, message: "Product updated Successfully" });


    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }


  }

  //end function


  update_image_product = async (req, res) => {
    const form = formidabel({ multiples: true });

    form.parse(req, async (err, field, files) => {
      const { oldImage, productId } = field;
      const { newImage } = files;
      if (err) {
        responseReturn(res, 400, { error: err.message });
      } else {

        try {

          cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true
          })

          const result = await cloudinary.uploader.upload(newImage.filepath, { folder: 'products' });

          if (result) {
            let { images } = await productModel.findById(productId);

            const index = images.findIndex(img => img === oldImage)
            images[index] = result.url;
            await productModel.findByIdAndUpdate(productId, { images });

            const product = await productModel.findById(productId)

            responseReturn(res, 200, { product, message: "Product images updated Successfully" });
          }else{
            responseReturn(res, 404, { error: "Image Upload Failed" });
          }
        } catch (error) {
          responseReturn(res, 404, { error: error.message });
        }


      }

    })

  }




}

module.exports = new productController();