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

A hosted version of this fork can be accessed [here](https://openlifter.theonlywaye.com/)

The main reason for this fork is to enable a way to export the Openlifter data so other services can consume it, mainly for streaming purposes (I did take the liberty of updating most of the packages and fixing up some of the CSS issues resulting from that so it may look slightly different to the original). Given streaming is a optional activity for events if it is disabled by default and if it is needed you will need to enable it by doing the following

### API

The main way Openlifter exports it's data is it sends it to a middleware API (Since Openlifter is a client side app things don't have access to the browser memory where the data is stored). You can view a copy of the API spec [here](Openlifter-openapi.yaml). A local copy of the API can be hosted locally on your machine as long as you have [Docker](https://www.docker.com/products/docker-desktop/) installed. Once docker is installed you can launch a copy of the API by doing the following:

* Change directories to the [docker](./docker/) folder
* Run `docker compose up -d`

This will do the following:

* Setup a local MongoDB container for the API to connect to
  * The mongodb container has persistent storage so the data will persist between restarts
  * You can also connect to the mongodb locally if you download something like [MongoDB Compass](https://www.mongodb.com/try/download/compass) and use the credentials defined in the [docker-compose.yml](./docker/docker-compose.yml)
* Build a docker container for the API located [here](./api/)

To turn off the API you can run `docker compose down` from the same folder.

I will note that this method is designed to run the componnets locally. However, given this repo contains the source code of the API along with the OpenAPI spec you can in theory host the API wherever you want if it is a requirement. If you do host it elsewhere I suggest changing the `API_KEY` env var value to something else.

### Openlifter

Be sure to do the steps before this to enable the API

* Navigate to the streaming section in the nagivation bar at the top
* Enable streaming
* Enter a URL that points to the API endpoint
  * This can be the API endpoint hosted locally or externally to the openlifter service
  * If authentication is required to access the API endpoint input the API key
    * If you are using the defaults of this implementation you won't have to change any of the settings from it's defaults
* Hit test connection to see if the connection is working

Data will only be sent to the API once you navigate to the `Lifting` section. So if you don't see any data in the OBS overlays further down it's probably because no data has been sent to the API yet. This is done because I assume if you are nagivating to the `Lifting` section you have filled in all the other Openlifter prequisites are are ready to start. Updates will be sent to the API each time you either nagivate to the lifting section (If you navigate away then back) or if you click the `Good Lift` or `No Lift` buttons.

### Lifting lights

There is some baseline intergration built in to use the lifting lights solution provided by https://lights.barbelltracker.com/. This integration doesn't write any of the light data back in to Openlifter, it just exports the code to the API so when the overlay in OBS queries the API it is querying the correct lights for the the `Meet` / `Platform`

You can enable it by doing the following:

* Navigate to: https://lights.barbelltracker.com/
* Click `let's go`
* Copy the code at the end of the URL after the `#`
  * Example:
    * If the URL is this https://lights.barbelltracker.com/index.html#i1vE
    * Copy `i1vE`
* Now back in Openlifter in the streaming section assuming it's enabled, enable the lights and paste in the code you copied in the previous step


### Streaming overlays

This was designed to work with [OBS (Open Broadcaster Software)](https://obsproject.com/). You can use OBS to connect to pretty much any major streaming provider. I'll assume you can figure out how to add sources required for streaming so I'll only detail how you can add the overlays to OBS.

* Once OBS is open click the `+` button in the `Sources` section
* Select `Browser`
* Name the new source something identifiable like `CurrentLifter`
* In the window that pops up this is where we will configure the overlay for the current lifter
  * In URL put the path to the lifter overlay HTML file
    * Example: `file://C:/Repos/openlifter/streaming/lifter/obs_lifter_overlay_v2.html?refresh=1`
    * This file has some configuable parameters you can pass as query parameters to the HTML file that I will detail below
  * Set `Width` to `1000`
  * Set `Height` to `200`
  * Remove the custom CSS
  * Tick `Shutdown source when no visible`
  * Tick `Refresh browser when scene becomes active`
  * Click `OK`
* Once done you can then position the overlay on your screen
* If you are using the lights
* Click the `+` button in the `Sources` section
* Select `Browser`
* Name the new source something identifiable like `Lights`
* In the window that pops up this is where we will configure the overlay for the lights
  * In URL put the path to the lifter overlay HTML file
    * Example: `file://C:/Repos/openlifter/streaming/lights/obs_lights_overlay.html?refresh=1`
    * This file has some configuable parameters you can pass as query parameters to the HTML file that I will detail below
  * Set `Width` to `400`
  * Set `Height` to `200`
  * Remove the custom CSS
  * Tick `Shutdown source when no visible`
  * Tick `Refresh browser when scene becomes active`
  * Click `OK`
* Once done you can then position the overlay on your screen
  * It's size is designed so it will by default fit to either the left or the right of the current lifter overlay
* Once you have the layout sorted you can keep them grouped together by holding shift and clicking on the `Lights` and `CurrentLifter` sources and clicking `Group Selected items`
  * If you need to adjust their position it will allow you to move them together

The source for the overlays is located [here](./streaming/)

### Overlay parameters

Each of the overlays have a set of URL parameters that you can provide if required. They all have default values but if at any point you need to change them you can by providing them in the URL as query parameters when you configure your browser source

### Lifter
* `refresh`
  * Defines how frequently the overlay will fetch data from the API
  * Default: `1` second
*  `platform`
   *  If you are running multiple platforms you can specify the platform number
   *  Default: `1`
*  `lifter`
   *  You can either fetch the current lifters info or the next lifters info from the API
   *  Default: `current`
   *  This can either be `current` or `next`
*  `auth`
   *  Default: `true`
   *  This can either be `true` or `false`
*  `apiurl`
   *  Default: `http://localhost:8080/theonlyway/Openlifter/1.0.0`
   *  Full URL of the Openlifter API endpoint
*  `apikey`
   *  Default: `441b6244-8a4f-4e0f-8624-e5c665ecc901`
   *  This matches the default API key defined in Openlifter and the dockerfile

Example OBS configuration using some of the above parameters: `file://C:/Repos/openlifter/streaming/lifter/obs_lifter_overlay_v2.html?refresh=1&platform=2`

### Lights
* `refresh`
  * Defines how frequently the overlay will fetch data from the API
  * Default: `1` second
*  `platform`
   *  If you are running multiple platforms you can specify the platform number
   *  Default: `1`
*  `auth`
   *  Default: `true`
   *  This can either be `true` or `false`
*  `apiurl`
   *  Default: `http://localhost:8080/theonlyway/Openlifter/1.0.0`
   *  Full URL of the Openlifter API endpoint
*  `apikey`
   *  Default: `441b6244-8a4f-4e0f-8624-e5c665ecc901`
   *  This matches the default API key defined in Openlifter and the dockerfile

Example OBS configuration using some of the above parameters: `file://C:/Repos/openlifter/streaming/lights/obs_lights_overlay.html?refresh=1&platform=2`

### Leaderboard
* `rotation`
  * Defines how frequently the overlay will rotate between table views
  * Default: `15` second
*  `entries_per_table`
   *  Defines how it will chunk and split up the display of entries. For example, if you got 20 entries for Males it'll split it up in to 4 chunks and rotate through them in order
   *  Default: `5`
*  `entries_grouping`
   *  This will control how the entries are grouped. You can either group the results by weight class using `class` or best lifter by total points using `points`. It will still group entries in to `Male`, `Female` and `Mx`.
   *  Default: `points`
*  `auth`
   *  Default: `true`
   *  This can either be `true` or `false`
*  `apiurl`
   *  Default: `http://localhost:8080/theonlyway/Openlifter/1.0.0`
   *  Full URL of the Openlifter API endpoint
*  `apikey`
   *  Default: `441b6244-8a4f-4e0f-8624-e5c665ecc901`
   *  This matches the default API key defined in Openlifter and the dockerfile

Example OBS configuration using some of the above parameters: `file://C:/Repos/openlifter/streaming/leaderboard/leaderboard_overlay.html?rotation=15&entries_grouping=points`

### Sponsors
* `rotation`
  * Defines how frequently the overlay will rotate between table views
  * Default: `15` second
*  `image_width`
   *  Define the width max width of the image display element
   *  Default: `350`
*  `image_height`
   *  Define the width max width of the image display element
   *  Default: `200`

Example OBS configuration using some of the above parameters: `file://C:/Repos/openlifter/streaming/sponsors/sponsors_overlay.html?image_height=250&image_width=350`
