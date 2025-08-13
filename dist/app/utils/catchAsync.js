"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = void 0;
const catchAsync = (fn) => (_req, _res, next) => {
    Promise.resolve(fn(_req, _res, next)).catch((error) => {
        next(error);
    });
};
exports.catchAsync = catchAsync;
