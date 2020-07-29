class Validate {

    static itsaNumber(item) {
        const re = /^[-+]?\d*$/;
        return re.test(item);
    }

    static itsString(item) {
        return typeof item === 'string';
    }

    static itsArray(data) {
        return Array.isArray(data);
    }

    static isEmail(email) {
        const re = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/ig;
        return re.test(email);
    }


    static checkEmpty(input) {
        const re = /^$/;
        const testBody = re.test(input);
        return testBody;
    }
}

export default Validate;