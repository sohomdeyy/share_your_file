const express=require("express");
const app=express();
app.set("view engine","ejs")
app.get("/",(req,res)=>{
    res.render("index")
})

app.post("/upload",(req,res)=>{
    res.send("hi");
})
app.listen(3000);