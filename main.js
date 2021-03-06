const git = require("./modules/git.js")
const logger = require("./modules/logger.js")
const commitParser = require("./modules/commit-parser.js")
const settingsProvider = require("./modules/settings-provider.js")
const fileTools = require("./modules/file-tools.js");
const semver = require("./modules/semver.js")
const changelogBuilder = require("./modules/changelog-builder.js")

const CHANGELOG_FILE = "CHANGELOG.md"
const VERSION_FILE = "version.json"
const DEFAULT_INITIAL_VERSION = "0.0.0"
const SCOPE_EMPTY = `SCOPE_EMPTY_${new Date()}`
const skipGitCommit = process.env.SKIP_GIT_COMMIT === 'true'
const versionPrefix = process.env.VERSION_PREFIX || ""

const settings = settingsProvider.getSettings(process.env.SETTINGS_FILE)
logger.logKeyValuePair('settings', settings)

const lastTag = git.getLastTag()
logger.logKeyValuePair('lastTag', lastTag)

const commitsMerged = git.getCommitsSinceTag(lastTag)

let commitsParsed = commitsMerged
    .map(commit =>
        commitParser.parseCommitMessage(commit, settings.conventionalCommits))

commitsParsed.forEach((commit, index) => logger.logKeyValuePair(`commit ${index}`, commit));

const previousVersion = fileTools.getJsonFrom(VERSION_FILE)?.version ?? DEFAULT_INITIAL_VERSION

const changesDone = commitsParsed.map(x => x.release)
const newVersion = semver.calculateNextVersion(previousVersion, changesDone)
logger.logKeyValuePair(`newVersion`, newVersion)

logger.logTitle("UPDATING VERSION FILE")
fileTools.saveJsonTo(
    VERSION_FILE,
    { version: newVersion }
)
git.addFile(VERSION_FILE)

let scopes = commitsParsed.map(x => x.scopes).flat(1)
scopes = [...new Set(scopes), SCOPE_EMPTY]
logger.logKeyValuePair(`scopes`, scopes)


scopes.forEach(scope => {

    logger.logKeyValuePair(`scope`, scope)

    const commits = scope === SCOPE_EMPTY ?
        commitsParsed.filter(x => x.scopes.length === 0) :
        commitsParsed.filter(x => x.scopes.includes(scope))

    const changelog = scope === SCOPE_EMPTY ?
        CHANGELOG_FILE :
        `${settings.scopes[scope].folderPattern}/${CHANGELOG_FILE}`

    if (commits.length > 0) {
        logger.logTitle(`UPDATING CHANGELOG FILE: ${changelog}`)
        logger.logKeyValuePair(`commits for changelog`, commits)

        changelogBuilder.updateChangelog(changelog, newVersion, commits)
        git.addFile(changelog)
    }
})

if (!skipGitCommit) {

    logger.logTitle("COMMITTING AND TAGGING");
    logger.logKeyValuePair("versionPrefix", versionPrefix)
    logger.logKeyValuePair("newVersion", newVersion)

    const tag = `${versionPrefix}${newVersion}`
    const commitMsg = `[skip ci] Bump to version ${tag}`
    const tagMsg = `Tag for version ${tag}`
    git.commitAndTag(commitMsg, tagMsg, tag)
}
