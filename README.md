# OpenLifter

> Simple software for running a local powerlifting competition.

#### Software Stack

OpenLifter is a single-page webapp built with React, Redux, and Bootstrap. Help is welcome!

#### Development Setup

This project was initialized through `create-react-app`. There is a bunch of implicit project-wide build magic that `create-react-app` manages through dependent scripts. The magic behavior is described in the [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started).

```bash
# Opens an Electron app with hot reload.
make dev-electron

# Opens a browser with hot reload at localhost:3000.
make dev-web

# Runs unit tests.
make test
```

#### Build Setup

```bash
# Packages a release into `dist/`.
make
```

#### Translations

To translate text in a component, you will need to import `FormattedMessage` from `react-intl`, and use the component like this:

```
<FormattedMessage id="uniqueId" defaultMessage="English Text" />
```

After defining any number of these components, run `yarn extract:messages`
This command will go through all of the `*.js` files in `src/` and look for `FormattedMessage`.
If found, it will extract the message into `messages.json`

Then, run `yarn manage:translations`.  This script will (if needed) create a json file for each language that is configured, e.g. `es.json`

In each of the language specific json files will be all of the messages from `messages.json`, with the defaultMessage if they were not previously translated.  Find your message id and add the appropriate translation to these language specific files.
