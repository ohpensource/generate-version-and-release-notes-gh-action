function calculateNextVersion(version, changes) {
    const alwaysIncreaseVersion = process.env.ALWAYS_INCREASE_VERSION === 'true'

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
    if (changes.some((change) => change === "major")) {
        newMajor = major + 1;
        newMinor = 0;
        newPatch = 0;
        newSecondary = 0;
    } else if (changes.some((change) => change === "minor")) {
        newMajor = major;
        newMinor = minor + 1;
        newPatch = 0;
        newSecondary = 0;
    } else if (alwaysIncreaseVersion || changes.some((change) => change === 'patch')) {
        if (versionFileContent.length === 3) {
            newMajor = major
            newMinor = minor
            newPatch = patch + 1
        } else {
            newMajor = major
            newMinor = minor
            newPatch = patch
            newSecondary = secondary + 1
        }
    } else {
        return version;
    }

    if (versionFileContent.length === 3) {
        return `${newMajor}.${newMinor}.${newPatch}`;
    } else {
        return `${newMajor}.${newMinor}.${newPatch}.${newSecondary}`;
    }
}

module.exports = {
    calculateNextVersion
};
