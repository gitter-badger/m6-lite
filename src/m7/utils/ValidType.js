/**
 * Created by XLBerry on 2019/6/6
 */

export default {
  required(value) {
    if (Array.isArray(value)) {
      return value.length > 0;
    } else if (typeof value == "object") {
      return Object.keys(value).length > 0;
    } else return !!(value && value !== 0);
  },
  mobile(value) {
    return typeof (value) == "string" && /^1[3456789]\d{9}$/.test(value.trim());
  },
};