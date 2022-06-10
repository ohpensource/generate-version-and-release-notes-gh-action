const fs = require("fs");

function getJsonFrom(file) {
  let jsonObject = {};
  if (fs.existsSync(file)) {
    jsonObject = JSON.parse(fs.readFileSync(file));
  }
  return jsonObject;
}

function prettifyJsonObject(obj) {
  return JSON.stringify(obj, null, 4);
}

function saveJsonTo(file, jsonObject) {
  fs.writeFileSync(file, prettifyJsonObject(jsonObject));
}

module.exports = {
  getJsonFrom,
  saveJsonTo
};
