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
    extrudedText(ctx, "Upcoming Events", w * 0.5, h * 0.1, h / 70);

    // Draw panels to a temporary canvas
    let height = (h - (h * 0.2) - (30 * 4)) / 4;
    drawPanels(30, h * 0.2, height, 4);

    // Set opacity and draw to main canvas
    ctx.globalAlpha = 0.5;
    ctx.drawImage(output.temp, 0, 0);
    ctx.globalAlpha = 1;

    // Draw offscreen canvas to onscreen canvas
    output.getContext("2d").drawImage(output.offscreen, 0, 0);
}

function extrudedText(ctx, string, x, y, depth) {
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

function drawPanel(ctx, x, y, w, h, depth) {
    let startX = x + depth;
    let startY = y + depth;
    for (let i = 1; i < depth; i++) {
        ctx.fillStyle = "rgba(99, 18, 19)";
        roundRect(ctx, startX - i, startY - i, w, h, 30).fill();
    }
    ctx.fillStyle = "rgba(116, 22, 22)";
    roundRect(ctx, x, y, w, h, 30).fill();
    return ctx;
}

function roundRect(ctx, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    return ctx;
}

function drawPanels(margin, top, height, count) {
    for (let i = 0; i < count; i++) {
        drawPanel(temp, margin, top + i * (height + margin), w - 2 * margin, height, 10);
    }
}

function downloadImage() {
    let link = document.createElement("a");
    link.download = `fr-events.png`;
    link.href = output.toDataURL();
    link.click();
}