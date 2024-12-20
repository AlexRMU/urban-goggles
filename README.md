# urban-goggles

Task - https://docs.google.com/document/d/1Iv3Tc06N7Fgvy8iIDFdy0_kvNoV4JBNTOsuohxFj88g

- Стили CSS реализовать с помощью LESS или SASS
- Результирующий JS-код должен быть минифицирован
- Для сборки расширения использовать webpack или другой сборщик
- Опубликовать проект на git и инструкцию по сборке

## ./src/entrypoints/background.ts

- Расширение загружает список сайтов по адресу https://config-tool.ru/ext.json
- Список сайтов обновляется расширением 1 раз в 4 часа, но не чаще, чем 1 раз в 4 часа

## ./src/entrypoints/content

- При посещении пользователем страницы из списка сайтов (поле «domain») – показывать сообщение в виде html блока в любом виде на загруженной странице (поле «text»)
- Пользователь должен иметь возможность закрыть сообщение
- Если пользователь закрыл сообщение - при следующей загрузке сайта сообщение не должно быть показано никогда
- Если пользователь не закрыл сообщение - при следующей загрузке сайта сообщение должно быть показано вновь, но не более 3-х раз за сессию браузера
- На сайтах google.[com|ru], ya.ru в поисковой выдаче отметить иконкой расширения сайты из загруженного списка. Никаких дополнительных действий по нажатию на эту иконку не требуется.

## ./src/entrypoints/popup

- Расширение должно иметь popup окно открываемое нажатием на иконку
- В popup-окне отобразить список загруженных сайтов с возможностью перехода по сайтам, там же нужно вывести кол-во переходов на сайт, которые были с момента установки пользователем расширения

## Dev

- run `npm run dev`
- a new browser window will open

## Build

- run `npm run build`
- go to `chrome://extensions/`
- expand the developer dropdown menu and click `Load Unpacked Extension`
- navigate to `{root}/build/chrome-mv3/`
- click `Ok`
- extension is installed

## Build zip

- run `npm run zip`
- archive will be in `{root}/build`

## Used packages

- svelte
- typescript
- wxt
- vite
- sass
- prettier
