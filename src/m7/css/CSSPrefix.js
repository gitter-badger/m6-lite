/**
 * Created by XLBerry on 2019/5/31
 */

export function setTransformStr(x = "0px", y = "0px", z = "0px") {
  return `-webkit-transform: translate3d(${x}, ${y}, ${z}); transform: translate3d(${x}, ${y}, ${z});`;
}

export function setTransformMap(x = "0px", y = "0px", z = "0px") {
  const t3d = `translate3d(${x}, ${y}, ${z})`;
  return {
    WebkitTransform: t3d,
    transform: t3d
  };
}

export function setTransform(ele, x = "0px", y = "0px", z = "0px") {
  ele.style.transform = `translate3d(${x}, ${y}, ${z})`;
  ele.style.webkitTransform = `translate3d(${x}, ${y}, ${z})`;
}

export function getTransform(ele) {
  let tf = ele.style.transform || ele.style.webkitTransform;
  if (tf) {
    return tf.replace("translate3d(", "").replace(")", "").replaceAll("px", "").split(", ").map((k) => ~~k);
  } else {
    return [0, 0, 0];
  }
}