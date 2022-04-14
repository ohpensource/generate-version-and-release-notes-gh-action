# User Case: Repo with multiple apps 

Let's say you have two apps in the repo as next:
* app-one/
* app-two/

The main structure for a GH Action is:
1. List the app changed
2. Execute the `ohpensource/generate-version-and-release-notes-gh-action@main`

## 1. List the app changed

The next job will list the apps that have changed in the output parameter `apps-changed-array`. The parameter `steps.list-changes.outputs.changes` contains the list of app changed based on the filters in the step `id: list-changes`. In this case its valeu is `[app-one,app-two]`. In order to format that to json we append it to a json file and format it using the `sed` command. 

```yml
jobs:
  ##### CONTINUOUS DELIVERY #####
  get-changes-per-app:
    runs-on: ubuntu-latest
    outputs:
      apps-changed-array: ${{ steps.build-apps-changed-array.outputs.array }}
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
          token: ${{ secrets.CICD_GITHUB_REPOSITORY_TOKEN }}
      - uses: dorny/paths-filter@v2
        name: get projects changed
        id: list-changes
        with:
          list-files: shell
          filters: |
            app-one:
              - 'app-one/**'
            app-two:
              - 'app-two/**'
      - name: Build Matrix for next actions
        id: build-apps-changed-array
        run: |
          touch apps-changed.json
          echo ${{ steps.list-changes.outputs.changes }} >> apps-changed.json
          
          sed -i 's/\[/\[\"/' apps-changed.json
          sed  -i  -e 's/,/\",\"/g' apps-changed.json
          sed -i 's/\]/\"\]/' apps-changed.json

          cat apps-changed.json
          cat apps-changed.json | jq
          echo "::set-output name=array::$(cat apps-changed.json)"
```
> In the step `id: list-changes` provide all your apps following the pattern: `app-folder  -'app-folder/**'`: 

## 2. Execute the `ohpensource/generate-version-and-release-notes-gh-action@main`

In order to execute the same job `semver-changelog` but with different apps, we define a matrix that iterates over the array of apps listed before. `app-changed: ${{ fromJSON( needs.get-changes-per-app.outputs.apps-changed-array ) }}`, app-changed is the iterator.

We use the `app-changed` in the next attributes:
* `version-prefix: "${{ matrix.app-changed }}-"` -> tag the release as `{APP-NAME}-{RELEASE-NUMBER}`, `app-one-0.0.1`
* `app-dir: ${{ matrix.app-changed }}` -> to create the version.json and changelog in the app folder

> It is important to have a different version-prefix on every app to avoid tagging overlap. We achieve that by setting the app name as part of the version-prefix.

# WARNING USING PARALLEL JOBS

> KNOW BUG: we can NOT call the `semver-changelog`  in parallel for all the apps because of conflicts when executing `git push`. That is why we have to set `max-parallel: 1` so it updates the version on one app, push the changes, proceed to the next app, and so on. 

```yml
jobs:
########### SKIPPED PREVIOUS JOB: get-changes-per-app
  semver-changelog:
    needs: [get-changes-per-app]
    if: needs.get-changes-per-app.outputs.apps-changed-array != '[]'
    strategy:
      matrix:
        app-changed: ${{ fromJSON( needs.get-changes-per-app.outputs.apps-changed-array ) }}
      max-parallel: 1
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
          token: ${{ secrets.CICD_GITHUB_REPOSITORY_TOKEN }}
      - uses: ohpensource/generate-version-and-release-notes-gh-action@LANZ-2258
        name: semver & changelog ${{ matrix.app-changed }}
        with:
          user-email: "github-actions@github.com"
          user-name: "github-actions"
          version-prefix: "${{ matrix.app-changed }}-"
          app-dir: ${{ matrix.app-changed }}
          custom-conventional-commits-file: custom-conventional-commits-accepted.json
```


# Full Example

```yml
name: continuous-delivery

on:
  push:
    branches: [main]

jobs:
  ##### CONTINUOUS DELIVERY #####
  get-changes-per-app:
    runs-on: ubuntu-latest
    outputs:
      apps-changed-array: ${{ steps.build-apps-changed-array.outputs.array }}
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
          token: ${{ secrets.CICD_GITHUB_REPOSITORY_TOKEN }}
      - uses: dorny/paths-filter@v2
        name: get projects changed
        id: list-changes
        with:
          list-files: shell
          filters: |
            app-one:
              - 'app-one/**'
            app-two:
              - 'app-two/**'
            app-three:
              - 'app-three/**'
            app-four:
              - 'app-four/**'
      - name: Build Matrix for next actions
        id: build-apps-changed-array
        run: |
          touch apps-changed.json
          echo ${{ steps.list-changes.outputs.changes }} >> apps-changed.json
          
          sed -i 's/\[/\[\"/' apps-changed.json
          sed  -i  -e 's/,/\",\"/g' apps-changed.json
          sed -i 's/\]/\"\]/' apps-changed.json

          cat apps-changed.json
          cat apps-changed.json | jq
          echo "::set-output name=array::$(cat apps-changed.json)"
  semver-changelog:
    needs: [get-changes-per-app]
    if: needs.get-changes-per-app.outputs.apps-changed-array != '[]'
    strategy:
      matrix:
        app-changed: ${{ fromJSON( needs.get-changes-per-app.outputs.apps-changed-array ) }}
      max-parallel: 1
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
          token: ${{ secrets.CICD_GITHUB_REPOSITORY_TOKEN }}
      - uses: ohpensource/generate-version-and-release-notes-gh-action@LANZ-2258
        name: semver & changelog ${{ matrix.app-changed }}
        with:
          user-email: "github-actions@github.com"
          user-name: "github-actions"
          version-prefix: "${{ matrix.app-changed }}-"
          app-dir: ${{ matrix.app-changed }}
          custom-conventional-commits-file: custom-conventional-commits-accepted.json
```