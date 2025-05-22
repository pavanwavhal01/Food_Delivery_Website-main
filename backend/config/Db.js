import mongoose from "mongoose";

export const connectionDB= async()=>{
    await mongoose.connect('mongodb+srv://foodDelivery:Pavan2971@cluster0.wwy1eqc.mongodb.net/food-del').then(()=>console.log("Db connected"));


}
