import HandSister from "../HandSister";

const directive = {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, binding) {
    console.log(el, "insert el")
    el.ackun = new HandSister(el, binding.value);  // el 是DOM,不好直接在它之上销毁,所以把创建的实例给到它的属性上;
    console.log(el.ackun, "insert el after el.ackun")
  },
  update: function (el, binding) {
    el.ackun.destroy();
    el.ackun = new HandSister(el, binding.value);
  },
  unbind: function (el) {
    el.ackun.destroy();
  },
};

const vueHandSister = {
  install: function (Vue) {
    Vue.directive("handsister", directive);
  },
};

export default vueHandSister;
