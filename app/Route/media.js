import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function mediaRoutes(app) {
  router.get("/uploads/:name", (req, res) => {
    const { name } = req.params;
    res.sendFile(path.join(__dirname, `../uploads/${name}`));
  });

  app.use("/", router);
}
