const xhr = new XMLHttpRequest();

let grid = [], canDraw = false, sqrSize = 10, time = 0, hoveredX = -1, hoveredY = -1, clicked = false, hoveredColorX = -1, hoveredColorY = -1, selectedColorH = 0, selectedColorL = 10;

updateData();

function update() {
    time++;

    if(clicked && hoveredX != -1 && hoveredY != -1) {
        let color = hslToRgb(selectedColorH * 18, 100, selectedColorL * 5.263157894736842);
        changeSqr(hoveredX, hoveredY, color.r, color.g, color.b);
        updateData();
    }
}

function draw() {
    if(canDraw) {
        strokeRect(100, 100, grid.length * sqrSize, grid[0].length * sqrSize, 1, "black");
        strokeRect(125 + grid.length * sqrSize, 100, grid.length * sqrSize, grid[0].length * sqrSize, 1, "black");
        for(let x = 0; x < grid.length; x++) {
            for(let y = 0; y < grid[x].length; y++) {
                fillRect(100 + x * sqrSize, 100 + y * sqrSize, sqrSize, sqrSize, "rgb(" + grid[x][y].r + ", " + grid[x][y].g + ", " + grid[x][y].b + ")");
            }
        }

        if(mouseX > 100 && mouseX < 100 + grid.length * sqrSize && mouseY > 100 && mouseY < 100 + grid[0].length * sqrSize) {
            hoveredX = Math.floor((mouseX - 100)/sqrSize);
            hoveredY = Math.floor((mouseY - 100)/sqrSize);
            strokeRect(100 + hoveredX * sqrSize, 100 + hoveredY * sqrSize, sqrSize, sqrSize, 3, "hsl(" + time + ", 100%, 50%)");
        } else {
            hoveredX = -1;
            hoveredY = -1;
        }

        for(let i = 0; i < 20; i++) {
            for(let j = 0; j < 20; j++) {
                fillRect(125 + grid.length * sqrSize + i * 25, 100 + j * 25, 25, 25, "hsl(" + i * 18 + ", 100%, " + j * 5.263157894736842 + "%)");
                // strokeRect(125 + grid.length * sqrSize + i * sqrSize, 100 + j * sqrSize, sqrSize, sqrSize, 2, "black");
            }
        }

        if(mouseX > 125 + grid.length * sqrSize && mouseX < 125 + grid.length * sqrSize + 20 * 25 && mouseY > 100 && mouseY < 100 + 20 * 25) {
            hoveredColorX = Math.floor((mouseX - 100)/25) - 21;
            hoveredColorY = Math.floor((mouseY - 100)/25);
        } else {
            hoveredColorX = -1;
            hoveredColorY = -1;
        }

        strokeRect(100 + (selectedColorH + 21) * 25, 100 + selectedColorL * 25, 25, 25, 2, "hsl(" + ((selectedColorH + 20) * 18 + 180) + ", 100%, " + (100 - selectedColorL * 5.263157894736842) + "%)");
    }
}

function changeSqr(x, y, r, g, b) {
    xhr.open("put", "/draw?x="+x+"&y="+y+"&r="+r+"&g="+g+"&b="+b);
    xhr.send();
    xhr.onload = () => {
        if (xhr.readyState != 4 || xhr.status != 200) {
            console.log(`Error: ${xhr.status}`);
        }
    };

}

function updateData() {
    xhr.open("get", "/getData");
    xhr.send();
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let data = xhr.response;
            grid = [];
            grid = JSON.parse(data);
            canDraw = true;
        } else {
            console.log(`Error: ${xhr.status}`);
        }
    };
}

function mousedown() {
    clicked = true;
    if(hoveredColorX != -1 && hoveredColorY != -1) {
        selectedColorH = hoveredColorX;
        selectedColorL = hoveredColorY;
    }
}

function mouseup() {
    clicked = false;
}

function hslToRgb(h, s, l){
    if(h >= 360) {
        h = h - Math.floor(h/360) * 360;
    }

    // Must be fractions of 1
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return {r: r, g: g, b: b};
}

setInterval(updateData, 150);