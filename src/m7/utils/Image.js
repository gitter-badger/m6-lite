/**
 * 图片压缩
 * Created by XLBerry on 2018/12/19
 */

/** 获取原图base64 */
function getOriginalBase64(file, callback) {
  let reader = new FileReader();
  reader.addEventListener("load", e => {
    callback && callback(e.target["result"]);
  });
  reader.readAsDataURL(file);
}

/** 获取画布中的base64，包含画布方向修正 */
function getCanvasBase64(imgElement, opt) {
  let originalWidth = imgElement.width || 512, originalHeight = imgElement.height || 512;
  let originalMaxWH = Math.max(originalWidth, originalHeight);
  if (originalMaxWH === originalWidth) {
    opt.rate = Math.min(originalWidth, opt.maxWidth || opt.threshold || 1024) / originalWidth;
  } else {
    opt.rate = Math.min(originalHeight, opt.maxHeight || opt.threshold || 1024) / originalHeight;
  }
  // 等比例切换
  let w = Math.round(originalWidth * opt.rate), h = Math.round(originalHeight * opt.rate);
  if (!opt.quality) {
    if (opt.sourceSize <= 64 * 1024) opt.quality = 1;
    else if (opt.sourceSize <= 512 * 1024) opt.quality = 0.8;
    else if (opt.sourceSize <= 1024 * 1024) opt.quality = 0.75;
    else if (opt.sourceSize <= 2048 * 1024) opt.quality = 0.7;
    else if (opt.sourceSize <= 3072 * 1024) opt.quality = 0.65;
    else if (opt.sourceSize <= 4096 * 1024) opt.quality = 0.6;
    else opt.quality = 0.5;
  } else {
    opt.quality > 1 && (opt.quality = 1);
    opt.quality < 0 && (opt.quality = 0.1);
  }

  let canvas = document.createElement("canvas"), ctx = canvas.getContext("2d"), degree = 0, drawWidth = w,
    drawHeight = h;

  function adjusted(de, wi, he, dwi, dhe) {
    degree = de;
    canvas.width = wi;
    canvas.height = he;
    drawWidth = dwi;
    drawHeight = dhe;
    opt.adjusted = true;
  }

  switch (opt.orientation) {
    case 3:
      adjusted(180, w, h, -w, -h); // iphone横屏拍摄，此时home键在左侧
      break;
    case 6:
      adjusted(90, h, w, w, -h); // iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
      break;
    case 8:
      adjusted(270, h, w, -w, h); // iphone竖屏拍摄，此时home键在上方
      break;
    default:
      adjusted(0, w, h, w, h); // 正常拍摄角度
      break;
  }
  ctx.rotate(degree * Math.PI / 180);
  ctx.drawImage(imgElement, 0, 0, drawWidth, drawHeight);
  if (!opt.fileType) {
    opt.fileType = "image/jpg";
  } else {
    opt.fileType.indexOf("image/") === -1 ? `image/${opt.fileType}` : opt.fileType;
  }
  let newBase64 = canvas.toDataURL(opt.fileType, opt.quality);
  canvas = null;
  return newBase64;
}

function compress(sourceTarget, callback, opt = {}) {
  if (!sourceTarget) {
    callback && callback(sourceTarget);
    return;
  }

  let imgElement = new Image();

  function imgOnLoad() {
    if (opt.orientation) {
      imgOnEnd(getCanvasBase64(imgElement, opt));
    } else {
      window.EXIF.getData(imgElement, function () {
        opt.orientation = window.EXIF.getTag(this, "Orientation");
        imgOnEnd(getCanvasBase64(imgElement, opt));
      });
    }
  }

  function imgOnError() {
    imgOnEnd(null);
  }

  function imgOnEnd(newBase64) {
    imgElement.removeEventListener("load", imgOnLoad);
    imgElement.removeEventListener("error", imgOnError);
    imgElement = null;
    console.log(`图片方向[${opt.orientation || 1}]，压缩前${(opt.sourceSize / 1024).toFixed(2)}kb，压缩后${((newBase64 ? newBase64.length : 0) / 1024).toFixed(2)}kb`);
    callback && callback(newBase64);
  }

  imgElement.addEventListener("load", imgOnLoad);
  imgElement.addEventListener("error", imgOnError);
  imgElement.src = sourceTarget;
}

/**
 *
 * @param obj opt 参数集 { fileType: 图片类型jpg/png/gif, quality: 图片质量, maxWidth: 最大宽度, maxHeight: 最大高度, threshold: 最大阈值 }
 * @return {Promise<any>}
 */
Object.defineProperty(Image, "compress", {
  enumerable: false,
  configurable: true,
  writable: true,
  value: function (obj) {
    return new Promise(resolve => {
      let { target, opt = {} } = obj;
      if (typeof target == "object") {
        // 图片文件压缩
        if (target.size <= 1024 * 10) { // 10KB以下无需压缩
          getOriginalBase64(target, newBase64 => resolve(newBase64));
        } else {
          opt.sourceType = "file"; // 源为文件
          opt.sourceSize = target.size; // 源为文件大小
          opt.sourceURL = window.URL.createObjectURL(target); // 创建沙盒URL
          compress(opt.sourceURL, newBase64 => {
            window.URL.revokeObjectURL(opt.sourceURL); // 释放沙盒URL
            resolve(newBase64);
          }, opt);
        }
      } else if (typeof target == "string") {
        if (/^data:/i.test(target)) {
          opt.sourceType = "base64"; // Data URI
          opt.sourceSize = target.length; // 源为文件大小
        } else if (/^blob:/i.test(target)) {
          opt.sourceType = "url-object"; // Object URL
          opt.sourceSize = 2048 * 1024; // 预设本地图片2M
        } else {
          opt.sourceType = "url-network"; // http URL
          opt.sourceSize = 800 * 1024; // 预设网络图片800KB
        }
        if (opt.sourceSize <= 1024 * 10) {  // 10KB以下无需压缩
          resolve(target);
        } else {
          compress(target, newBase64 => resolve(newBase64), opt);
        }
      }
    });
  }
});