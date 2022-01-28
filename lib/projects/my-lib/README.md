# MyLib

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.4.

## Code scaffolding

Run `ng generate component component-name --project my-lib` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project my-lib`.
> Note: Don't forget to add `--project my-lib` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build my-lib` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build my-lib`, go to the dist folder `cd dist/my-lib` and run `npm publish`.

## Running unit tests

Run `ng test my-lib` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

在\lib\projects下生成library  ng generate library my-lib
添加原理图 参考 https://angular.cn/guide/schematics-for-libraries

// 原理图的主文件 index.ts 定义了一组实现原理图逻辑的规则。
// schema.json	原理图变量定义。
// schema.d.ts	原理图变量。
// files/	要复制的可选组件/模板文件。
