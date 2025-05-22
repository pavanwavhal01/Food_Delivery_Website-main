import express from "express"
import cors from "cors"
import { connectionDB } from "./config/db.js"
import foodRouter from "./routes/FoodRoute.js"
import userRouter from "./routes/UserRoutes.js"
import 'dotenv/config'
import cartRouter from "./routes/CartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import promoRoutes from './routes/promoRoutes.js';



//app config
const app =express()
const port= 4000

//middleware
app.use(express.json())
app.use(cors())



//db connection 
connectionDB();

//Api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use('/api/promo', promoRoutes)



app.get("/",(req,res)=>{
    res.send("API Working")

})
app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})
