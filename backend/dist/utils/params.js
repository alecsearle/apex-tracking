"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.param = param;
/**
 * Extract a route parameter as a string.
 * Express v5 types params as string | string[] — this safely handles both.
 */
function param(value) {
    if (Array.isArray(value))
        return value[0];
    return value || "";
}
