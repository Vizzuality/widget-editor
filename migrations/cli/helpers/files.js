const fs = require('fs');

module.exports = {
  fileExists(filePath) {
    try {
      return fs.statSync(filePath).isFile();
    } catch (e) {
      return false;
    }
  },

  createReport(params, name, content) {
    let res = 'Widgets migration report\n\n';
    res += `Migration to version: ${params.version}\n`;
    res += `Applications: ${params.applications}\n`;
    res += `Environments: ${params.env}\n`;
    res += `API's URL: ${params.url}\n`;
    res += `Action: ${params.action}\n`;
    if (params.token) {
      res += `Token: ${params.token}\n`;
    }
    res += `\n${content}`;

    fs.writeFileSync(name, res);
  }
};
