const express=require("express");
const multer=require("multer");
const mongoose=require("mongoose")
const dotenv=require('dotenv');
const bcrypt=require('bcrypt');
const File=require("./models/file");
dotenv.config(); 
const app=express();
app.use(express.urlencoded({extended:true}));
const upload=multer({dest:"uploads"})
mongoose.connect(process.env.DB);


app.set("view engine","ejs")
app.get("/",(req,res)=>{
    res.render("index")
})
//for download file
app.get("/file/:id",handleDownload);
app.post("/file/:id",handleDownload);

app.post("/upload",upload.single("file"),async (req,res)=>{
    const filedata={
        path:req.file.path,
        originalname:req.file.originalname,
        
    }
    if(req.body.password!=null && req.body.password!=''){
        filedata.password=await bcrypt.hash(req.body.password,10)
    }
    const file=await File.create(filedata);
    res.render('index',{fileLink:`${req.headers.origin}/file/${file.id}`})
})
async function handleDownload(req,res) {
    const file=await File.findById(req.params.id);
    if(file.password!=null){
        if(req.body.password==null){
            res.render("password")
            return;
        }
        if(!(await bcrypt.compare(req.body.password,file.password))){
            res.render("password",{error:true})
            return;
        }
    }
    file.downloadcount++;
    await file.save();
    res.download(file.path,file.originalname);
}
app.listen(process.env.PORT||3000);