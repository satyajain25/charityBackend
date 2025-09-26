import express from "express";
import dotenv from "dotenv";
import dbConnection from "./app/config/dbConfig.js";
import setupRoutes from './app/Route/index.js';
import cors from "cors"; 
import mediaRoutes from "./app/Route/media.js"
const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || localhost


app.use(cors({
    origin: ["http://localhost:3000","http://192.168.0.139:3000 "],
    credentials: true 
  }));

dbConnection()
app.use(express.json());


// app.use('/api', authRoutes); 
setupRoutes(app);
mediaRoutes(app); 

app.get('/', (req, res) => {
    res.send("Connect to server")
})

app.listen(PORT, HOST, () => {
    console.log(`Server running on port http://${HOST}:${PORT}`);
});



