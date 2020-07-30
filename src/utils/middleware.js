import Validator from './valiate';


const sanitizeRequest = (req, res, next) => {
    const { customer_name, billing_address, products, customer_email, phone_number } = req.body;


    const response = (error) => res.status(400).send({ success: false, error });
    if (Validator.checkEmpty(customer_name)) return response('customer_name fields cannot be empty');
    if (Validator.checkEmpty(billing_address)) return response('billing_address cannot be empty');
    if (products === null || products === undefined) return response('products are not defined');
    if (Validator.checkEmpty(customer_email)) return response('customer email cannot be empty');
    if (Validator.checkEmpty(phone_number)) return response('phone number field cannot be empty');

    if (!Validator.itsString(customer_name)) return response('customer name is supposed to be a string');
    if (!Validator.itsString(billing_address)) return response('Billing address is expected to be a string')
    if (!Validator.itsArray(JSON.parse(products))) return response('Products should be in an array format');
    if (!Validator.itsaNumber(phone_number)) return response('phone number is expected to be a Number');
    if (!Validator.isEmail(customer_email)) return response('Customer email is invalid');

    req.body.products = JSON.parse(products);
    return next();
}

export default sanitizeRequest;