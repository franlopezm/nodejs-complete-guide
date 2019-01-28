const path = require('path');

// root path directory
const rootDir = path.dirname(process.mainModule.filename);

/**
 * @description Build the path to a template
 * @param {String} templateName
 * @param {String} dirName By default is views
 * @return {String}
 */
const getPathView = (templateName, dirName = 'views') => {
  return path.join(rootDir, dirName, templateName);
}


module.exports = {
  rootDir,
  getPathView
};
