# User Case: You want to test the javascript this repo is base

# Requirements

* Have WSL Install -> https://docs.microsoft.com/en-us/windows/wsl/install
* Install Ubuntu -> https://ubuntu.com/tutorials/install-ubuntu-on-wsl2-on-windows-10#1-overview

# Code 

```bash
CUSTOM_CC_FILE="custom-conventional-commits-accepted.json";
node validate-custom-cc-types.js $CUSTOM_CC_FILE ;
```

```bash
GITHUB_BASE_REF="main";
GITHUB_HEAD_REF="LANZ-2249";
CC_FILE="custom-conventional-commits-accepted.json";
export DEFAULT_CC="default-conventional-commits-accepted.json";
node generate-version-and-release-notes.js $GITHUB_BASE_REF $GITHUB_HEAD_REF $CC_FILE;
```