// vim: set ts=2 sts=2 sw=2 et:
//
// This helper script is executed manually via "yarn manage:translations".

const path = require("path");
const manageTranslations = require("react-intl-translations-manager").default;

manageTranslations({
  messagesDirectory: path.join(__dirname, "translations/messages"),
  translationsDirectory: path.join(__dirname, "translations/locales/"),
  languages: ["eo", "es"] // any language you need
});
