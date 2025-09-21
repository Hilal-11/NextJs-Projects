import { validationResult } from "express-validator";

const validator = (req , res , next) => {
    const errors = validationResult(req);
    if(errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];

    errors.array().map((err) => {
        extractedErrors.push({
            [err.path]: err.msg
        })
    })

    res.status(422).json({
        success: false,
        mesage: "Recived data is invalid",
        errors: extractedErrors
    })
}

export default validator