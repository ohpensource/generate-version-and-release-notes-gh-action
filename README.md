- [generate-version-and-release-notes-gh-action](#generate-version-and-release-notes-gh-action)
  - [Requirements](#requirements)
  - [How to use](#how-to-use)
    - [](#)
- [License Summary](#license-summary)

# generate-version-and-release-notes-gh-action

## Requirements

:warning: Attention! You need to merge your pull requests using the "squash" option. 

![settings](docs/how_to_merge_prs.png)

You have to update your repo to only allow that `squash and merge`:

![settings](docs/gh_repo_merge_settings.png)

## How to use
This repository includes an action to semantically version your repository once a merge happens to the main branch. This is an example on how to use the action in your own repository:

```yaml
name: CD
on:
  push:
    branches: [main]
jobs:
  semver-changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
          token: ${{ secrets.CHECKOUT_WITH_A_SECRET_IF_NEEDED }}
      - uses: ohpensource/generate-version-and-release-notes-gh-action@main
        name: semver & changelog
        with:
          user-email: "user@email.com"
          skip-commit: "true"  This is for testing so you don't polute your git history. Default value is false.
          version-prefix: "v"  useful for repos that terraform modules where the versions are like "v0.2.4".
      - id: semver
        run: echo "::set-output name=service-version::$(cat ./version.json | jq -r '.version')"
    outputs:
      service-version: ${{ steps.semver.outputs.service-version }}
```

The action will:

- Analyse the commits from the pull request that has been merged to main branch and extract the necessary information.
- Summarize all the pull request changes into you CHANGELOG.md file.
- Deduce the new version from those commits (your commits must follow conventional-commits! Check out the _check-conventional-commits_ action).
- Commit, tag and push changes in version.json and CHANGELOG.md (you can skip this part by setting parameter _skip-git-commit_ to true, for example when you want to change more files and push changes in one commit by yourself)
- You can also set up name to sign the commit with parameter: _user-name_. Default value is _GitHub Actions_
- The action will, by default, use MAJOR.MINOR.PATCH semantics to generate version number, if you want to use MAJOR.MINOR.PATCH.SECONDARY versioning, the version.json file in the root of your project have to contain 4 numbers separated by dot. For new applications it can look like this:

```json
{
  "version": "0.0.0.0"
}
```

- There are 2 optional parameters in this action:

> **skip-commit**: use it with value "true" if you want to prevent the action from commiting.
> **version-prefix**: use with a value different than an empty string ("beta-" or "v" for example) to have tags in the form of '{version-prefix}M.m.p'

### Commits that increase the version:

The next commit types (prefixes) define the release type (major, minor, patch) when a PR is merged:

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
        "releaseType": "patch"
    }
]
```
examples:

* break: LANZ-123 updated API desing-> create a major release (**X+1**.y.z)
* feat: LANZ-123 created new feature -> create a minor release (x.**Y+1**.z)
* fix: LANZ-123 fixed bug keeping compatibility-> create a patch release (x.y.**Z+1**)

### Remarks about your versioning!

* If your version.json file has a 3 number version (`major.minor.patch`), others prefixes won't create a release
* If your has a 4 number version (`major.minor.patch.extra`), others prefixes will increase the `extra` digit.

### You want to use custom conventional commits?

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
example fie: [custom-conventional-commits-accepted.json](custom-conventional-commits-accepted.json)


# License Summary

This code is made available under the MIT license. Details [here](LICENSE).
