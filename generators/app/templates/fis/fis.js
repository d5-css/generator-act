'use strict';

module.exports = function () {
    fis.config.set('project.watch.usePolling', true);

    // roadmap.path
    fis.config.set('roadmap.path', require('./roadmap.path'));

    // preprocessor
    fis.config.set('modules.preprocessor.html', require('./preprocessor').I18N);

    // postprocessor
    fis.config.set('modules.postprocessor.js', require('./postprocessor').JS);

    // prepackager
    fis.config.set('modules.prepackager', require('./prepackager'));
};
