const express = require('express');
const formidable = require('formidable');
var fs = require("fs");
var JSZip = require("JSZip")
const path = "./tests/"

const app = express();

//start app 
const port = process.env.PORT || 3001;

app.post('/tests', (req, res, next) => {
    const form = formidable();

    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        console.log(files.key);
        //var zip = new AdmZip(files.key);
        // extracts the specified file to the specified location
        fs.readFile(files.key.path, function (err, data) {
            if (!err) {
                var zip = new JSZip();
                zip.loadAsync(data).then(function (contents) {
                    Object.keys(contents.files).forEach(function (filename) {
                        zip.file(filename).async('nodebuffer').then(function (content) {
                            var dest = path + filename;
                            fs.writeFileSync(dest, content);
                        });
                    });
                });
            }
        });
        //zip.extractAllTo("/tests/", true);
        res.json({ fields, files });
    });
});

//create tests directory if it doesnt exist
const dir = "tests";
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

app.get("/", (req, res) => {
    res.send("Hello node")
})

app.listen(port, function (error) {
    if (error) {
        console.log("Something went wrong", error)
    } else {
        console.log("Server is listening on port " + port)
    }
})