const child = require("child_process");
const fs = require("fs");
const git = require("./git.js");
const logger = require("./logging.js");
const files = require("./file-tools.js");

logger.logTitle("GENERATE VERSION AND RELEASE NOTES");

// -----------------------------//
// ----- INPUT PARAMETERS ----- //
// -----------------------------//

const skipGitCommit = process.argv[2];
const versionPrefix = process.argv[3];
const customCCFilePath = process.argv[4] || 'not provided';
const defaultCCFilePath = process.env.DEFAULT_CC
defaultCCTypes = parseFile(defaultCCFilePath)

logger.logKeyValuePair("skip-git-commit", skipGitCommit);
logger.logKeyValuePair("version-prefix", versionPrefix);
logger.logKeyValuePair("custom-conventional-commits-file", customCCFilePath);
logger.logKeyValuePair("default-cc-types", defaultCCTypes);

// ------------------ //
// ----- SCRIPT ----- //
// ------------------ //

const versionFile = "version.json";
const changelogFile = "CHANGELOG.md";

let useCustomCC = false
let customCCTypes = []
if (customCCFilePath !== 'not provided') {
  useCustomCC = true;
  customCCTypes = parseFile(customCCFilePath);
  logger.logKeyValuePair("custom-cc-types", customCCTypes);
}

logger.logKeyValuePair("using-custom-conventional-commits", useCustomCC);
const commitTypes = useCustomCC ? customCCTypes : defaultCCTypes

logger.logTitle("GETTING MERGE COMMIT");
let lastCommit = git.getLastCommit();
logger.logKeyValuePair("commit", lastCommit);

logger.logTitle("GETTING CHANGES");
let changes = lastCommit.body
  .split("\n")
  .filter((block) => block.startsWith("* "))
  .map((block) => getChange(block.replace("* ", ""), commitTypes));

if (changes.length === 0) {
  changes.push(getChange(lastCommit.subject, commitTypes));
}
logger.logKeyValuePair("changes", changes);

logger.logTitle("GETTING PREVIOUS VERSION");
let versionFileContent = files.getJsonFrom(versionFile);
let previousVersion = getPreviousVersionAsText(versionFileContent);
logger.logKeyValuePair("previous-version", previousVersion);

logger.logTitle("GETTING NEW VERSION");
let newVersion = getUpdatedVersion(previousVersion, changes);
logger.logKeyValuePair("new-version", newVersion);

if (skipGitCommit !== "true") {
  logger.logTitle("PULLING LAST REPO CHANGES");
  gitPull();
}

logger.logTitle("UPDATING VERSION FILE");
files.saveJsonTo(
  versionFile,
  files.prettifyJsonObject({ version: newVersion })
);

logger.logTitle("UPDATING CHANGELOG FILE");
updateChangelogFile(newVersion, changes);

if (skipGitCommit !== "true") {
  logger.logTitle("COMMITTING AND TAGGING");
  logger.logKeyValuePair('versionPrefix', versionPrefix);
  logger.logKeyValuePair('newVersion', newVersion);
  commitAndTag(`${versionPrefix}${newVersion}`);
}

