export default class HandSister {
  constructor(domEl, config = {}) {
    // domEl 需要知道要定位的是那个dom元素
    if (!domEl) {
      throw Error("HandSister 必须绑定一个dom元素");
    }
    if (!domEl.parentNode) {
      throw Error("HandSister 绑定元素必须有父元素");
    }

    //用来保存所有的实例
    HandSister._instanceList = [];
    //自增的int类型ID
    HandSister.ID = 1;

    HandSister.destroyAll = function () {
      for (let i = 0; i < HandSister._instanceList.length; i++) {
        console.log(HandSister._instanceList.length, "HandSister._instanceList.length")
        const instance = HandSister._instanceList[i];
        instance.destroy();
        i--;   // 由于 instance.destroy() 执行的是splice(index, 1) 所以加了i-- 
        //  i === HandSister._instanceList.length 的时候直接HandSister._instanceList = [] 会更直接一些
      }
    };

    this.config = {
      ...{
        id: HandSister.ID,
        x: HandSister.x, // 相对于父元素的x坐标
        y: HandSister.y,
        width: HandSister.width,
        height: HandSister.height,
        autoCount: HandSister.autoCount,
      },
      ...config,
    }; //保存原始的config留个底，

    this.config.id = HandSister.ID; //这个id不允许用户来改变

    this.domEl = domEl;
    this.parentEl = domEl.parentNode;
    this.parentElWidth = this.parentEl.clientWidth;
    this.parentElHeight = this.parentEl.clientHeight;

    this.id = null;
    this.x = null; //x坐标
    this.y = null; //y坐标
    this.width = null; //宽度
    this.height = null; //高度

    this._init();
  }

  _init() {
    HandSister.ID++;
    HandSister._instanceList.push(this);

    this._computedConfig();
    //domEl的父元素必须是relateive定位
    this.parentEl.style.position = "relative";
    //domEl的父元素必须不能有滚动条
    this.parentEl.style.overflow = "hidden";
    //监听父元素的尺寸
    this.watchParentInterval = setInterval(this.resize.bind(this), 300);
  }

  /**
   * 刷新大小和位置
   */
  resize() {
    let width = this.parentEl.clientWidth;
    let height = this.parentEl.clientHeight;
    if (width != this.parentElWidth || height != this.parentElHeight) {
      this.parentElWidth = this.parentEl.clientWidth;
      this.parentElHeight = this.parentEl.clientHeight;
      this._computedConfig(this.config);
      //先设置元素样式
      this._setStyle();
    }
  }

  _computedConfig() {
    this.x = unify(config.x, this.parentElWidth); //x坐标
    this.y = unify(config.y, this.parentElHeight); //y坐标
    this.width = unify(config.width, this.parentElWidth); //宽度
    this.height = unify(config.height, this.parentElHeight); //高度
  }

  /**
   * 设置元素样式
   */
  _setStyle() {
    this.domEl.style.position = "absolute"; //将this.domEl设置为absolute绝对定位
    this.domEl.style.left = this.x.num + "px";
    this.domEl.style.top = this.y.num + "px";
    this.domEl.style.width = this.width.num + "px";
    this.domEl.style.height = this.height.num + "px";
  }

  /**
   * 销毁
   */
  destroy() {
    clearInterval(this.watchParentInterval);
    this.watchParentInterval = null;
    const index = HandSister._instanceList.findIndex((instance) => {
      return this.id === instance.id;
    });
    HandSister._instanceList.splice(index, 1);  
  }
}

HandSister.x = 0;
HandSister.y = 0;
HandSister.width = "100px";
HandSister.height = "100px";

/**
 *
 * @param {*String} str 要提取数据的字符串比如 ‘10px’,'20%' ,目前只支持这两种单位
 * @returns
 */
export function getNumAndUnit(str) {
  let reg = /([0-9]+\.*[0-9]*)\s*([a-zA-z%]*)/gi;
  let res = reg.exec(str);
  if (res) {
    return {
      num: parseFloat(res[1]) || 0,
      unit: res[2] !== "px" && res[2] !== "%" ? "px" : res[2],
    };
  } else {
    return {
      num: 0,
      unit: "px",
    };
  }
}

/**
 *
 * @param {*} str 需要转换的 数值字符串 '10%','20%'
 * @param {*} refer 百分比时参考的100%长度
 * @returns  返回转换成px的数值,以及初始的单位
 */
export function unify(str = "", refer = getWindowSize().width) {
  if (!str) {
    return {
      num: 0,
      originUnit: "px",
    };
  }
  let numObj = getNumAndUnit(str);
  if (numObj.unit === "px") {
    return {
      num: numObj.num,
      originUnit: numObj.unit,
    };
  } else if (numObj.unit === "%") {
    return {
      num: (numObj.num * parseFloat(refer)) / 100,
      originUnit: numObj.unit,
    };
  }
}

// window.HandSister = HandSister
// export default HandSister
