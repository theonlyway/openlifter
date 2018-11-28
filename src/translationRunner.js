const path = require("path");
const manageTranslations = require("react-intl-translations-manager").default;

manageTranslations({
  messagesDirectory: path.join(__dirname, "i18n/messages"),
  translationsDirectory: path.join(__dirname, "i18n/locales/"),
  languages: ["es"] // any language you need
});
