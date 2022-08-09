const git = require("./modules/git.js")
const logger = require("./modules/logger.js")

const versionPrefix = process.env.VERSION_PREFIX || ""
const skipGitCommit = process.env.SKIP_GIT_COMMIT === 'true'
const newVersion = process.env.NEW_VERSION

if (!skipGitCommit) {

    logger.logTitle("COMMITTING AND TAGGING");
    logger.logKeyValuePair("versionPrefix", versionPrefix)
    logger.logKeyValuePair("newVersion", newVersion)

    const tag = `${versionPrefix}${newVersion}`
    const commitMsg = `[skip ci] Bump to version ${tag}`
    const tagMsg = `Tag for version ${tag}`
    git.commitAndTag(commitMsg, tagMsg, tag)
}
