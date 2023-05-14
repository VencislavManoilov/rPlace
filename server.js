let canvas = [], mapSize = 50;

function makeCanvas(size) {
    for(let x = 0; x < size; x++) {
        canvas[x] = [];
        for(let y = 0; y < size; y++) {
            canvas[x][y] = {r: 255, g: 255, b: 255};
        }
    }
}

makeCanvas(mapSize);

const express = require("express");
const path = require("path");
const app = express();
console.log(process.env.PORT)
const port = process.env.PORT || 80;

app.use(express.static('public'));

app.get("/", function (req, res) {
    res.status(200);
    res.sendFile(path.join(__dirname, "/public", "index.html"));
})

app.listen(port, function () {
    console.log("listening: " + port);
})

app.get("/test", function (req, res) {
    res.status(200);
    res.send("it works");
})

app.get("/getData", function (req, res) {
    res.status(200);
    res.send(canvas);
})

app.put('/draw', function (req, res) {
    let new_x = parseInt(req.query.x);
    let new_y = parseInt(req.query.y);
    let new_r = parseInt(req.query.r);
    let new_g = parseInt(req.query.g);
    let new_b = parseInt(req.query.b);

    if(isNaN(new_x) || isNaN(new_y) || isNaN(new_r) || isNaN(new_g) || isNaN(new_b) ||new_x < 0 || new_x >= mapSize || new_y < 0 || new_y >= mapSize || new_r < 0 || new_r > 255 || new_g < 0 || new_g > 255 || new_b < 0 || new_b > 255) {
        res.status(400);
    } else {
        res.status(200);
        canvas[new_x][new_y] = {r: new_r, g: new_g, b: new_b};
    }

})

app.delete("/reset", function (req, res) {
    if(req.query.password == "Damn") {
        res.status(200);
        makeCanvas(mapSize);
    } else {
        res.status(400);
        res.send("Wrong Password");
    }
})