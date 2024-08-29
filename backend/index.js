import dotenv from "dotenv"
import express from "express"
import UserRoutes from "./src/routes/UserRoutes.js"
import pool from "./src/db/index.js"

dotenv.config({
    path:'./.env'
})

const PORT=process.env.PORT||8800;

const app=express()


app.use(express.json())

app.use('/api/v1/auth',UserRoutes)

app.get('/',(req,res)=>{
    res.send("You are in home page")
})


app.listen(PORT,()=>{
    console.log(`App is listening in http://localhost:${PORT}`)
})