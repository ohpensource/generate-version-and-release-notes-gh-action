const REGEX_CONVENTIONAL_COMMIT_FORMAT = /(?<type>^[a-z\d]+)\(?(?<scopes>[a-z\d,\-]+)?\)?(?<breaking>!)?(?<colon>:{1})(?<space> {1})(?<body>.*)/

const parseCommitMessage = (commitMsg, types) => {

  let result = {
    body: commitMsg,
    type: "",
    release: "none",
    scopes: []
  }

  const msgRegex = REGEX_CONVENTIONAL_COMMIT_FORMAT;
  const matchResult = commitMsg.match(msgRegex);

  if (!matchResult) {
    return result
  }

  let { type, scopes, body, breaking } = matchResult.groups

  const scopesArray = scopes ? scopes.split(",") : []

  result.body = body
  result.type = type || ""
  result.release = breaking === "!" ? "major" : types[type]?.release || "none"
  result.scopes = scopesArray

  return result
}

module.exports = {
  parseCommitMessage
};
