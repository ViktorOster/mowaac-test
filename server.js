const express = require('express');
const formidable = require('formidable');
var fs = require("fs");
var JSZip = require("JSZip")
const path = "./tests/"
const { exec } = require('child_process'); //for running shell/bash commands

const app = express();

//start app 
const port = process.env.PORT || 3001;

function runTests() {
    exec('npm test', (err, stdout, stderr) => {
        let testResults;
        if (err) {
            //some err occurred
            console.error(err)
        } else {
            // the *entire* stdout and stderr (buffered)
            testResults = stdout;
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            //return testResults;
            console.log("test results", testResults);
        }
    });
}

// source https://medium.com/stackfame/how-to-run-shell-script-file-or-command-using-nodejs-b9f2455cb6b7
function runTests2() {
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    async function lsWithGrep() {
        try {
            //store jest test results as JSON
            const { stdout, stderr } = await exec('npm test -- --json --outputFile=output.json');
            //console.log('stdout:', stdout);
            //console.log('stderr:', stderr);
            console.log("WE ARE DONE")
        } catch (err) {
            console.error(err);
        };
    };
    lsWithGrep();
}
//runTests2();

app.post('/tests', (req, res, next) => {
    const form = formidable();

    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        //needs to match name of key for object in locallib.php
        //console.log(files.key)

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
        //res.json({ fields, files });
        res.send(runTests());
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