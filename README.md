# vscode-dbsnapper

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/dbsnapper.vscode-dbsnapper)
[![Static Badge](https://img.shields.io/badge/DBSnapper-Documentation-blue)](https://docs.dbsnapper.com)

The `vscode-dbsnapper` extension is a Visual Studio Code extension that complements the [DBSnapper platform ](https://dbsnapper.com) and allows for an in-editor experience to load database snapshots.

## Features

- List targets and snapshots
- Load snapshots into a destination database

## Requirements

[![Static Badge](https://img.shields.io/badge/DBSnapper_Cloud-Sign_Up-blue)](https://app.dbsnapper.com/sign_up)
[![GitHub Release](https://img.shields.io/github/v/release/dbsnapper/dbsnapper?label=DBSnapper%20Agent)](https://github.com/dbsnapper/dbsnapper/releases)

- A DBSnapper account - [Sign Up Here](https://app.dbsnapper.com/sign_up)
- The [DBSnapper Agent](https://gitnub.com/dbsnapper/dbsnapper/releases) installed on your machine. This is used to load snapshots into your database.

## Extension Settings

Click on the dbsnapper quick pick in the status bar to open the extension settings. You will need to provide the following values:

- `DBSnapper AuthToken` - available from the Get Started page in the DBSnapper platform.
- `Default Destination Database URL` - Provide a default destination database URL to use when loading snapshots. Note: This destination URL will be **overwritten without warning** when loading a snapshot.

## Release Notes

### 1.0.0

Initial release with the ability to list `targets` and `snapshots`, and `load` snapshots into a destination database.

---
