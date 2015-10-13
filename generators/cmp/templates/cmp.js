'use strict';

// 公共方法
// =========== Example ===========
function setColor(element, color) {
    element.style.color = color;
}
// ========= Example End =========

// 使用 CommonJs 规范
// 对外发布一个组件的构造函数
module.exports = function () {
    // =========== Example ===========
    // 这里的 this 为当前组件 Element
    var elPickMeUps = this.getElementsByClassName('pick-me-up');
    if (elPickMeUps.length) {
        setColor(elPickMeUps[0], 'red');
    }
    // ========= Example End =========
};
