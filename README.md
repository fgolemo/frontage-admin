# Arbalet Frontage Admin Panel

## basic install

- clone repo, `cd` in here
- `npm install`
- `ng serve --env=prod` # or change the backend variable in `src/environments/environment.prod.ts`
- point your browser to `http://localhost:4200/` and login with user `root` and random password

## translating and running with translation files

### Generating a translatable file

In order to get a file that contains all the text messages of the app, which can then be translated, issue the command

    ng xi18n --output-path src/i18n

This creates the file `src/i18n/messages.xlf`. Then go online to a service like http://xliff.brightec.co.uk/ where you can upload that file and add translations. You have to translate everything. If you miss out a single string, the app will not compile. Once you have everything translated, download and save the resulting file as `messages.LL.xlf` in the same directory, where `LL` is the 2-letter ISO code of that country (e.g. English is EN, French is FR, Spanish is ES).

### Running and building with translations

Once you have a translation file, say French translation, you can run the result live like this

    ng serve --aot --i18n-file=src/i18n/messages.fr.xlf --locale=fr --i18n-format=xlf

This launches the app for demonstration. If you wanna build the app instead for deployment, you can do it like this

    ng build --output-path=dist/fr --aot -prod --bh /fr/ --i18n-file=src/i18n/messages.fr.xlf --i18n-format=xlf --locale=fr

This creates a localized build in the `dist/fr` folder that you can upload to a webserver.
