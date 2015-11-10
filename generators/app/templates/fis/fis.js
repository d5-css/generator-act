'use strict';

module.exports = function () {
    fis.config.set('project.exclude', 'node_modules/**');
    fis.config.set('project.watch.usePolling', true);
    fis.config.set('project.md5Length', 8);

    // roadmap.path
    fis.config.set('roadmap.path', require('./roadmap.path'));

    // i18n preprocessor
    fis.config.set('settings.preprocessor.i18n', {
        i18n: fis.config.get('base.i18n')
    }); 
    fis.config.set('modules.preprocessor.html', 'i18n');

    // browserify prepackager
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
    fis.config.set('modules.prepackager', 'browserify');
};
