/**
 * Created by XLBerry on 2019/6/3
 */

/**
 * 重置刷新
 * @param filter {string} 过滤条件
 * @param from {number} 开始下标
 * @param total {number} 总数
 * @return {Promise<*>}
 */
export async function onReLoad({ filter, from, total }) {
  return onLoad({ filter, from, total });
}

/**
 * 载入刷新
 * @param filter {string} 过滤条件
 * @param from {number} 开始下标
 * @param total {number} 总数，可以避免服务器重复查询数据总数
 * @return {Promise<{total: number, list: Array}>}
 */
export async function onLoad({ filter, from, total }) {
  console.log(`加载，从[${from}]开始，过滤[${filter}]，总数[${total}]`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  let list = [], testTotal = 42;
  for (let i = from, addLength = i + 10; i < addLength; i++) {
    if (i <= testTotal) {
      list.push({ code: i, detail: "代码" + (i + 1) + "_" + (filter || "") });
    }
  }
  return { total: testTotal, list };
}