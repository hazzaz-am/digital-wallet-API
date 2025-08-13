"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IApprovalStatus = exports.IsActive = exports.Role = void 0;
var Role;
(function (Role) {
    Role["USER"] = "USER";
    Role["ADMIN"] = "ADMIN";
    Role["AGENT"] = "AGENT";
})(Role || (exports.Role = Role = {}));
var IsActive;
(function (IsActive) {
    IsActive["ACTIVE"] = "ACTIVE";
    IsActive["BLOCKED"] = "BLOCKED";
})(IsActive || (exports.IsActive = IsActive = {}));
var IApprovalStatus;
(function (IApprovalStatus) {
    IApprovalStatus["PENDING"] = "PENDING";
    IApprovalStatus["APPROVED"] = "APPROVED";
    IApprovalStatus["REJECTED"] = "REJECTED";
})(IApprovalStatus || (exports.IApprovalStatus = IApprovalStatus = {}));
