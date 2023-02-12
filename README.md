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

## Streaming

The main reason for this fork is to enable a way to export the Openlifter data so other services can consume it, mainly for streaming purposes. Given streaming is a optional acticity for events if it is disabled by default and if it is needed you will need to enable it by doing the following

### API

The main way Openlifter exports it's data is it sends it to a middleware API. You can view a copy of the API spec [here](Openlifter-openapi.yaml). A local copy of the API can be hosted locally on your machine as long as you have [Docker](https://www.docker.com/products/docker-desktop/) installed. Once docker is installed you can launch a copy of the API by doing the following:

* Change directories to the [docker](./docker/) folder
* Run `docker compose up -d`

This will do the following:

* Setup a local MongoDB container for the API to connect to
  * The mongodb container has persistent storage so the data will persist between restarts
  * You can also connect to the mongodb locally if you download something like [MongoDB Compass](https://www.mongodb.com/try/download/compass) and use the credentials defined in the [docker-compose.yml](./docker/docker-compose.yml)
* Build a docker container for the API located [here](./api/)

I will note that this method is designed to run the componnets locally. However, given this repo contains the source code of the API along with the OpenAPI spec you can in theory host the API wherever you want if it is a requirement.

### Openlifter

Be sure to do the steps before this to enable the API

* Navigate to the streaming section in the nagivation bar at the top
* Enable streaming
* Enter a URL that points to the API endpoint
  * This can be the API endpoint hosted locally or externally to the openlifter service
  * If authentication is required to access the API endpoint input the API key
    * If you are using the defaults of this implementation you won't have to change any of the settings from it's defaults
* Hit test connection to see if the connection is working

### Lifting lights

There is some baseline intergration built in to use the lifting lights solution provided by https://lights.barbelltracker.com/. This integration doesn't write any of the light data back in to Openlifter, it just exports the code to the API so when the overlay in OBS queries the API it is querying the correct lights for the the `Meet`

You can enable it by doing the following:

* Navigate to: https://lights.barbelltracker.com/
* Click `let's go`
* Copy the code at the end of the URL after the `#`
  * Example:
    * If the URL is this https://lights.barbelltracker.com/index.html#i1vE
    * Copy `i1vE`
* Now back in Openlifter in the streaming section assuming it's enabled, enable the lights and paste in the code you copied in the previous step


### Streaming overlays

This was designed to work with [OBS (Open Broadcaster Software)](https://obsproject.com/)
