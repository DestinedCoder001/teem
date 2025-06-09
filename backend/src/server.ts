import express from 'express';
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.route';
import usersRoute from './routes/users.route';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cookieParser())
app.use(express.json());


// ROUTES
app.use("/api/auth", authRoute)
app.use("/api/users", usersRoute)

app.listen(3001, () => {
    console.log("Server is running on port 3000");
});