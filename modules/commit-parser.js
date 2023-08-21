const git = require('./git.js')
const REGEX_CONVENTIONAL_COMMIT_FORMAT = /(?<type>^[a-z\d]+)\(?(?<scopes>[a-z_\d,\-]+)?\)?(?<breaking>!)?(?<colon>:{1})(?<space> {1})(?<body>.*)/

const parseCommitMessage = (commitMsg, commitHash, settings) => {

  const types = settings.conventionalCommits

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

  const scopesArray = getScopes(scopes, commitHash, settings)

  result.body = body
  result.type = type || ""
  result.release = breaking === "!" ? "major" : types[type]?.release || "none"
  result.scopes = scopesArray

  return result
}

const getScopes = (commitScopes, commitHash, settings) => {
  const scopesDiscovery = settings.scopesDiscovery
  const commitScopesArray =  commitScopes ? commitScopes.split(",") : []

  if (!scopesDiscovery) {   
    return commitScopesArray
  }
  
  const settingsScopes = settings.scopes
  const autodiscoveredScopesArray = getAutodiscoveredScopes(commitHash, settingsScopes)

  const result = commitScopesArray.concat(autodiscoveredScopesArray)
  
  return [...new Set(result)] 
}

const getAutodiscoveredScopes = (commitHash, configScopes) => {  
  let filesModified = git.getFilesModifiedInACommit(commitHash)

  let result = []
    const folderPatterns = Object.entries(configScopes).map(x => x[1].folderPattern)
    filesModified.forEach(file => {
      const fileHasScopeAssociated = folderPatterns.some(x => file.includes(x))
      if (fileHasScopeAssociated) {
          const missingScope = Object.entries(configScopes).find(x => file.includes(x[1].folderPattern))[0]
          result.push(missingScope)
      }
    })

    return [...new Set(result)]
}

module.exports = {
  parseCommitMessage
};
