require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 4000
const cors = require("cors");


const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

const onlineDB = process.env.MONGO_CONNECTION;
// const localDB = "mongodb://localhost:27017/sarcasmDB"

mongoose.connect(onlineDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const sarcasmSchema = new mongoose.Schema({
    sno: Number,
    sarcasm: String
});

const Sarcasm = mongoose.model("Sarcasm", sarcasmSchema);

// Finding the total number of data entries.
let total = 1;
Sarcasm.countDocuments((err, count) => {
    if (err) {
        console.log(err);
    } else {
        console.log(count)
        total = count;
    }
})

// home route
app.route("/")
    .get((req, res) => {
        let randomComment = Math.floor(Math.random() * total) + 1;

        Sarcasm.findOne({
            sno: randomComment
        }, (err, foundComment) => {
            if (!err) {
                if (foundComment) {
                    // getting the comment
                    comment = foundComment.sarcasm;

                    // converting it to JSON string object
                    json_return_string = `{"sarcasm":"${comment}"}`;

                    // converting it to string
                    return_string = json_return_string.toString();
                    
                    res.send(JSON.parse(return_string))
                } else {
                    res.send(JSON.parse('{"error":"no comments found"}'));
                }
            } else {
                res.send(err);
            }
        })
    })

app.route("/sarcasm")
    .get((req, res) => {
        Sarcasm.find({}, (err, foundComments) => {
            if (!err) {
                if (foundComments) {
                    res.send(foundComments);
                } else {
                    res.send('{"error":"empty API"}');
                }
            } else {
                res.send(err);
            }
        });
    })
    // .post((req, res) => {
    //     const sarcasticComment = new Sarcasm({
    //         sno: req.body.sno,
    //         sarcasm: req.body.sarcasm
    //     });
    //     sarcasticComment.save((err) => {
    //         if (!err) {
    //             res.send('{"success":"successfully added the new sarcastic comment"}');
    //         } else {
    //             res.send(err);
    //         }
    //     });
    // })
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
    .get((req, res) => {
        Sarcasm.findOne({
            sno: Number(req.params.sno)
        }, (err, foundComment) => {
            if (!err) {
                if (foundComment) {
                    res.send(foundComment);
                } else {
                    res.send(JSON.parse('{"error":"Not found"}'));
                }
            } else {
                res.send(err);
            }
        })
    })
    // .put((req,res)=>{
    //     Sarcasm.findOneAndUpdate(
    //         {
    //             sno: Number(req.params.sno)
    //         },
    //         {
    //             sno: req.body.sno,
    //             sarcasm: req.body.sarcasm
    //         },
    //         {
    //             overwrite: true
    //         },
    //         (err)=>{
    //             if(!err){
    //                 res.send("Successfully Updated");
    //             }else{
    //                 res.send(err);
    //             }
    //         }
    //     );
    // })
    // .patch((req, res) => {
    //     Sarcasm.findOneAndUpdate({
    //             sno: Number(req.params.sno)
    //         }, {
    //             $set: req.body
    //         },
    //         (err, foundComment) => {
    //             if (!err) {
    //                 if (foundComment) {
    //                     res.send(`Patched ${req.params.sno}`);
    //                 } else {
    //                     res.send("No such item found to be patched");
    //                 }
    //             } else {
    //                 res.send(err);
    //             }
    //         }
    //     )
    // })
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

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
});