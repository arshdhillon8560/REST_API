const express =require("express");
const app=express();
const PORT=8000;


app.get("/",(res,req)=>{
    req.send("Hello Arsh");
})
app.listen(PORT,()=>{
    console.log("Server initiated");
})