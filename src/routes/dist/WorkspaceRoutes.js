"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.WorkspaceRouter = void 0;
var express_1 = require("express");
var prisma_1 = require("../prisma");
var WorkspaceService_1 = require("../services/WorkspaceService");
var WorkspacesOnUsersService_1 = require("../services/WorkspacesOnUsersService");
var RoleMiddleware_1 = require("../middlewares/RoleMiddleware");
var UserService_1 = require("../services/UserService");
var WorkspaceRouter = express_1.Router();
exports.WorkspaceRouter = WorkspaceRouter;
WorkspaceRouter.post("", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, workspaceName, workspaceExists, workspace, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.user.id;
                workspaceName = req.body.workspaceName;
                if (!workspaceName) {
                    res.status(400).json({ msg: "The field workspaceName is not present in the request body." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, WorkspaceService_1.checkWorkspaceExists({ prisma: prisma_1.prisma, name: workspaceName, userId: id })];
            case 1:
                workspaceExists = _a.sent();
                if (workspaceExists) {
                    res.status(409).json({ msg: "The workspace name is alredy taken" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, WorkspaceService_1.createWorkspace({ prisma: prisma_1.prisma, name: workspaceName, userId: id })];
            case 2:
                workspace = _a.sent();
                res.status(201).json({ msg: "workspace created", data: workspace });
                return [2 /*return*/];
            case 3:
                e_1 = _a.sent();
                console.log(JSON.stringify(e_1));
                res.status(500).json({ msg: "internal server error." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
WorkspaceRouter.put("/:id/upgrade", RoleMiddleware_1.RoleMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, parsedId, role, workspace, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                parsedId = parseInt(id);
                if (isNaN(parsedId)) {
                    res.status(400).json("incompatible path param passed");
                    return [2 /*return*/];
                }
                role = req.user.role;
                if (role !== "ADMIN") {
                    res.status(403).json({ msg: "You are not authorized to performing this action." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, WorkspaceService_1.updateWorkspace({ prisma: prisma_1.prisma, data: { subscribed: true }, id: parsedId })];
            case 1:
                workspace = _a.sent();
                res.status(200).json({ msg: "User removed from successfully.", data: workspace });
                return [3 /*break*/, 3];
            case 2:
                e_2 = _a.sent();
                console.log(JSON.stringify(e_2));
                res.status(500).json({ msg: "internal server error." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
WorkspaceRouter["delete"]("", RoleMiddleware_1.RoleMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var workspaceId, role, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                workspaceId = req.context.workspaceId;
                role = req.user.role;
                if (role !== "ADMIN") {
                    res.status(403).json({ msg: "You are not authorized to performing this action." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, WorkspaceService_1.deleteWorkspace({ prisma: prisma_1.prisma, id: workspaceId })];
            case 1:
                _a.sent();
                res.status(200).json({ msg: "Workspace deleted successfully." });
                return [3 /*break*/, 3];
            case 2:
                e_3 = _a.sent();
                console.log(JSON.stringify(e_3));
                res.status(500).json({ msg: "internal server error." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
WorkspaceRouter.put("/upsertUser", RoleMiddleware_1.RoleMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var role, _a, roleToBeAssigned, userEmail, user, dbResponse, e_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                role = req.user.role;
                if (role !== "ADMIN") {
                    res.status(403).json({ msg: "You are not authorized to performing this action." });
                    return [2 /*return*/];
                }
                _a = req.body, roleToBeAssigned = _a.roleToBeAssigned, userEmail = _a.userEmail;
                return [4 /*yield*/, UserService_1.getUser({ prisma: prisma_1.prisma, email: userEmail })];
            case 1:
                user = _b.sent();
                if (!user) {
                    res.status(400).json({ msg: "the user email does not exist." });
                    return [2 /*return*/];
                }
                if (!roleToBeAssigned || typeof roleToBeAssigned !== "string" || !(roleToBeAssigned === "ADMIN" || roleToBeAssigned === "MEMBER") || !userEmail || typeof userEmail !== "string") {
                    res.status(400).json({ msg: "Invalid or missing fields in request body" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, WorkspacesOnUsersService_1.upsertUser({ prisma: prisma_1.prisma, workspaceId: req.context.workspaceId, userId: user.id, role: roleToBeAssigned === "ADMIN" ? "ADMIN" : "MEMBER" })];
            case 2:
                dbResponse = _b.sent();
                console.log(dbResponse);
                res.status(201).json({ msg: "User added", data: dbResponse });
                return [2 /*return*/];
            case 3:
                e_4 = _b.sent();
                console.log(JSON.stringify(e_4));
                res.status(500).json({ msg: "internal server error." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
WorkspaceRouter["delete"]("/deleteUser", RoleMiddleware_1.RoleMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, role, parsedUserId, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.body.userId;
                role = req.user.role;
                if (role !== "ADMIN") {
                    res.status(403).json({ msg: "You are not authorized to performing this action." });
                    return [2 /*return*/];
                }
                parsedUserId = parseInt(userId);
                if (isNaN(parsedUserId)) {
                    res.status(400).json("incompatible path param passed");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, WorkspacesOnUsersService_1.removeUser({ prisma: prisma_1.prisma, workspaceId: req.context.workspaceId, userId: parsedUserId })];
            case 1:
                _a.sent();
                res.status(200).json({ msg: "User removed from successfully." });
                return [3 /*break*/, 3];
            case 2:
                e_5 = _a.sent();
                console.log(JSON.stringify(e_5));
                res.status(500).json({ msg: "internal server error." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
WorkspaceRouter.get('/all', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, workspaces, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.user.id;
                return [4 /*yield*/, WorkspacesOnUsersService_1.getUserWorkspaces({ prisma: prisma_1.prisma, userId: id })];
            case 1:
                workspaces = _a.sent();
                res.status(200).json({ msg: "Got the workspaces.", data: workspaces });
                return [3 /*break*/, 3];
            case 2:
                e_6 = _a.sent();
                console.log(JSON.stringify(e_6));
                res.status(500).json({ msg: "internal server error." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
