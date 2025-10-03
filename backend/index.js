import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectToDB } from './config.js';
import skillRoute from './routes/skill.route.js'
import userRoute from './routes/user.route.js'
import experienceRoute from './routes/experience.route.js'
import projectRoute from './routes/project.route.js'
import aboutRoute from './routes/about.route.js'
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from "cloudinary";

dotenv.config()


const app = express();

// middleware
app.use(cors())
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


//cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY, 
  });


// routes
app.use("/api/v1/user", userRoute)
app.use('/api/v1/skill', skillRoute)
app.use('/api/v1/experience', experienceRoute)
app.use('/api/v1/project', projectRoute)
app.use("/api/v1/about", aboutRoute)

const port = process.env.PORT || 8000

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`)
    connectToDB()
})
