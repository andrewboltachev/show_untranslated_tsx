### Описание
Скрипт, который показывает непереведённые строки в `*.tsx`-файлах

Идея — по идее можно использовать просто `grep`, но в коде много комментариев тоже на кириллице. Поэтому данный скрипт
показывает только строки, которые относятся к SyntaxKind'ам `StringLiteral` и `JsxText`

Посмотреть какие бывают SyntaxKind'ы можно вставив фрагмент кода на TypeScript (+JSX) сюда:
[TypeScript AST Viewer](https://ts-ast-viewer.com/)

Примечание: SyntaxKind'ы `TemplateHead`, `TemplateMiddle`, `TemplateTail` скрипт не обрабатывает, т.к. с ними сложнее. 

### Запуск

```shell
pnpm i

node ./script.js ../project/path/to/module
```
