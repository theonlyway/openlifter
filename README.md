# OpenLifter

> Simple software for running a local powerlifting competition.

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
