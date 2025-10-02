import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectToDB } from './config.js';
import skillRoute from './routes/skill.route.js'
import userRoute from './routes/user.route.js'
import experienceRoute from './routes/experience.route.js'
import projectRoute from './routes/project.route.js'


dotenv.config()


const app = express();

// middleware
app.use(cors())
app.use(express.json())


// routes
app.use("/api/v1/user", userRoute)
app.use('/api/v1/skill', skillRoute)
app.use('/api/v1/experience', experienceRoute)
app.use('/api/v1/project', projectRoute)

const port = process.env.PORT || 8000

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`)
    connectToDB()
})
