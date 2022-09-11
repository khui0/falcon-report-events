const output = document.getElementById("output");
const w = 1920;
const h = 1080;

output.setAttribute("width", w);
output.setAttribute("height", h);

output.offscreen = document.createElement("canvas");
output.offscreen.width = output.width;
output.offscreen.height = output.height;

output.temp = document.createElement("canvas");
output.temp.width = output.width;
output.temp.height = output.height;

const ctx = output.offscreen.getContext("2d");
const temp = output.temp.getContext("2d");

const panelCount = document.getElementById("count");

const backgroundImage = new Image();
backgroundImage.src = "assets/background.png";

const fontFaces = [
    new FontFace("Title", "url(assets/LinLibertineCapitalsB.woff2)").load(),
    new FontFace("Subtitle", "url(assets/Montserrat-SemiBold.woff2)").load()
]

// Load fonts
Promise.all(fontFaces).then(values => {
    for (let i = 0; i < values.length; i++) {
        document.fonts.add(values[i]);
    }
    update();
});

document.querySelectorAll("input, select").forEach(item => {
    item.addEventListener("input", update);
});

document.getElementById("download").addEventListener("click", downloadImage);

function update() {
    // Draw background
    ctx.drawImage(backgroundImage, 0, 0, w, h);

    // Set text formatting
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";

    // Draw title
    ctx.font = `${(h / 7.5)}px Title`;
    ctx.extrudedText("Upcoming Events", w * 0.5, h * 0.1, h / 70);

    // Draw panels to a temporary canvas
    drawPanels(30, h * 0.2, 185, 4);

    // Set opacity and draw to main canvas
    ctx.globalAlpha = 0.5;
    ctx.drawImage(output.temp, 0, 0);
    ctx.globalAlpha = 1;

    // Draw offscreen canvas to onscreen canvas
    output.getContext("2d").drawImage(output.offscreen, 0, 0);
}

function drawPanels(margin, top, height, count) {
    for (let i = 0; i < count; i++) {
        temp.drawPanel(margin, top + i * (height + margin), w - 2 * margin, height, 10);
    }
}

function downloadImage() {
    let link = document.createElement("a");
    link.download = `fr-events.png`;
    link.href = output.toDataURL();
    link.click();
}

CanvasRenderingContext2D.prototype.extrudedText = function (string, x, y, depth) {
    let startX = x + depth;
    let startY = y + depth;
    for (let i = 1; i < depth; i++) {
        if (i == 1) {
            this.shadowColor = "rgba(0, 0, 10, 1)";
            this.shadowBlur = 30;
            this.shadowOffsetX = 5;
            this.shadowOffsetY = 5;
        }
        this.fillStyle = "rgb(30, 30, 30)";
        this.fillText(string, startX - i, startY - i);
        this.shadowColor = "transparent";
    }
    this.fillStyle = "white";
    this.fillText(string, x, y);
}

CanvasRenderingContext2D.prototype.drawPanel = function (x, y, w, h, depth) {
    let startX = x + depth;
    let startY = y + depth;
    for (let i = 1; i < depth; i++) {
        this.fillStyle = "rgba(99, 18, 19)";
        this.roundRect(startX - i, startY - i, w, h, 30).fill();
    }
    this.fillStyle = "rgba(116, 22, 22)";
    this.roundRect(x, y, w, h, 30).fill();
    return this;
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
}