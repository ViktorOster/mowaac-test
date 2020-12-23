const http = require("http")
const port = 3001

const app = http.createServer(function (req, res) {
    res.write("Hello Node")
    res.end()
})
// POST method route
app.post('/test', function (req, res) {
    res.send('test has been stored')
})

app.listen(port, function (error) {
    if (error) {
        console.log("Something went wrong", error)
    } else {
        console.log("Server is listening on port " + port)
    }
})