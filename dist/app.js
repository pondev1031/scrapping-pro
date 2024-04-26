"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const scrapping_1 = require("./src/scrapping");
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)({ origin: '*' }));
(0, scrapping_1.init)();
// app.listen(port, () => {
//     console.log(`[server]: Server is running at http://localhost:${port}`);
// });
// getImages();
// updateSportList();
// updateEvent();
//# sourceMappingURL=app.js.map