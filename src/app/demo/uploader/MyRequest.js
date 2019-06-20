/**
 * Created by XLBerry on 2019/6/18
 */
import M7 from "m7";
import CryptoJS from "./sha256";

const server = ""; // 交由app.js反向代理

/**
 * 数广请求头
 * @param cityCode
 * @return {{"x-tif-paasid": string, "x-tif-timestamp": string, "x-tif-nonce": string, "x-tif-signature": string, "dgd-pre-release": number, ds: string}}
 */
export function getRequestHeader(cityCode = "4419") {
  const paasid = "huazi", token = "DfQVEAzHY2JtM9ZtArS6yITvxS0oRWYl",
    timestamp = (Date.now() / 1000).toFixed(), nonce = "123456789abcdefg";
  const signature = CryptoJS.SHA256(timestamp + token + nonce + timestamp).toString(CryptoJS.enc.Hex).toUpperCase();
  return {
    "x-tif-paasid": paasid,
    "x-tif-timestamp": timestamp,
    "x-tif-nonce": nonce,
    "x-tif-signature": signature,
    "dgd-pre-release": 1,
    "ds": cityCode
  };
}

/**
 * 文件压缩
 * @param obj
 * @param output 返回base64字符串还是blob对象
 * @return {Promise<*>}
 */
async function imageCompress(obj, output = "string") {
  let newBase64 = await Image.compress(obj);
  if (output == "string") {
    return newBase64;
  } else if (output == "blob") {
    let byteString = atob(newBase64.split(",")[1]);
    let mimeString = newBase64.split(",")[0].split(":")[1].split(";")[0];
    let ab = new ArrayBuffer(byteString.length), ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
}

export async function upload({ data }, uploadType = "string") {
  let formData = new FormData();
  formData.append("type", data.fileType.replace("image/", ""));
  let zipOpt = { fileType: data.fileType, threshold: 1024, quality: 0.75 }; // 压缩配置
  const arrayBase64 = await Promise.all([
    // 原图压缩
    imageCompress({
      target: data.file,
      opt: zipOpt
    }, uploadType),
    // 生成小缩略图
    imageCompress({
      target: data.file,
      opt: { fileType: data.fileType, quality: 0.75, threshold: 150 }
    }, uploadType)
  ]);
  if (zipOpt.adjusted) {
    data.src = arrayBase64[0]; // 手动调整旋屏
  }
  if (uploadType === "string") {
    formData.append("base64", arrayBase64[0].replace(/^data:image\/(jpeg|jpg|png|gif);base64,/, ""));
    formData.append("sBase64", arrayBase64[1].replace(/^data:image\/(jpeg|jpg|png|gif);base64,/, ""));
  } else {
    formData.append("file", arrayBase64[0]);
    formData.append("sBase64", arrayBase64[1]);
  }

  try {
    const { data: { errcode, data: resData } } = await M7.requestAsync({
      method: "POST",
      headers: getRequestHeader(),
      url: `${server}/hz/service/wx/file/${uploadType === "string" ? "upload" : "sccl"}?ds=4419&rkdzcldm=0205`,
      data: formData,
      requestType: "file",
      responseType: "json",
    });
    if (errcode === 0 && resData.errcode === 0 && resData.id) {
      return resData.id;
    } else return null;
  } catch (e) {
    return null;
  }
}

export async function download({ data }) {
  try {
    const { data: { errcode, data: resData } } = await M7.requestAsync({
      method: "GET",
      headers: getRequestHeader(),
      url: `${server}/hz/service/wx/file/showBase64Image`,
      requestType: "json",
      responseType: "json",
      data: { imgId: data.data.id, compressed: data.compressed },
    });
    if (errcode === 0 && resData.base64) {
      if (resData.type) {
        resData.type = `data:image/${resData.type};base64,`;
      } else {
        resData.type = `data:image/jpeg;base64,`;
      }
      return { base64: resData.type + resData.base64 };
    } else {
      return {};
    }
  } catch (e) {
    return {};
  }
}