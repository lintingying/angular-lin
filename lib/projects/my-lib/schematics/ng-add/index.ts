import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngAdd(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    return tree;
  };
}


// 提供初始 ng add 支持所需的唯一步骤是使用 SchematicContext 来触发安装任务。
// 该任务会借助用户首选的包管理器将该库添加到宿主项目的 package.json 配置文件中，并将其安装到该项目的 node_modules 目录下。
// 在这个例子中，该函数会接收当前的 Tree 并返回它而不作任何修改。
