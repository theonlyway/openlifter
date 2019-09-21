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

// This helper script is executed manually via "yarn manage:translations".
// It was copied from here: https://github.com/bang88/typescript-react-intl/issues/19

const DEFAULT_LANGUAGE = "en";
const LANGUAGES = ["eo"];
const TARGET_DIRECTORY = "src/translations";
const EXTRACT_MESSAGE_FILE_PATTERN = "src/**/*.@(tsx|ts)";

const TEMP_DIR = "./temp";
const TEMP_MESSAGE_FILENAME = "allMessages.json";

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const rimraf = require("rimraf");
const parser = require("typescript-react-intl").default;
const manageTranslations = require("react-intl-translations-manager").default;
const { readMessageFiles, getDefaultMessages } = require("react-intl-translations-manager");

function extractTranslations(pattern, cb) {
  // Array of { id: string, defaultMessage: string } objects.
  let results = [];

  pattern = pattern || "src/**/*.@(tsx|ts)";
  glob(pattern, function(err, files) {
    if (err) {
      throw new Error(err);
    }
    files.forEach(function(f) {
      const contents = fs.readFileSync(f).toString();
      const res = parser(contents);
      results = results.concat(res);
    });

    cb && cb(results);
  });
}

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

const tempMessageFilePath = path.join(TEMP_DIR, TEMP_MESSAGE_FILENAME);

extractTranslations(EXTRACT_MESSAGE_FILE_PATTERN, function(messages) {
  fs.writeFileSync(tempMessageFilePath, JSON.stringify(messages, null, 2));

  manageTranslations({
    messagesDirectory: TEMP_DIR,
    translationsDirectory: TARGET_DIRECTORY,
    languages: [DEFAULT_LANGUAGE, ...LANGUAGES],
    // avoid reporting translation issues with default language - https://github.com/GertjanReynaert/react-intl-translations-manager/issues/76
    overrideCoreMethods: {
      provideWhitelistFile: language => {
        // Avoid reporting untranslated stuff in defaultLanguage
        if (language.lang === DEFAULT_LANGUAGE) {
          const messageFiles = readMessageFiles(TEMP_DIR);
          const messages = getDefaultMessages(messageFiles).messages;
          return Object.keys(messages);
        } else {
          if (!fs.existsSync(language.whitelistFilepath)) {
            return [];
          }
          return JSON.parse(fs.readFileSync(language.whitelistFilepath, "utf-8"));
        }
      }
    }
  });

  rimraf.sync(TEMP_DIR);
});
