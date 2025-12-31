// utils/validateField.js
import { validators } from "./validators";

export const validateField = (value, rules = []) => {
    for (const rule of rules) {
        const validatorName = Object.keys(rule)[0];
        const param = rule[validatorName];

        if (typeof validators[validatorName] === "function") {
            const error = param
                ? validators[validatorName](value, param)
                : validators[validatorName](value);

            if (error) return error; // stop at first error
        }
    }
    return null;
};
