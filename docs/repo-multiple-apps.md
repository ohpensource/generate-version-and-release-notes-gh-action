# User Case: Repo with multiple apps 

Let's say you have the two apps:
* app-one
* app-two

Each one is in a separate folder in the repo as;
* app-one/
* app-two/

First of all, we will define a job for each app:

```yml
jobs:
  ##### CONTINUOUS DELIVERY #####
  semver-changelog-app-one:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
          token: ${{ secrets.CICD_GITHUB_REPOSITORY_TOKEN }}
  semver-changelog-app-two:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
          token: ${{ secrets.CICD_GITHUB_REPOSITORY_TOKEN }}
```

In each job, in order to detect what app have been modified we will use the gh action `dorny/paths-filter@v2` as next:
```yml
- uses: dorny/paths-filter@v2
name: get projects changed
id: changes
with:
    list-files: json
    filters: |
    app-two:
        - 'app-two/**'
```

> Please update the pattern `app-name: - app-folder/**` for each job.

Then, we will call the `generate-version-and-release-notes-gh-action` providing the next parameters:

* version-prefix: `{APP-NAME}-`. As an example, `app-one` -> this will generate tags as `app-one-0.0.1`
* app-dir: folder where the app is stored
* add a `if` to verify the app has change

> Please provide a custom `version-prefix` on each instance, otherwise, the tags may overwrite.

```yml
- uses: ohpensource/generate-version-and-release-notes-gh-action@main
if: steps.changes.outputs.app-one == 'true'
name: semver & changelog app-one
with:
    user-email: "github-actions@github.com"
    user-name: "github-actions"
    version-prefix: "app-one"
    app-dir: app-one
    custom-conventional-commits-file: custom-conventional-commits-accepted.json
```

# Full Example

```yml
name: continuous-delivery

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
          token: ${{ secrets.CICD_GITHUB_REPOSITORY_TOKEN }}
      - uses: dorny/paths-filter@v2
        name: get projects changed
        id: changes
        with:
          list-files: json
          filters: |
            app-two:
              - 'app-two/**'
            app-one:
              - 'app-one/**'
            any:
              - '**'
      - uses: ohpensource/generate-version-and-release-notes-gh-action@main
        if: steps.changes.outputs.app-one == 'true'
        name: semver & changelog app-one
        with:
          user-email: "github-actions@github.com"
          user-name: "github-actions"
          version-prefix: "app-one-"
          app-dir: app-one
          custom-conventional-commits-file: custom-conventional-commits-accepted.json
      - uses: ohpensource/generate-version-and-release-notes-gh-action@main
        if: steps.changes.outputs.app-two == 'true'
        name: semver & changelog app-two
        with:
          user-email: "github-actions@github.com"
          user-name: "github-actions"
          version-prefix: "app-two-"
          app-dir: app-two
          custom-conventional-commits-file: custom-conventional-commits-accepted.json
```