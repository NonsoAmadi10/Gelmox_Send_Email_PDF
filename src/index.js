import express from "express";
import fs from "fs";
import path from "path";

import * as pdfConverter from "html-pdf-node";

import * as dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const pathToHtml = path.resolve(path.join(__dirname, "test.html"));
const myHtml = fs.readFileSync(pathToHtml, "utf8");

const app = express();
app.use(express.json());
app.use(cors());

app.listen(
  process.env.PORT,
  () => console.log(`Server is Running on ${process.env.PORT}`),
);
