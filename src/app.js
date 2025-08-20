import express from 'express';
import cors from 'cors';
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";


const app = express();
app.use(cors());
app.use(express.json());

// saúde da API
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// prefixo principal
app.use("/api", routes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// rota para servir imagens
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

export default app;
