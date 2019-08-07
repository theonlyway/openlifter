# OpenLifter

> Simple software for running a local powerlifting competition.

## Software Stack

OpenLifter is a single-page webapp built with TypeScript, React, Redux, and Bootstrap. Help is welcome!

## Development Setup

### Fedora 30

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
# Opens an Electron app with hot reload.
make dev-electron

# Opens a browser with hot reload at localhost:3000.
make dev-web

# Runs unit tests.
make test
```

## Build Setup

```bash
# Packages a release into `dist/`.
make package
```

## Theming Bootstrap

This project uses `react-bootstrap` which is stuck on an old version of Bootstrap, 3.2. Custom theming of Bootstrap requires the use of `less`, which is unsupported by `create-react-app`.

To get around this, Bootstrap theming is done in `src/bootstrap-custom/bootstrap.less`; a separate compile step creates `build/bootstrap-custom.css`, which is then imported by `src/index.js`.

To build the Bootstrap CSS file manually, run `make less`.

## Translations

To translate text in a component, you will need to import `FormattedMessage` from `react-intl`, and use the component like this:

```
<FormattedMessage id="uniqueId" defaultMessage="English Text" />
```

After defining any number of these components, run `yarn extract:messages`
This command will go through all of the `*.js` files in `src/` and look for `FormattedMessage`.
If found, it will extract the message into `messages.json`

Then, run `yarn manage:translations`.  This script will (if needed) create a json file for each language that is configured, e.g. `es.json`

In each of the language specific json files will be all of the messages from `messages.json`, with the defaultMessage if they were not previously translated.  Find your message id and add the appropriate translation to these language specific files.

## Release instructions

Preparing an official release involves a few temporary modifications.

Official builds are permanently stored at https://www.openlifter.com/releases/ in a subdirectory with the same name as the version number. In the examples below, the version being released is `x.y`.

1. Tag the release in git.
2. Edit `package.json` to set the `version`, `homepage`, and `router_basename` variables. These are used by the `.env` file to create JS environment variables. In our example, set `"version": "x.y"`, `"homepage": "https://www.openlifter.com/releases/x.y/"`, and `"router_basename": "/releases/x.y/"`.
3. Edit `src/versions.js` to fix the `releaseDate` using ISO-8601 notation (YYYY-MM-DD). Hopefully in the future we can just automate this, but I couldn't think of a platform-independent way at this hour.
4. Run `make release`. This will build into `public/`, but mess up the state of the repo.
5. Move the `public/` folder into `releases/` for permanent archival, using the version. For example, `mv public releases/x.y`.
6. Fully reset the repo: `make clean && rm -rf public &&  git reset --hard HEAD`
7. `git add releases/x.y && git commit`
8. Done! Now you can build `website/` and it should include that release. You'll probably have to update the website text and include the changelog on the releases/ page.
