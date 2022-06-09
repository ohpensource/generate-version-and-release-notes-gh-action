const fs = require('fs');

const REGEX_DETECT_TICKET = /[a-zA-Z]{2,10}-\d+/g
const RELEASE_VS_CHANGELOG_HEADER = {
    major: {
        changelogHeader: "## :boom: BREAKING CHANGES\n",
    },
    minor: {
        changelogHeader: "## :hammer: Features\n",
    },
    patch: {
        changelogHeader: "## :bug: Fixes\n",
    },
    none: {
        changelogHeader: "## :newspaper: Others\n",
    },
},

    updateChangelog = (changelogPath, newVersion, commits) => {

        let newContent = `# :confetti_ball: ${newVersion} (${new Date().toISOString()})\n`;
        newContent += "- - -\n";
        const settingsReleaseType = Object.keys(RELEASE_VS_CHANGELOG_HEADER)
        settingsReleaseType.forEach(releaseType => {
            const header = RELEASE_VS_CHANGELOG_HEADER[releaseType].changelogHeader
            const changes = commits
                .filter(x => x.release === releaseType)
                .map(x => {
                    let result = x.body
                    if (x.type) {
                        result = `${x.type}: ${x.body}`
                    }
                    return result
                })
            newContent = appendChanges(newContent, header, changes)
        });

        newContent += "- - -\n";
        newContent += "- - -\n";
        console.log(newContent);

        let previousContent = "";
        try {
            previousContent = fs.readFileSync(changelogPath, "utf-8");
        } catch (error) {
            previousContent = "";
        }
        fs.writeFileSync(changelogPath, `${newContent}${previousContent}`);
    }

appendChanges = (changelog, title, changeContents) => {
    if (changeContents.length > 0) {
        changelog += title
        changeContents.forEach(x => {
            changelog += `* ${addJIRATicketLink(x)}\n`
        })
    }
    return changelog
}

addJIRATicketLink = (message) => {

    const matchResult = message.match(REGEX_DETECT_TICKET)
    if (matchResult) {
        matchResult.forEach(ticket => {
            const markdownLink = `[${ticket}](https://ohpen.atlassian.net/browse/${ticket})`
            message = message.replace(ticket, markdownLink)
        })
    }
    return message
}

module.exports = {
    updateChangelog
};
