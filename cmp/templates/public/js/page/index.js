define(function (require, exports) {
    'use strict';
    
    var index = document.getElementById('page-index');

    exports.enter = function () {
        index.style.display = 'block';
    };

    exports.exit = function () {
        index.style.display = 'none';
    };
});