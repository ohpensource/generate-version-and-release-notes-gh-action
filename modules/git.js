const logger = require('./logger.js')

const child = require("child_process");
const splitText = "<#@112358@#>";
const prettyFormat = [
  "%h",
  "%H",
  "%s",
  "%f",
  "%b",
  "%at",
  "%ct",
  "%an",
  "%ae",
  "%cn",
  "%ce",
  "%N",
  "",
];

const getLastCommit = () => {
  let commit = child
    .execSync(
      `git log HEAD^1..HEAD --pretty=format:"${prettyFormat.join(splitText)}"`
    )
    .toString("utf-8")
    .split(`${splitText}\n`)
    .map((commitInfoText) => getCommitInfo(commitInfoText))[0];

  return commit;
};

const getMergedCommits = () => {
  const lastCommit = getLastCommit()
  logger.logKeyValuePair('last commit', lastCommit)

  let changes = lastCommit.body
    .split("\n")
    .filter((block) => block.startsWith("* "))
    .map((block) => block.replace("* ", ""));

  return changes;
};

const getCommitInfo = (commitToParse) => {
  let commitInfoAsArray = commitToParse.split(`${splitText}`);
  var branchAndTags = commitInfoAsArray[commitInfoAsArray.length - 1]
    .split("\n")
    .filter((n) => n);
  var branch = branchAndTags[0];
  var tags = branchAndTags.slice(1);

  return {
    shortHash: commitInfoAsArray[0],
    hash: commitInfoAsArray[1],
    subject: commitInfoAsArray[2],
    sanitizedSubject: commitInfoAsArray[3],
    body: commitInfoAsArray[4],
    authoredOn: commitInfoAsArray[5],
    committedOn: commitInfoAsArray[6],
    author: {
      name: commitInfoAsArray[7],
      email: commitInfoAsArray[8],
    },
    committer: {
      name: commitInfoAsArray[9],
      email: commitInfoAsArray[10],
    },
    notes: commitInfoAsArray[11],
    branch,
    tags,
  };
};

const getFilesModifiedInACommit = (commitHash) => child
  .execSync(`git diff-tree --no-commit-id --name-only -r ${commitHash}`)
  .toString("utf-8")
  .split("\n")
  .filter(line => line.length > 0)

module.exports = {
  getMergedCommits,
  getFilesModifiedInACommit
};
