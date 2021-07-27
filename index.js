import * as StackBlur from "./node_modules/stackblur-canvas/dist/stackblur-es.min.js";

// 生成一个噪声
let simplex;
export const initNoise = () => {
  simplex = new window.SimplexNoise(Math.random);
};

// 初始化canvas
export const init = id => {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext("2d");

  window.onresize = function () {
    onResize(canvas);
  };
  onResize(canvas);
  return {
    canvas,
    ctx,
  };
};

// 页面改变时触发
let resizeTimer;
const onResize = canvas => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const style = getComputedStyle(canvas, null);
    canvas.width = Number.parseInt(style.width);
    canvas.height = Number.parseInt(style.height);
  }, 200);
};

// 画一层雨的纹理
export const makeOneRain = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const w = 600;
  const h = 600;
  canvas.width = w;
  canvas.height = h;

  const imageData = ctx.createImageData(w, h);

  for (let i = 0; i <= w; i++) {
    for (let j = 0; j <= h; j++) {
      const index = (i * h + j) * 4;
      if (index > w * h * 4) {
        break;
      }
      // j越小越宽，i越小越长
      const noise = simplex.noise2D(i * 0.003, j * 0.14) * 255;
      imageData.data[index] = noise / 1.4; // R
      imageData.data[index + 1] = noise / 1.4; // G
      imageData.data[index + 2] = noise / 1.4; // B
      imageData.data[index + 3] = noise; // A
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const canvas1 = makeOtherRain(imageData, w, h, 0);
  const canvas2 = makeOtherRain(imageData, w, h, 4);
  const canvas3 = makeOtherRain(imageData, w, h, 8);
  const canvas4 = makeOtherRain(imageData, w, h, 16);
  const canvas5 = makeOtherRain(imageData, w, h, 24);
  return [
    { canvas: canvas1, speed: 20, speed_p: 20, opacity: 0.4, y: 0, x: 0 },
    { canvas: canvas1, speed: 20, speed_p: 20, opacity: 0.4, y: -h + 80, x: 0 },
    { canvas: canvas1, speed: 18, speed_p: 18, opacity: 0.3, y: 0, x: 0 },
    { canvas: canvas1, speed: 18, speed_p: 18, opacity: 0.3, y: -h + 80, x: 0 },
    { canvas: canvas2, speed: 14, speed_p: 14, opacity: 0.25, y: 0, x: 0 },
    { canvas: canvas2, speed: 14, speed_p: 14, opacity: 0.25, y: -h + 80, x: 0 },
    { canvas: canvas3, speed: 8, speed_p: 8, opacity: 0.2, y: 0, y2: -h + 80, x: 0 },
    { canvas: canvas3, speed: 8, speed_p: 8, opacity: 0.2, y: -h + 80, x: 0 },
    { canvas: canvas4, speed: 4, speed_p: 4, opacity: 0.1, y: 0, x: 0 },
    { canvas: canvas4, speed: 4, speed_p: 4, opacity: 0.1, y: -h + 80, x: 0 },
    { canvas: canvas5, speed: 2, speed_p: 2, opacity: 0.36, y: 0, x: 0 },
    { canvas: canvas5, speed: 2, speed_p: 2, opacity: 0.36, y: -h + 80, x: 0 },
  ];
};

// 使用高斯模糊处理额外的图层
export const makeOtherRain = (imageData, w, h, radius) => {
  const newImageData = new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height);
  console.log("what is:", newImageData, w, h, radius);
  if (radius) {
    StackBlur.imageDataRGBA(newImageData, 0, 0, w, h, radius);
  }

  for (let i = 3; i < w * 4 * 50; i += 4) {
    newImageData.data[i] *= i / w / 200;
    newImageData.data[newImageData.data.length + 2 - i] *= i / w / 200;
  }
  console.log("newImageData:", newImageData);
  const canvas2 = document.createElement("canvas");
  canvas2.width = w;
  canvas2.height = h;
  const ctx2 = canvas2.getContext("2d");
  ctx2.putImageData(newImageData, 0, 0);

  return canvas2;
};

export default {
  init,
  initNoise,
  makeOneRain,
  makeOtherRain,
};
