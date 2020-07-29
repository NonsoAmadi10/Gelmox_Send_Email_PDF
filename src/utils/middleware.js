import Validator from './valiate';


const sanitizeRequest = (req, res, next) => {
    const { customer_name, billing_address, products, customer_email, phone_number } = req.body;

    const missingFields = [customer_name, customer_email, products, billing_address, phone_number].map((field, index) => {
        const keys = {
            0: 'customer_name',
            1: 'customer_email',
            2: 'products',
            3: 'billing_address',
            4: 'phone_number'
        };
        return field === undefined ? keys[index] : null;
    }).filter(field => field !== null).join(', ');

    if (!customer_name || !customer_email || !products || !billing_address || !phone_number) {
        return res.status(400).json({
            status: 'error',
            message: `you're missing these fields: ${missingFields}`,
        });
    }
    const response = (error) => res.status(400).send({ success: false, error });
    if (!Validator.itsString(customer_name)) return response('customer name is supposed to be a string');
    if (!Validator.itsString(billing_address)) return response('Billing address is expected to be a string')
    if (!Validator.itsArray(products)) return response('Products should be in an array format');
    if (!Validator.itsaNumber(phone_number)) return response('phone number is expected to be a Number');
    if (!Validator.isEmail(customer_email)) return response('Customer email is invalid');

    return next();
}

export default sanitizeRequest;