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

## 原理图文件说明
原理图的主文件 index.ts 定义了一组实现原理图逻辑的规则。
schema.json	原理图变量定义。
schema.d.ts	原理图变量。
files/	要复制的可选组件/模板文件。

## 打包库和原理图my-lib
在工作区根目录下运行 yarn build:my-lib-schematics
## 链接这个库：需要把这个库链接到 node_modules 文件夹中
工作区根目录下的 dist/my-lib 文件夹下运行 npm link dist/my-lib
## 运行原理图
工作区根目录下的 dist/my-app文件夹下运行 ng generate my-lib:my-service --name my-data

## node_modules/.bin文件夹说明
./node_modules/.bin 以便可以通过 npm 运行的脚本使用它们
npm为script字段中的脚本路径都加上了node_moudles/.bin前缀
这意味着：你在试图运行本地安装的依赖在 node_modules/.bin 中的脚本的时候，可以省略node_modules/.bin这个前缀。
子文件夹下的项目运行npm script就可以使用这个../../node_modules/.bin/去执行脚本
