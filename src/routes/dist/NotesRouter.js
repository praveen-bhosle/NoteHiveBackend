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
exports.NotesRouter = void 0;
var express_1 = require("express");
var RoleMiddleware_1 = require("../middlewares/RoleMiddleware");
var prisma_1 = require("../prisma");
var NotesService_1 = require("../services/NotesService");
var WorkspaceService_1 = require("../services/WorkspaceService");
var NotesRouter = express_1.Router();
exports.NotesRouter = NotesRouter;
NotesRouter.use(RoleMiddleware_1.RoleMiddleware);
NotesRouter.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var notes, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, NotesService_1.getNotes({ prisma: prisma_1.prisma, workspaceId: req.context.workspaceId })];
            case 1:
                notes = _a.sent();
                res.status(200).json({ msg: "Notes accessed.", data: notes });
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                console.log(JSON.stringify(e_1));
                res.status(500).json({ msg: "internal server error" });
                return [2 /*return*/];
            case 3: return [2 /*return*/];
        }
    });
}); });
NotesRouter.get("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, note, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = parseInt(req.params.id);
                if (isNaN(id)) {
                    res.status(404).json({ msg: "Note not found." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, NotesService_1.getNote({ prisma: prisma_1.prisma, id: id })];
            case 1:
                note = _a.sent();
                if (!note) {
                    res.status(404).json({ msg: "Note not found." });
                    return [2 /*return*/];
                }
                res.status(200).json({ msg: "Note accessed.", data: note });
                return [3 /*break*/, 3];
            case 2:
                e_2 = _a.sent();
                console.log(JSON.stringify(e_2));
                res.status(500).json({ msg: "internal server error" });
                return [2 /*return*/];
            case 3: return [2 /*return*/];
        }
    });
}); });
NotesRouter.post("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, content, subscribed, count_of_notes, note, e_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, title = _a.title, content = _a.content;
                if (!title || typeof title !== "string" || typeof content !== "string") {
                    res.status(400).json({ msg: "Invalid or missing fields in body." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, WorkspaceService_1.checkIfSubscribed({ prisma: prisma_1.prisma, id: req.context.workspaceId })];
            case 1:
                subscribed = _b.sent();
                return [4 /*yield*/, NotesService_1.getNumberOfNotes({ prisma: prisma_1.prisma, workspaceId: req.context.workspaceId })];
            case 2:
                count_of_notes = _b.sent();
                if (!subscribed && count_of_notes > 3) {
                    res.status(200).json({ msg: "You have exceeded the limit to create notes. Switch to premium." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, NotesService_1.createNote({ prisma: prisma_1.prisma, data: { title: title, content: content, workspaceId: req.context.workspaceId } })];
            case 3:
                note = _b.sent();
                res.status(200).json({ msg: "Note created successfully.", data: note });
                return [3 /*break*/, 5];
            case 4:
                e_3 = _b.sent();
                console.log(JSON.stringify(e_3));
                res.status(500).json({ msg: "internal server error" });
                return [2 /*return*/];
            case 5: return [2 /*return*/];
        }
    });
}); });
NotesRouter.put("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, content, id, note, e_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, title = _a.title, content = _a.content;
                id = parseInt(req.params.id);
                if (isNaN(id) || typeof title !== "string" || typeof content !== "string") {
                    res.status(400).json({ msg: "Invalid or missing fields in body or params." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, NotesService_1.updateNote({ prisma: prisma_1.prisma, data: { title: title, content: content }, id: id })];
            case 1:
                note = _b.sent();
                res.status(201).json({ msg: "Note updated.", data: note });
                return [3 /*break*/, 3];
            case 2:
                e_4 = _b.sent();
                console.log(JSON.stringify(e_4));
                res.status(500).json({ msg: "internal server error" });
                return [2 /*return*/];
            case 3: return [2 /*return*/];
        }
    });
}); });
NotesRouter["delete"]("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = parseInt(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json("incompatible path param passed");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, NotesService_1.deleteNote({ prisma: prisma_1.prisma, id: id })];
            case 1:
                _a.sent();
                res.status(200).json({ msg: "Note deleted." });
                return [3 /*break*/, 3];
            case 2:
                e_5 = _a.sent();
                console.log(JSON.stringify(e_5));
                res.status(500).json({ msg: "internal server error" });
                return [2 /*return*/];
            case 3: return [2 /*return*/];
        }
    });
}); });
