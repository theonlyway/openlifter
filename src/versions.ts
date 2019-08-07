// vim: set ts=2 sts=2 sw=2 et:
//
// This file is part of OpenLifter, simple Powerlifting meet software.
// Copyright (C) 2019 The OpenPowerlifting Project.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// Versioning for the global State object.
//
// Incrementing the version string breaks compatibility between implementations,
// with the expectation that a converter will be automatically applied if possible,
// such that a version of OpenLifter that internally uses version "B" can still
// load files written in version "A", by means of auto-upgrading.
//
// This string is stored on the GlobalState as the property "versions.stateVersion".
// Each save file thereby reports its own version.
export const stateVersion: string = "0";

// Versioning for the OpenLifter project as a whole.
//
// This is safely incrementable on *releases*. Its function is exclusively to alert
// users to "automatic" upgrades of the software, and it is reported explicitly
// on the Home page.
//
// Changing this version does *not* represent data incompatibilities; for that,
// please use the "stateVersion".
//
// This string is stored on the GlobalState as the property "versions.releaseVersion".
//
// It's defined by the '.env' file in the project root, which references
// the package.json variable 'version'.
export const releaseVersion: string =
  typeof process.env.REACT_APP_VERSION === "string" ? process.env.REACT_APP_VERSION : "[undefined REACT_APP_VERSION]";

// Strictly-presentational representation of when the releaseVersion was changed.
// Update this concurrently with modifying the releaseVersion.
// This value is not stored in the state: it's purely informational.
export const releaseDate: string = "(ﾉ◕ヮ◕)ﾉ*:・ﾟ✧";
