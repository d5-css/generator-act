/*jshint bitwise: false */
define(function (require, exports) {
    'use strict';
    var running = false,
        hasHashChangeEvent = 'onhashchange' in window,
        hasAddEventListener = 'addEventListener' in window,
        showDefaultPage, lastPage, lastPageName;
    /**
     * 启动路由
     * @param  {string} defaultPage 默认页面
     * @return {null}             
     */
    exports.start = function (defaultPage) {
        if (!running) {
            if (hasAddEventListener) {
                window.addEventListener('hashchange', onHashChange, false);
            } else if (hasHashChangeEvent) {
                window.onhashchange = onHashChange;
            }
            running = true;
            showDefaultPage = (typeof defaultPage) === 'string' ? function () {
                    location.replace('#!/' + defaultPage);
                } : function () {};
            onHashChange({
                newURL: window.location.href,
                oldURL: undefined
            });
        }
    };
    function onHashChange(e) {
        if (running) {
            var ctx = parseURL(e.newURL),
                opts = {
                    oldPage: lastPageName,
                    newPage: ctx.page,
                    oldURL: e.oldURL,
                    newURL: ctx.url
                };
            changePage(ctx.page, ctx.state, opts);
        }
    }
    /**
     * 将URL解析成page和state
     * @param  {[type]} url [description]
     * @return {[type]}     [description]
     */
    function parseURL(url) {
        url = url || '';
        var decode = window.decodeURIComponent;
        var hashIndex = url.indexOf('#!/'),
            hash = (hashIndex >= 0) ? url.slice(hashIndex + 3) : '';
        var searchIndex = hash.indexOf('?'),
            search = (searchIndex >= 0) ? hash.slice(searchIndex + 1) : '';
        var page = (searchIndex >= 0) ? hash.slice(0, searchIndex) : hash;
        // Fragment shouldn't contain `&`, use `!!` instead
        // http://tools.ietf.org/html/rfc3986
        // @example #!/wallpaper?super=beauty!!sub=nude
        var pairs = search.split(/!!(?!!)/),
            state = {};
        for (var j = 0; j < pairs.length; j++) {
            var pair = pairs[j].replace(/\+/g, '%20'),
                i = pair.indexOf('='),
                key = ~i ? pair.slice(0, i) : pair,
                value = ~i ? pair.slice(i + 1) : '';
            try {
                key = decode(key);
                value = decode(value);
            } catch (e) {}
            state[key] = value;
        }
        return {
            'url': url,
            'page': page,
            'state': state
        };
    }
    /**
     * change page form lastPage to page
     * @param string page
     * @param {} state
     * @param {} opts
     */
    function changePage(page, state, opts) {
        if (page === '') {
            showDefaultPage();
            return;
        }
        // todo: 过场?
        seajs.use('page/' + page, function (newPage) {
            if (newPage) {
                if (lastPage && lastPage.exit) {
                    lastPage.exit(opts);
                }
                if (newPage.enter) {
                    newPage.enter(state, opts);
                }
                lastPage = newPage;
                lastPageName = page;
            } else {
                showDefaultPage();
            }
        });
    }

/*
    exports.replace = function (page, state) {
        var ctx = parseURL('#!/' + page),
            url = '#!/' + ctx.page + '?',
            addParams = function (obj) {
                var prop;
                if (obj) {
                    for (prop in obj) {
                        if (prop && obj.hasOwnProperty(prop)) {
                            url += '!!' + prop + '=' + encodeURIComponent(obj[prop]);
                        }
                    }

                }
            };
        addParams(ctx.state);
        addParams(state);
        url = url.replace('?!!', '?').replace(/\?$/, '');
        location.replace(url);
    };
*/
});