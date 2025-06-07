import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskroutes from "./routes/taskroutes.js";
import db from "./db/db.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tasks", taskroutes);

// test route 
app.get("/PING", (req, res) => {
    res.send("PONG")
});

// app.listen(PORT, () => {
//     console.log(`Server is running on the port ${PORT}`)
// });

const startServer = async () => {
    try {
        await db.query("SELECT 1"); // Simple test query
        console.log("MySQL database connected!");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MySQL database:", error.message);
        process.exit(1); // Exit if DB fails
    }
};

startServer();