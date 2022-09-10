const output = document.getElementById("output");
output.offscreen = document.createElement("canvas");
const w = 1920;
const h = 1080;

output.setAttribute("width", w);
output.setAttribute("height", h);
output.offscreen.width = output.width;
output.offscreen.height = output.height;

const ctx = output.offscreen.getContext("2d");

const textSize = document.getElementById("text-size");

const backgroundImage = new Image();
backgroundImage.src = "assets/background.png";

const fontFaces = [
    new FontFace("Title", "url(assets/LinLibertine_aBS.ttf)").load(),
    new FontFace("Subtitle", "url(assets/Montserrat-SemiBold.ttf)").load()
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
    floating3DText("Upcoming Events", w * 0.5, h * 0.1, h / 70);

    drawPanel(30, 200, 15);

    // Draw offscreen canvas to onscreen canvas
    output.getContext("2d").drawImage(output.offscreen, 0, 0);
}

function floating3DText(string, x, y, depth) {
    let startX = x + depth;
    let startY = y + depth;
    for (let i = 1; i < depth; i++) {
        if (i == 1) {
            ctx.shadowColor = "rgba(0, 0, 10, 1)";
            ctx.shadowBlur = 30;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
        }
        ctx.fillStyle = "rgb(30, 30, 30)";
        ctx.fillText(string, startX - i, startY - i);
        ctx.shadowColor = "transparent";
    }
    ctx.fillStyle = "white";
    ctx.fillText(string, x, y);
}

function drawPanel(x, y, depth) {
    let startX = x + depth;
    let startY = y + depth;
    for (let i = 1; i < depth; i++) {
        ctx.fillStyle = "rgba(99, 18, 19, 0.5)";
        ctx.roundRect(startX - i, startY - i, 1870, 200, 30).fill();
    }
    ctx.fillStyle = "rgba(116, 22, 22, 0.5)";
    ctx.roundRect(x, y, 1870, 200, 30).fill();
}

function dateToString(date) {
    return new Date(date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function dateToISO(date) {
    let year = date.getFullYear()
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function downloadImage() {
    let link = document.createElement("a");
    link.download = `fr-events.png`;
    link.href = output.toDataURL();
    link.click();
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