"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
const errors_1 = require("../utils/errors");
/**
 * Request validation middleware factory.
 * Parses and replaces req[source] with Zod-validated data.
 */
function validateRequest(schema, source = "body") {
    return (req, _res, next) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            const details = result.error.issues.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
            }));
            throw new errors_1.ValidationError(`Validation failed: ${details.map((d) => d.message).join(", ")}`);
        }
        // Replace with parsed/stripped data
        req[source] = result.data;
        next();
    };
}
