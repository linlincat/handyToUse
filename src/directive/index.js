import HandSister from "../HandSister";

const directive = {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, binding) {
    el.ackun = new HandSister(el, binding.value);
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
