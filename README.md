# OpenLifter
> Simple software for running a local powerlifting competition.
## Notice
This is a fork of the original located here: https://gitlab.com/openpowerlifting/openlifter the main aim of this fork is to implement some streaming functionality hosted by default locally. The code used to host the API locally can be hosted externally on dedicated infrastructure if required

## Development Chat

Project development is discussed in the [OpenPowerlifting Zulip Chat](https://openpl.zulipchat.com/), in the channel `#coding/openlifter`. Everyone is welcome to join.

## Software Stack

OpenLifter is a single-page webapp built with TypeScript, React, Redux, and Bootstrap. Help is welcome!

## Development Setup

### Fedora 31

Install Yarn from the Yarn RPM package repository:

```bash
curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
sudo dnf install yarn make
```

Build and launch the development server in-browser:

```bash
make
```

### General

This project was initialized through `create-react-app`. There is a bunch of implicit project-wide build magic that `create-react-app` manages through dependent scripts. The magic behavior is described in the [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started).

First, you need to install yarn. You can find the installation steps here https://yarnpkg.com/en/.

Second, navigate to your local project's root directory and run the `yarn install` command. The command installs all packages specified in the package.json file.

Once the command finishes then you can run the make commands below:

```bash
# Opens a development browser with hot reload at localhost:3000.
make

# Opens a development Electron app with hot reload.
make electron

# Runs unit tests.
make check
```

## Translations

Translations are handled using `react-intl`. They work by using `FormattedMessage`:

```
<FormattedMessage id="uniqueId" defaultMessage="English Text" />
```

Running `yarn manage:translations` will read through the codebase for uses of `FormattedMessage` and extract translatable entries into JSON in `src/translations/`.

## Release instructions

Preparing an official release involves a few temporary modifications.

Official builds are permanently stored at https://www.openlifter.com/releases/ in a subdirectory with the same name as the version number. In the examples below, the version being released is `x.y`.

1. Edit `package.json` to set the `version`, `homepage`, and `router_basename` variables. These are used by the `.env` file to create JS environment variables. In our example, set `"version": "x.y"`, `"homepage": "https://www.openlifter.com/releases/x.y/"`, and `"router_basename": "/releases/x.y/"`.
2. Edit `src/versions.js` to fix the `releaseDate` using ISO-8601 notation (YYYY-MM-DD). Hopefully in the future we can just automate this, but I couldn't think of a platform-independent way at this hour.
3. Run `make release-web`. This will build into `public/`, but mess up the state of the repo.
4. Move the `public/` folder into `releases/` for permanent archival, using the version. For example, `mv public releases/x.y`.
5. Fully reset the repo: `make clean && rm -rf public && git reset --hard HEAD`
6. `git add releases/x.y && git commit`
7. Done! Now you can build `website/` and it should include that release. You'll probably have to update the website text and include the changelog on the releases/ page.
