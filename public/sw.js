importScripts("/static/perlin.js");

let mainCanvas = null;
self.addEventListener("message", async (event) => {
  if (event.data.canvas) {
    mainCanvas = event.data.canvas;
  }
  if (event.data.type === "run_canvas") {
    gridNoise(event.data.animData, mainCanvas);
  }

  if (event.data.type === "download") {
    const ctx = mainCanvas.getContext("2d");
  }
});

const hex2rgba = (hex, a = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
  return { r, g, b, a };
};

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function gridNoise(animationData, canvas) {
  let NUM_PARTICLES;
  (THICKNESS = Math.pow(300, 2)),
    (SPACING = 1),
    (MARGIN = 700),
    (DRAG = 0.9),
    (EASE = 0.25);
  let dx, dy, mx, my, d, t, f, a, b, i, n, w, h, p, s, r, c;

  let distortion = animationData.distortion;
  MARGIN = 0;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  list = [];

  let exportSize = 1;

  w = canvas.width = animationData.cWidth * exportSize;
  h = canvas.height = animationData.cHeight * exportSize;

  let columns = w / (MARGIN * 2 + SPACING);
  let rows = h / (MARGIN * 2 + SPACING);

  NUM_PARTICLES = (rows * columns) / 2;

  let particle = {
    vx: 0,
    vy: 0,
    x: 0,
    y: 0,
  };

  console.log(NUM_PARTICLES);
  for (i = 0; i < NUM_PARTICLES; i++) {
    p = Object.create(particle);
    p.x = p.ox = MARGIN + SPACING * (i % columns);
    p.y = p.oy = MARGIN + SPACING * Math.floor(i / columns);

    list[i] = p;
  }

  function renderParticles() {
    b = (a = ctx.createImageData(w, h)).data;
    console.log(b);
    const background = hex2rgba(animationData.backgroundColor);
    const fillColor = hex2rgba(animationData.color);

    for (let i = 0; i < b.length; i += 4) {
      // Modify pixel data
      // b[i + 0] = randomInteger(0, 255); // R value
      // b[i + 1] = randomInteger(0, 255); // G value
      // b[i + 2] = randomInteger(0, 255); // B value
      // b[i + 3] = 255; // A value
      if (animationData.bgEnabled) {
        b[i + 0] = background.r; // R value
        b[i + 1] = background.g; // G value
        b[i + 2] = background.b; // B value
        b[i + 3] = 255; // A value
      } else {
        b[i + 3] = 0; // A value
      }
    }

    for (i = 0; i < NUM_PARTICLES; i++) {
      p = list[i];

      b[(n = (~~p.x + ~~p.y * w) * 4)] = fillColor.r;
      b[n + 1] = fillColor.g;
      b[n + 2] = fillColor.b;
      b[n + 3] = 255;
    }

    ctx.putImageData(a, 0, 0);
  }

  t = +new Date() * 0.001;
  mx = w * 0.5 + Math.cos(t * 2.1) * Math.cos(t * 0.9) * w * 0.45;
  my = h * 0.5 + Math.sin(t * 3.2) * Math.tan(Math.sin(t * 0.8)) * h * 0.45;

  for (i = 0; i < NUM_PARTICLES; i++) {
    p = list[i];

    d = (dx = mx - p.x) * dx + (dy = my - p.y) * dy;
    f = -THICKNESS / d;

    if (d < THICKNESS) {
      t = Math.atan2(dy, dx);
      p.vx += f * Math.cos(t);
      p.vy += f * Math.sin(t);
    }

    let noisex = noise.simplex2(p.x / animationData.n1, p.y / animationData.n2);
    let noisey = noise.simplex2(p.x / animationData.n2, p.y / animationData.n1);

    p.x = p.x + distortion * noisex;
    p.y = p.y + distortion * noisey;
  }

  renderParticles();
}

// using sine will generate other
// let noisex = noise.perlin2(p.x / Math.sin(Math.random() * 100), p.y / Math.sin(Math.random() * 100));
//   let noisex = noise.perlin2(p.x/45, p.y/45);

// horizontal waves for x = noise.perlin2(p.x, p.y)
// vertical waves for y = noise.perlin2(p.y, p.x);

// predictable diagonal waves xy = noise.perlin2(p.x / animationData.n1, p.y / animationData.n2)

// let noisex = noise.perlin2(p.x / animationData.n1, p.y / animationData.n2);
// let noisey = noise.perlin2(p.y / animationData.n1, p.x / animationData.n2);

// for circle in the center
// p.x += (p.vx *= DRAG) + (p.ox - p.x) * EASE;
// p.y += (p.vy *= DRAG) + (p.oy - p.y) * EASE;

// prev
// let noisex = noise.perlin2(x / animationData.n1, y / animationData.n2);
// let noisey = noise.perlin2(x / animationData.n2, y / animationData.n1);

// big numbers big waves
// let noisex = noise.perlin2(p.x / animationData.n1, p.y / animationData.n1);
// let noisey = noise.perlin2(p.y / animationData.n2, p.x);
