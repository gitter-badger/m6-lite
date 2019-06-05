/**
 * 级联字典提供
 * Created by XLBerry on 2019/6/4
 */

/**
 * 重置刷新
 * @param filter {string} 过滤条件
 * @param superData {object} 父级字典数据
 * @param from {number} 开始下标
 * @param total {number} 总数
 * @return {Promise<*>}
 */
export async function onReLoad({ filter, superData = {}, from, total }) {
  return onLoad({ filter, superData, from, total });
}

/**
 * 载入刷新
 * @param filter {string} 过滤条件
 * @param superData {object} 父级字典数据
 * @param from {number} 开始下标
 * @param total {number} 总数，可以避免服务器重复查询数据总数
 * @return {Promise<{total: number, list: Array}>}
 */
export async function onLoad({ filter, superData, from, total }) {
  console.log(`加载，从[${from}]开始，过滤[${filter}]，总数[${total}]，superData`, superData);
  await new Promise(resolve => setTimeout(resolve, 500));
  let remoteData;
  if (superData.code) {
    let superCode = `${superData.code}`.replaceAll("00", "");
    if (superCode.length === 2) {
      remoteData = city[superData.code]; // 加载市级数据
    } else {
      remoteData = county[superData.code]; // 加载县级数据
    }
  } else {
    remoteData = province;
  }

  let list = [];
  total = total || remoteData.length;
  for (let i = from, addLength = i + 10; i < addLength; i++) {
    if (i < total) {
      list.push(remoteData[i]);
    }
  }
  return { total, list };
}

/**
 * 级联模式下判断是否存在下级
 * @param data 父级字典项数据
 * @return {Promise<boolean>}
 */
export async function hasNext(data) {
  console.log("判断是否存在下级", data);
  // await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络请求
  let superCode = `${data.code}`.replaceAll("00", "");
  console.log("判断完成", superCode.length < 6);
  return superCode.length < 6;
}


const province = [
  {
    code: "110000",
    detail: "北京市"
  },
  {
    code: "120000",
    detail: "天津市"
  },
  {
    code: "440000",
    detail: "广东省"
  },
];

const city = {
  "110000": {},
  "120000": {},
  "440000": [
    {
      code: "440100",
      detail: "广州市"
    },
    {
      code: "440200",
      detail: "韶关市"
    },
    {
      "code": "440300",
      "detail": "深圳市"
    }
  ],
};

const county = {
  "440100": [
    {
      "code": "440103",
      "detail": "荔湾区"
    },
    {
      "code": "440104",
      "detail": "越秀区"
    },
    {
      "code": "440105",
      "detail": "海珠区"
    },
    {
      "code": "440106",
      "detail": "天河区"
    },
    {
      "code": "440111",
      "detail": "白云区"
    },
    {
      "code": "440112",
      "detail": "黄埔区"
    },
    {
      "code": "440113",
      "detail": "番禺区"
    },
    {
      "code": "440114",
      "detail": "花都区"
    },
    {
      "code": "440115",
      "detail": "南沙区"
    },
    {
      "code": "440117",
      "detail": "从化区"
    },
    {
      "code": "440118",
      "detail": "增城区"
    }
  ],
  "440200": [
    {
      "code": "440203",
      "detail": "武江区"
    },
    {
      "code": "440204",
      "detail": "浈江区"
    },
    {
      "code": "440205",
      "detail": "曲江区"
    },
    {
      "code": "440222",
      "detail": "始兴县"
    },
    {
      "code": "440224",
      "detail": "仁化县"
    },
    {
      "code": "440229",
      "detail": "翁源县"
    },
    {
      "code": "440232",
      "detail": "乳源瑶族自治县"
    },
    {
      "code": "440233",
      "detail": "新丰县"
    },
    {
      "code": "440281",
      "detail": "乐昌市"
    },
    {
      "code": "440282",
      "detail": "南雄市"
    }
  ],
  "440300": [
    {
      "code": "440303",
      "detail": "罗湖区"
    },
    {
      "code": "440304",
      "detail": "福田区"
    },
    {
      "code": "440305",
      "detail": "南山区"
    },
    {
      "code": "440306",
      "detail": "宝安区"
    },
    {
      "code": "440307",
      "detail": "龙岗区"
    },
    {
      "code": "440308",
      "detail": "盐田区"
    },
    {
      "code": "440309",
      "detail": "龙华区"
    },
    {
      "code": "440310",
      "detail": "坪山区"
    },
    {
      "code": "440311",
      "detail": "光明区"
    }
  ]
};