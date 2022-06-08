const DEFAULT_CONVENTIONAL_COMMITS = {
    "break": {
        "release": "major"
    },
    "feat": {
        "release": "minor"
    },
    "fix": {
        "release": "fix"
    },
    "build": {
        "release": "none"
    },
    "chore": {
        "release": "none"
    },
    "ci": {
        "release": "none"
    },
    "docs": {
        "release": "none"
    },
    "style": {
        "release": "none"
    },
    "refactor": {
        "release": "none"
    },
    "perf": {
        "release": "none"
    },
    "test": {
        "release": "none"
    }
}

const REGEX_CONVENTIONAL_COMMIT_FORMAT = /(?<type>^[a-z\d]+)\(?(?<scopes>[a-z\d,\-]+)?\)?(?<breaking>!)?(?<colon>:{1})(?<space> {1})(?<body>.*)/

const SEMVER_SETTINGS = {
    CHANGES: {
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
    CHANGELOG: {
        FILE_NAME: "CHANGELOG.md"
    },
    VERSION: {
        FILE_NAME: "version.json"
    }

}

module.exports = {
    DEFAULT_CONVENTIONAL_COMMITS,
    REGEX_CONVENTIONAL_COMMIT_FORMAT
};

