const sellerCustomerModel = require("../../models/chat/sellerCustomerModel");
const customerModel = require("../../models/customerModel");
const { responseReturn } = require("../../utiles/response");
const bcrypt = require('bcrypt');
const { createToken } = require("../../utiles/tokenCreate");

class customerAuthController {

    customer_register = async (req, res) => {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return responseReturn(res, 400, { error: 'All fields are required' });
        }

        try {
            // Check if the email is already registered
            const existingCustomer = await customerModel.findOne({ email: email.trim() });

            if (existingCustomer) {
                return responseReturn(res, 409, { error: 'Email already exists' }); // Use 409 for conflict
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create the customer
            const newCustomer = await customerModel.create({
                name: name.trim(),
                email: email.trim(),
                password: hashedPassword,
                method: 'manually', // Correct spelling
            });

            // Create entry in sellerCustomerModel
            await sellerCustomerModel.create({
                myId: newCustomer._id,
            });

            // Generate auth token
            const token = await createToken({
                id: newCustomer._id,
                name: newCustomer.name,
                email: newCustomer.email,
                method: newCustomer.method,
            });

            // Set cookie
            res.cookie('customerToken', token, {
                httpOnly: true, // Recommended for security
                secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
                sameSite: 'Strict', // Prevent CSRF
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            });

            // Send response
            responseReturn(res, 201, {
                token,
                message: 'User registered successfully',
            });

        } catch (error) {
            console.error('Registration Error:', error.message);
            responseReturn(res, 500, { error: 'Internal Server Error' });
        }
    }

    customer_login = async (req, res) => {

        const { email, password } = req.body;

        try {

            const existingCustomer = await customerModel.findOne({ email }).select('+password');

            if (existingCustomer) {

                const match = await bcrypt.compare(password, existingCustomer.password)

                if (match) {

                    const token = await createToken({
                        id: existingCustomer._id,
                        name: existingCustomer.name,
                        email: existingCustomer.email,
                        method: existingCustomer.method,
                    });

                    res.cookie('customerToken', token, {
                        httpOnly: true, // Recommended for security
                        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
                        sameSite: 'Strict', // Prevent CSRF
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                    });

                    responseReturn(res, 201, {
                        token,
                        message: 'User Login successfully',
                    });

                } else {
                    responseReturn(res, 404, { error: 'Password Wrong' });
                }

            } else {
                responseReturn(res, 404, { error: 'Email Not Found' });
            }

        } catch (error) {
            console.log(error.message);
        }



    }

}

module.exports = new customerAuthController