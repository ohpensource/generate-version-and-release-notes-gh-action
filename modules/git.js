const child = require("child_process")
const logger = require('./logger.js')

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

getLastTag = () => child
  .execSync(`git tag --sort=-version:refname| head -n 1`)
  .toString("utf-8")
  .split(`\n`)
  .filter(x => x.toString().length > 0)[0]

function parseCommitMsgsSquashed(commit) {
  return commit.body
    .split("\n")
    .filter((block) => block.startsWith("* "))
    .map((block) => block.replace("* ", ""));
}

const getCommitsSinceTag = (tag) => {
  let commits = child
    .execSync(
      `git log ${tag}..HEAD --no-merges --pretty=format:"${prettyFormat.join(
        splitText
      )}"`
    )
    .toString("utf-8")
    .split(`${splitText}\n`)
    .map((commitInfoText) => getCommitInfo(commitInfoText));

  if (commits.length === 1 && commits[0].shortHash === "") {
    return []
  }

  let changes = []
  commits.forEach(x => {
    if (x.body !== '') {
      const commitMsgsSquashed = parseCommitMsgsSquashed(x)
      changes = changes.concat(commitMsgsSquashed)
    } else {
      changes.push(x.subject)
    }
  })

  return changes;
};

const getAllCommits = () => {
  let commits = child
    .execSync(
      `git log --all --no-merges --pretty=format:"${prettyFormat.join(
        splitText
      )}"`
    )
    .toString("utf-8")
    .split(`${splitText}\n`)
    .map((commitInfoText) => getCommitInfo(commitInfoText));

  if (commits.length === 1 && commits[0].shortHash === "") {
    return []
  }

  let changes = []
  commits.forEach(x => {
    if (x.body !== '') {
      const commitMsgsSquashed = parseCommitMsgsSquashed(x)
      changes = changes.concat(commitMsgsSquashed)
    } else {
      changes.push(x.subject)
    }
  })

  return changes;
};

function commitAndTag(commitMsg, tagMsg, tag) {
  child.execSync(`git commit -m "${commitMsg}"`)
  child.execSync(`git tag -a -m "${tagMsg}" ${tag}`)
  child.execSync(`git push --follow-tags`)
}

function addFile(file) {
  child.execSync(`git add ${file}`)
}

module.exports = {
  getCommitsSinceTag,
  getAllCommits,
  commitAndTag,
  addFile,
  getLastTag
};
