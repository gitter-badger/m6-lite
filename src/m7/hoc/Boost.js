/**
 * 函数防抖和函数节流
 * Created by XLBerry on 2018/12/17
 */

/**
 * 函数防抖
 * @param delay 毫秒
 * @return {function(*, *, *=): *}
 */
export function debounce(delay = 300) {
  const recordMap = new Map();
  return function (target) {
    const key = target.toString();
    recordMap.set(key, { time: 0 });

    function handle() {
      const iMap = recordMap.get(key);
      clearTimeout(iMap.id);
      iMap.time = Date.now();
      target.apply(this, iMap.value);
      delete iMap.value;
      iMap.id = setTimeout(() => {
        if (recordMap.get(key).value) {
          handle.call(this);
        }
      }, delay);
      recordMap.set(key, iMap);
    }

    function wrapFunc() {
      const iMap = recordMap.get(key);
      iMap.value = arguments;
      recordMap.set(key, iMap);
      if (Date.now() - iMap.time >= delay) {
        handle.call(this);
      }
    }

    return wrapFunc;
  };
}