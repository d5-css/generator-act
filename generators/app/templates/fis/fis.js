'use strict';

module.exports = function () {
    fis.config.set('project.exclude', 'node_modules/**');
    fis.config.set('project.watch.usePolling', true);
    fis.config.set('project.md5Length', 8);

    // roadmap.path
    fis.config.set('roadmap.path', require('./roadmap.path'));

    // less with sourceMap
    fis.config.set('settings.parser.less', {
        sourceMap: true
    });

    // sttings: i18n prepackager
    // https://github.com/csbun/fis-prepackager-i18n
    fis.config.set('settings.prepackager.i18n', {});

    // sttings: browserify prepackager
    // https://github.com/csbun/fis-prepackager-browserify
    fis.config.set('settings.prepackager.browserify', {
        // browserify opts
        browserify: {
            debug: true
        },
        // html-minifier Options
        'html-minifier': {
            removeComments: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            preserveLineBreaks: true
        }
    });
    fis.config.set('modules.prepackager', ['i18n', 'browserify']);
};
