This is an ad-hoc generator written in Python to solve Hugo deficiencies with multi-language support.

It generates translatable content files, one for each language for each page, into the `/website/content/` directory.

It is very unfortunate that we need something like this. The problems with Hugo (0.55.6) are as follows:

1. The current multi-language support requires a completely different content file for each language.
2. Those content files do not support `{{ }}` notation for calling the `i18n` function that acquires translations.
3. The only sane way for us to get translations is through a translation website (currently POEditor.com), and that outputs key-value maps. So we need to load our strings into key-value maps.

This generator attempts to mimic Hugo syntax as closely as possible, with a few differences:

1. Calling `{{ i18n "translation-id" }}` is allowed even in the TOML header (normally it's an error).
2. Calling `{{ i18n "translation-id" }}` is allowed in the content (normally it's treated as text).
3. Inline HTML is always allowed without having to pass through the safeHTML function.
