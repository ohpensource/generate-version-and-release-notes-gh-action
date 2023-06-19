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

const getLastCommit = () => {
  return child
    .execSync(
      `git log HEAD^1..HEAD --pretty=format:"${prettyFormat.join(splitText)}"`
    )
    .toString("utf-8")
    .split(`${splitText}\n`)
    .map((commitInfoText) => getCommitInfo(commitInfoText))[0];
};

const getChangesFromLastCommit = () => {
  const lastCommit = getLastCommit()
  logger.logKeyValuePair('last commit', lastCommit)

	let changes = parseCommitMsgsSquashed(lastCommit)

	if (changes.length === 0) {
		changes = new Array(lastCommit.subject)
	}

	let result = []
	changes.forEach(m => {
		result.push(mapToChange(lastCommit, m))
	})
	return result
}

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

function parseCommitMsgsSquashed (commit) {
	return commit.body
				 .split('\n')
				 .filter((block) => block.startsWith('* '))
				 .map((block) => block.replace('* ', ''))
}

const getChangesSinceCommitSha = (commitSha) => {
	let commits = child
		.execSync(
			`git log ${commitSha}..HEAD --no-merges --pretty=format:"${prettyFormat.join(
				splitText
			)}"`
		)
		.toString('utf-8')
		.split(`${splitText}\n`)
		.map((commitInfoText) => getCommitInfo(commitInfoText))

	if (commits.length === 1 && commits[0].shortHash === '') {
		return []
	}

	let changes = []
	commits.forEach(x => {
		if (x.body !== '') {
			const commitMsgsSquashed = parseCommitMsgsSquashed(x)
			commitMsgsSquashed.forEach(m => changes.push(mapToChange(x, m)))
		} else {
			changes.push(mapToChange(x, x.subject))
		}
	})

	return changes
}

function commitAndTag(commitMsg, tagMsg, tag) {
  child.execSync(`git commit -m "${commitMsg}"`)
  if (tag) {
    child.execSync(`git tag -a -m "${tagMsg}" ${tag}`)
  }
  child.execSync(`git push --follow-tags`)
}

function addFile(file) {
  child.execSync(`git add ${file}`)
}

function mapToChange (commit, message) {
	return {
		commit: commit,
		message: message
	}
}

module.exports = {
  getChangesSinceCommitSha,
  getChangesFromLastCommit,
  commitAndTag,
  addFile,
  getFilesModifiedInACommit
};
