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
