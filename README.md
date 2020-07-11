# Timetrackr

*The name was actually just a typo.*

---

## Setup

Install and run MongoDB:

```sh
$ brew tap mongodb/brew
$ brew install mongodb-community
$ mongod --config /usr/local/etc/mongod.conf
```

Install NPM dependencies:

```sh
$ npm install
```

## Development environment

These are recommended:

* VS Code
* [Jest Runner](https://github.com/jest-community/vscode-jest) VS Code plugin
* [vscode-lit-html](https://github.com/mjbvz/vscode-lit-html) VS Code plugin

## Run app

```sh
$ npm start
$ open http://localhost:8080/
```

## Upcoming features

To start with, we're focusing on an MVP with minimal features needed to get the job done. As the user-base increases, we'll add the following features:

- Pagination on all the pages
- Electron client (status-bar for Mac, taskbar for Windows)
- Change email & password
- Email verification for new accounts
