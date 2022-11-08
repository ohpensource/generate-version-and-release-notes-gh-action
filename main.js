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

const baseCommitSha = process.env.BASE_COMMIT_SHA

const settings = settingsProvider.getSettings(process.env.SETTINGS_FILE)
logger.logKeyValuePair('settings', settings)

let commitChanges;
if (baseCommitSha) {
	commitChanges = git.getChangesSinceCommitSha(baseCommitHash)
} else {
	commitChanges = git.getChangesFromLastCommit() // changes MUST be squashed into the last commit
}

let commitsParsed = commitChanges
	.map(ch =>
			 commitParser.parseCommitMessage(ch.message, ch.commit.shortHash, settings))

commitsParsed.forEach((commit, index) => logger.logKeyValuePair(`commit ${index}`, commit));

const previousVersionRepo = fileTools.getJsonFrom(VERSION_FILE)?.version ?? DEFAULT_INITIAL_VERSION

const changesDone = commitsParsed.map(x => x.release)
const newVersionRepo = semver.calculateNextVersion(previousVersionRepo, changesDone)
logger.logKeyValuePair(`newVersionRepo`, newVersionRepo)

logger.logTitle("UPDATING VERSION FILE")
fileTools.saveJsonTo(
    VERSION_FILE,
    { version: newVersionRepo }
)
git.addFile(VERSION_FILE)

let scopes = commitsParsed.map(x => x.scopes).flat(1)
scopes = [...new Set(scopes), SCOPE_EMPTY]
logger.logKeyValuePair(`scopes`, scopes)


scopes.forEach(scope => {
    const commits = scope === SCOPE_EMPTY ?
        commitsParsed.filter(x => x.scopes.length === 0) :
        commitsParsed.filter(x => x.scopes.includes(scope))

    const changelog = scope === SCOPE_EMPTY ?
        CHANGELOG_FILE :
        `${settings.scopes[scope].folderPattern}/${CHANGELOG_FILE}`
    const versioningEnable = scope === SCOPE_EMPTY ?
        false :
        settings.scopes[scope].versioning || false

    if (commits.length > 0) {
        let newVersionForScope = newVersionRepo

        if (versioningEnable) {
            const versionJsonPath = `${settings.scopes[scope].folderPattern}/${VERSION_FILE}`
            const previousVersion = fileTools.getJsonFrom(versionJsonPath)?.version ?? DEFAULT_INITIAL_VERSION
            const changesDonePerScope = commits.map(x => x.release)
            newVersionForScope = semver.calculateNextVersion(previousVersion, changesDonePerScope)
            fileTools.saveJsonTo(
                versionJsonPath,
                { version: newVersionForScope }
            )
            git.addFile(versionJsonPath)
        }
        changelogBuilder.updateChangelog(changelog, newVersionForScope, commits)
        git.addFile(changelog)
    }
})

if (!skipGitCommit) {

    logger.logTitle("COMMITTING AND TAGGING");
    logger.logKeyValuePair("versionPrefix", versionPrefix)
    logger.logKeyValuePair("newVersion", newVersionRepo)

    const tag = `${versionPrefix}${newVersionRepo}`
    const commitMsg = `[skip ci] Bump to version ${tag}`
    const tagMsg = `Tag for version ${tag}`
    git.commitAndTag(commitMsg, tagMsg, tag)
}
