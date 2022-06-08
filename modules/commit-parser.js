const CONSTANTS = require("./constants.js");

const parseCommitMessage = (commitMsg) => {

  let result = {
    canBeParse: false
  }

  const msgRegex = CONSTANTS.REGEX_CONVENTIONAL_COMMIT_FORMAT;
  const matchResult = commitMsg.match(msgRegex);

  if (!matchResult) {
    return result
  }

  let { type, scopes, body } = matchResult.groups

  const scopesArray = scopes ? scopes.split(",") : []

  result.canBeParse = true
  result.type = type
  result.scopes = scopesArray
  result.body = body

  return result
}

module.exports = {
  parseCommitMessage
};
