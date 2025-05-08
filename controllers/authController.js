const adminModel = require('../models/adminModel');
const { responseReturn } = require('../utiles/response');

const bcrypt = require('bcrypt');
const { createToken } = require('../utiles/tokenCreate');
const sellerModel = require('../models/sellerModel');
const sellerCustomerModel = require('../models/chat/sellerCustomerModel');

class authController {
    admin_login = async (req, res) => {

        const { email, password } = req.body

        try {
            const admin = await adminModel.findOne({ email }).select('+password')
            if (admin) {
                const match = await bcrypt.compare(password, admin.password)
                // console.log(match)
                if (match) {
                    const token = await createToken({
                        id: admin._id,
                        role: admin.role
                    })

                    res.cookie('acessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    })
                    responseReturn(res, 200, { token, message: 'Login Success' })
                } else {
                    responseReturn(res, 404, { error: 'Wrong Password' })
                }

            } else {
                responseReturn(res, 404, { error: 'Email not found' })
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // end method 

    seller_login = async (req, res) => {

        const { email, password } = req.body

        try {
            const seller = await sellerModel.findOne({ email }).select('+password')
            if (seller) {
                const match = await bcrypt.compare(password, seller.password)
                // console.log(match)
                if (match) {
                    const token = await createToken({
                        id: seller._id,
                        role: seller.role
                    })

                    res.cookie('acessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    })
                    responseReturn(res, 200, { token, message: 'Login Success' })
                } else {
                    responseReturn(res, 404, { error: 'Wrong Password' })
                }

            } else {
                responseReturn(res, 404, { error: 'Email not found' })
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // end method 

    seller_register = async (req, res) => {

        const { email, name, password } = req.body

        try {
              
           const getUser = await sellerModel.findOne({email});

           if(getUser){
              responseReturn(res, 404, {error : "Email Already Register"});
           }else{
            
               const seller = await sellerModel.create({
                   name,
                   email,
                   password : await bcrypt.hash(password, 10),
                   method : 'menualy',
                   shopInfo : {},
               });

               await sellerCustomerModel.create({
                 myId : seller.id,
               })

               const token = await createToken({
                    id : seller.id,
                    role : seller.role,
               });

               res.cookie('acessToken', token, {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
               })

               responseReturn(res, 201, {token, message : "Register Success"});
           }

        } catch (error) {
            responseReturn(res, 500, { error: 'Internal Server Error' })           
        }
    }

    // end method 

    getUser = async(req, res) => {
            
        const {id, role} = req;

        try {
             
            if(role === 'admin'){
                const user = await adminModel.findById(id);
                responseReturn(res, 200, {userinfo : user})
            }else{
                console.log('Sellar Info')
            }
        } catch (error) {
            
             console.log(error.message)

        }


    }


}

module.exports = new authController();