// --------------------- //
// ----- FUNCTIONS ----- //
// --------------------- //
function updateChangelogWith(changelog, title, changeContents) {
  if (changeContents.length > 0) {
    changelog += `${title}`;
    changeContents.forEach((content) => {
      changelog += content;
    });
  }
  return changelog;
}
function getUpdatedVersion(version, changes) {
  let versionFileContent = version.split(".");
  let major = parseInt(versionFileContent[0], 10);
  let minor = parseInt(versionFileContent[1], 10);
  let patch = parseInt(versionFileContent[2], 10);
  let secondary = 0;
  if (versionFileContent.length > 3) {
    secondary = parseInt(versionFileContent[3], 10);
  }

  let newMajor = 0;
  let newMinor = 0;
  let newPatch = 0;
  let newSecondary = 0;
  if (changes.some((change) => change.type === "major")) {
    newMajor = major + 1;
    newMinor = 0;
    newPatch = 0;
    newSecondary = 0;
  } else if (changes.some((change) => change.type === "minor")) {
    newMajor = major;
    newMinor = minor + 1;
    newPatch = 0;
    newSecondary = 0;
  } else if (
    changes.some((change) => change.type === "patch") ||
    versionFileContent.length === 3
  ) {
    newMajor = major;
    newMinor = minor;
    newPatch = patch + 1;
    newSecondary = 0;
  } else {
    newMajor = major;
    newMinor = minor;
    newPatch = patch;
    newSecondary = secondary + 1;
  }

  if (versionFileContent.length === 3) {
    return `${newMajor}.${newMinor}.${newPatch}`;
  } else {
    return `${newMajor}.${newMinor}.${newPatch}.${newSecondary}`;
  }
}
function getChange(line, commitTypes) {
  const convRegex = /(?<type>^[a-z]+)(?<scope>\([a-z\d,\-]+\))?(?<breaking>!)?(?<colon>:{1})(?<space> {1})(?<subject>.*)/;
  let matchResult = line.match(convRegex);

  if (matchResult) {

    let result = {
      type: '',
      content: ''
    }
    let { type, breaking, scope, subject } = matchResult.groups;
    breaking = breaking == '!'
    const validPrefix = commitTypes.some(x => x.commitType == type);

    if (validPrefix) {
      result.type = breaking ? "major" : commitTypes.find(x => x.commitType == type).releaseType
      result.content = subject.trim()
      if (scope)
        result.content = `${scope.trim()}: ${result.content}`
    } else {
      result.type = "none"
      result.content = line.trim()
    }


    if (breaking) {
      logger.logKeyValuePair('commit message', line)
      logger.logWarning(`\tbreaking:${breaking} `)
      logger.logWarning(`\ttype:${result.type} `)
    }

    logger.logKeyValuePair('result', result)

    return result
  }

  return {
    type: "none",
    content: line.trim()
  }
}
function getPreviousVersionAsText(versionFileContent) {
  let previousVersion = "";
  if (versionFileContent.version) {
    previousVersion = versionFileContent.version;
  } else {
    previousVersion = "0.0.0";
  }
  return previousVersion;
}
function updateChangelogFile(newVersion, changes) {
  let changelog = `# :confetti_ball: ${newVersion} (${new Date().toISOString()})\n`;
  changelog += "- - -\n";
  changelog = updateChangelogWith(
    changelog,
    "## :boom: BREAKING CHANGES\n",
    changes
      .filter((change) => change.type == "major")
      .map((change) => `* ${change.content}\n`)
  );
  changelog = updateChangelogWith(
    changelog,
    "## :hammer: Features\n",
    changes
      .filter((change) => change.type == "minor")
      .map((change) => `* ${change.content}\n`)
  );
  changelog = updateChangelogWith(
    changelog,
    "## :bug: Fixes\n",
    changes
      .filter((change) => change.type == "patch")
      .map((change) => `* ${change.content}\n`)
  );
  changelog = updateChangelogWith(
    changelog,
    "## :newspaper: Others\n",
    changes
      .filter((change) => change.type == "none")
      .map((change) => `* ${change.content}\n`)
  );
  changelog += "- - -\n";
  changelog += "- - -\n";
  console.log(changelog);
  let previousChangelog = "";
  try {
    previousChangelog = fs.readFileSync(changelogFile, "utf-8");
  } catch (error) {
    previousChangelog = "";
  }
  fs.writeFileSync(changelogFile, `${changelog}${previousChangelog}`);
}
function gitPull(tagContent) {
  child.execSync(`git config pull.ff only`);
  child.execSync(`git pull`);
}

function commitAndTag(tagContent) {
  child.execSync(`git add ${versionFile}`);
  child.execSync(`git add ${changelogFile}`);

  logger.logAction("committing and tagging locally")
  child.execSync(`git commit -m "[skip ci] Bump to version ${tagContent}"`);
  child.execSync(`git tag -a -m "Tag for version ${tagContent}" ${tagContent}`);

  logger.logAction("pulling latest changes")
  child.execSync(`git pull --ff-only`);

  logger.logAction("pushing changes")
  child.execSync(`git push --follow-tags`);
}

// --------------------- //
// ----- FUNCTIONS ----- //
// --------------------- //
function parseFile(filePath) {
  const rawdata = fs.readFileSync(filePath);
  return JSON.parse(rawdata);
}