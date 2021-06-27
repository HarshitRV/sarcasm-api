require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const onlineDB = process.env.MONGO_CONNECTION;
const localDB = "mongodb://localhost:27017/sarcasmDB"

mongoose.connect(onlineDB, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});

const sarcasmSchema = new mongoose.Schema({
    sno: Number,
    sarcasm: String
});

const Sarcasm = mongoose.model("Sarcasm",sarcasmSchema);

app.route("/sarcasm")
.get((req,res)=>{
    Sarcasm.find({},(err,foundComments)=>{
        if(!err){
            if(foundComments){
                res.send(foundComments);
            }else{
                res.send("Empty API");
            }
        }else{
            res.send(err);
        }
    });
})
.post((req,res)=>{
    const sarcasticComment = new Sarcasm({
        sno: req.body.sno,
        sarcasm: req.body.sarcasm
    });
    sarcasticComment.save((err)=>{
        if(!err){
            res.send("Succesfully saved new sarcastic comment");
        }else{
            res.send(err);
        }
    });
})
// .delete((req,res)=>{
//     Sarcasm.deleteMany({}, (err)=>{
//         if(!err){
//             res.send("Successfully Deleted all sarcasms")
//         }else{
//             res.send(err);
//         }
//     });
// });

app.route("/sarcasm/:sno")
.get((req,res)=>{
    Sarcasm.findOne({sno: Number(req.params.sno)}, (err,foundComment)=>{
        if(!err){
            if(foundComment){
                res.send(foundComment);
            }else{
                res.send("No item found");
            }
        }else{
            res.send(err);
        }
    })
})
.put((req,res)=>{
    Sarcasm.findOneAndUpdate(
        {
            sno: Number(req.params.sno)
        },
        {
            sno: req.body.sno,
            sarcasm: req.body.sarcasm
        },
        {
            overwrite: true
        },
        (err)=>{
            if(!err){
                res.send("Successfully Updated");
            }else{
                res.send(err);
            }
        }
    );
})
.patch((req,res)=>{
    Sarcasm.findOneAndUpdate(
        {
            sno: Number(req.params.sno)
        },
        {
            $set: req.body
        },
        (err,foundComment)=>{
            if(!err){
                if(foundComment){
                    res.send(`Patched ${req.body.sno}`);
                }else{
                    res.send("No such item found to be patched");
                }   
            }else{
                res.send(err);
            }
        }
    )
})
// .delete((req,res)=>{
//     Sarcasm.findOneAndRemove(
//         {
//             sno: Number(req.params.sno)
//         },
//         (err,foundComment)=>{
//             if(!err){
//                 if(foundComment){
//                     res.send(`Removed ${foundComment}`);
//                 }else{
//                     res.send("No such item to remove");
//                 }
//             }else{
//                 res.send(err);
//             }
//         }
//     );
// });

app.listen(PORT,()=>{
    console.log("Listening at port 3000");
});