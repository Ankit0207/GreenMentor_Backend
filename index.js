const express=require("express");
const cors = require("cors");
const { connection } = require("./config/db");
const { userRoute } = require("./Routes/userRoute");
const { authMiddleware } = require("./middleware/authMiddleware");
const { taskRoute } = require("./routes/taskRoute");
require("dotenv").config();

const PORT=process.env.Port;
const app=express();
app.use(express.json());
app.use(cors());


app.use("/users",userRoute);
app.use("/tasks",authMiddleware,taskRoute);


app.listen(PORT,async()=>{
try {
    await connection;
    console.log("connected to the db");
    console.log(`server running at ${PORT}`);
} catch (error) {
    console.log(error);
}
});