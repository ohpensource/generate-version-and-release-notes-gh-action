# :confetti_ball: 2.2.1 (2022-11-14T08:10:21.449Z)
- - -
## :bug: Fixes
* fix: [SPT-456](https://ohpen.atlassian.net/browse/SPT-456) - fix problem with commits which not contains squash formatted commit message
## :newspaper: Others
* docs: [SPT-456](https://ohpen.atlassian.net/browse/SPT-456) - information about "base-commit-sha" option which disabled squash pull_request merging
- - -
- - -
# :confetti_ball: 2.2.0 (2022-11-08T09:18:22.042Z)
- - -
## :hammer: Features
* feat: [SPT-456](https://ohpen.atlassian.net/browse/SPT-456) - allow define "base-commit-sha" for repositories which not use squash commits
## :bug: Fixes
* fix: [SPT-456](https://ohpen.atlassian.net/browse/SPT-456) - fix name of baseCommitSha local variable
* fix: [SPT-456](https://ohpen.atlassian.net/browse/SPT-456) - added log message if generate changes from commit SHA
## :newspaper: Others
* build: [SPT-456](https://ohpen.atlassian.net/browse/SPT-456) update GIT ignore
* docs: [SPT-456](https://ohpen.atlassian.net/browse/SPT-456) - describe new "base-commit-sha" input parameter
- - -
- - -
# :confetti_ball: 2.1.1 (2022-10-27T10:33:21.071Z)
- - -
## :bug: Fixes
* fix: [LANZ-3338](https://ohpen.atlassian.net/browse/LANZ-3338) updated how outputs are been set. now they are stored in GITHUB_OUTPUT (#30)
- - -
- - -
# :confetti_ball: 2.1.0 (2022-09-29T13:11:48.393Z)
- - -
## :hammer: Features
* feat: [SPT-440](https://ohpen.atlassian.net/browse/SPT-440) - Add scopesDiscovery parameter (#29)
- - -
- - -
# :confetti_ball: 2.0.0 (2022-09-06T12:01:27.736Z)
- - -
## :boom: BREAKING CHANGES
* break: [LANZ-2959](https://ohpen.atlassian.net/browse/LANZ-2959) set commit reading behavior to initial approach: parse the commit messages from the last commit merged. This one must be a squash (#27)
- - -
- - -
# :confetti_ball: 1.2.1 (2022-08-30T10:30:52.641Z)
- - -
## :newspaper: Others
* docs: [LANZ-3112](https://ohpen.atlassian.net/browse/LANZ-3112) updated readme with valid scopes format (#28)
- - -
- - -
# :confetti_ball: 1.2.0 (2022-08-17T13:45:31.370Z)
- - -
## :hammer: Features
* feat: [LANZ-3056](https://ohpen.atlassian.net/browse/LANZ-3056) updated workflow to create version.json per scope - approach 1 (#26)
- - -
- - -
# :confetti_ball: 1.1.4 (2022-08-10T10:33:53.386Z)
- - -
## :bug: Fixes
* fix: [LANZ-3045](https://ohpen.atlassian.net/browse/LANZ-3045) fixed error in the default values for conventional commit releases (#24)
- - -
- - -
# :confetti_ball: 1.1.3 (2022-08-01T06:56:25.826Z)
- - -
## :bug: Fixes
* fix: [LANZ-3003](https://ohpen.atlassian.net/browse/LANZ-3003) fixed error when there is not tag defined (#23)
- - -
- - -
# :confetti_ball: 1.1.2 (2022-07-05T10:34:30.571Z)
- - -
## :newspaper: Others
* docs: [LANZ-2795](https://ohpen.atlassian.net/browse/LANZ-2795) updated readme. Deleted not needed parameter mention in the example (#20)
- - -
- - -
# :confetti_ball: 1.1.1 (2022-07-05T10:12:16.274Z)
- - -
## :newspaper: Others
* docs: [LANZ-2795](https://ohpen.atlassian.net/browse/LANZ-2795) updated readme to explain how to combine this with tf-docs (#19)
- - -
- - -
# :confetti_ball: 1.1.0 (2022-07-05T09:32:27.105Z)
- - -
## :hammer: Features
* feat: [LANZ-2795](https://ohpen.atlassian.net/browse/LANZ-2795) updated commits provider. Now it will get all the commits since the last tag, this means the user is not required to merge commits as squash
## :newspaper: Others
* docs: [LANZ-2795](https://ohpen.atlassian.net/browse/LANZ-2795) updated readme and deleted not needed docs
- - -
- - -
# :confetti_ball: 1.0.2 (2022-06-13T14:49:10.875Z)
- - -
## :newspaper: Others
* docs: [LANZ-2679](https://ohpen.atlassian.net/browse/LANZ-2679) fixed wrong parameter name in the example (#16)
- - -
- - -
# :confetti_ball: 1.0.1 (2022-06-10T10:32:56.423Z)
- - -
## :bug: Fixes
* fix: [LANZ-2679](https://ohpen.atlassian.net/browse/LANZ-2679) removed unnecessary pulling and logging
* fix: [LANZ-2679](https://ohpen.atlassian.net/browse/LANZ-2679) updated cd.yml to use cicd/settings-file to validate commits
- - -
- - -
# :confetti_ball: 1.0.0 (2022-06-10T10:25:57.061Z)
- - -
## :boom: BREAKING CHANGES
* break: [LANZ-2679](https://ohpen.atlassian.net/browse/LANZ-2679) change input json file structure for supporting scopes. refactor of all the gh action. add scopes support. (#14)
- - -
- - -
# :confetti_ball: 0.4.0 (2022-05-23T08:17:45.957Z)
- - -
## :hammer: Features
* [LANZ-2394](https://ohpen.atlassian.net/browse/LANZ-2394) include markdown ticket link in readme
## :newspaper: Others
* refactor: [LANZ-2394](https://ohpen.atlassian.net/browse/LANZ-2394) aggregate changelog changes by semver type of change
* docs: [LANZ-2394](https://ohpen.atlassian.net/browse/LANZ-2394) include new feature documentation
- - -
- - -
# :confetti_ball: 0.3.3 (2022-05-11T09:45:51.291Z)
- - -
## :newspaper: Others
* Delete .github/CODEOWNERS
- - -
- - -
# :confetti_ball: 0.3.2 (2022-04-21T08:31:21.106Z)
- - -
## :bug: Fixes
* LANZ-2306 provide default value for version-prefix input (#11)
- - -
- - -
# :confetti_ball: 0.3.1 (2022-04-14T08:51:17.636Z)
- - -
## :newspaper: Others
* fix:LANZ-2286 fix error when no custom conventional commit provided (#10)
- - -
- - -
# :confetti_ball: 0.3.0 (2022-04-12T12:54:19.092Z)
- - -
## :hammer: Features
* (js): LANZ-2248 improved workflow to support breaking change exclamation (#6)
- - -
- - -
# :confetti_ball: 0.2.1 (2022-04-12T10:39:37.987Z)
- - -
## :bug: Fixes
* LANZ-2264 updated docs and small change in validate-custom-cc-types to align with ensure-commits-gh-action (#7)
- - -
- - -
# :confetti_ball: 0.2.0 (2022-04-12T10:02:37.794Z)
- - -
## :hammer: Features
* LANZ-2249 improved gh action to accept custom conventional commits from a file (#4)
- - -
- - -
# :confetti_ball: 0.1.0 (2022-04-08T13:07:59.816Z)
- - -
## :hammer: Features
* LANZ-2251 Added basic cicd gh action for PRs and release (#3)
- - -
- - -
