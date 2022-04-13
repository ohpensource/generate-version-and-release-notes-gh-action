# User Case: Provide Custom Conventional Commits

Follow the next steps to define more conventional commits:

1. Create a json file providing the custom commit type and the release associated (`major,minor,patch`) as next:

```json
[
    {
        "commitType": "break",
        "releaseType": "major"
    },
    {
        "commitType": "feat",
        "releaseType": "minor"
    },
    {
        "commitType": "fix",
        "releaseType": "minor"
    },
    {
        "commitType": "refactor",
        "releaseType": "minor"
    },
    {
        "commitType": "docs",
        "releaseType": "minor"
    }
]
```

2. Provide its path in the parameter `custom-conventional-commits-file`

```yaml
      - uses: ohpensource/generate-version-and-release-notes-gh-action@main
        name: semver & changelog
        with:
          user-email: "user@email.com"
          skip-commit: "true"  This is for testing so you don't polute your git history. Default value is false.
          version-prefix: "v"  useful for repos that terraform modules where the versions are like "v0.2.4".
          custom-conventional-commits-file: custom-conventional-commits.json
```
example fie: [custom-conventional-commits-accepted.json](../custom-conventional-commits-accepted.json)