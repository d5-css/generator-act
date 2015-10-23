'use strict';

module.exports = function () {
    fis.config.set('project.exclude', 'node_modules/**');
    fis.config.set('project.watch.usePolling', true);
    fis.config.set('project.md5Connector ', '.');
    fis.config.set('project.md5Length', 8);

    // roadmap.path
    fis.config.set('roadmap.path', require('./roadmap.path'));

    // i18n preprocessor
    fis.config.set('settings.preprocessor.i18n', {
        i18n: fis.config.get('base.i18n')
    }); 
    fis.config.set('modules.preprocessor.html', 'i18n');

    // browserify postprocessor
    fis.config.set('settings.postprocessor.browserify', {
        opts: {
            debug: true
        }
    }); 
    fis.config.set('modules.postprocessor.js', 'browserify');

    // prepackager
    fis.config.set('modules.prepackager', require('./prepackager'));
};
