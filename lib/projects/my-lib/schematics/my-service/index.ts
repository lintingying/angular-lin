import {
  Rule, Tree, SchematicsException,
  apply, url, applyTemplates, move,
  chain, mergeWith
} from '@angular-devkit/schematics';

import { strings, normalize, virtualFs, workspaces } from '@angular-devkit/core';

import { Schema as MyServiceSchema } from './schema';

function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
      const data = tree.read(path);
      if (!data) {
        throw new SchematicsException('File not found.');
      }
      return virtualFs.fileBufferToString(data);
    },
    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },
    async isDirectory(path: string): Promise<boolean> {
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },
    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    },
  };
}

/**
 * 原理图工厂函数
 */
export function myService(options: MyServiceSchema): Rule {
  return async (tree: Tree) => {
    const host = createHost(tree);
    // workspaces.readWorkspace 方法在工作区的根目录下读取工作区配置文件 angular.json 的内容。
    const { workspace } = await workspaces.readWorkspace('/', host);

    // 此 workspace.extensions 属性中包含一个 defaultProject 值，用来确定如果没有提供该参数，要使用哪个项目。
    // 如果 ng generate 命令中没有明确指定任何项目，就会把它作为后备值
    if (!options.project && typeof workspace.extensions.defaultProject === 'string') {
      options.project = workspace.extensions.defaultProject;
    }

    // workspace.projects 对象包含指定项目的全部配置信息
    const project = (options.project != null) ? workspace.projects.get(options.project) : null;
    if (!project) {
      throw new SchematicsException(`Invalid project name: ${options.project}`);
    }

    const projectType = project.extensions.projectType === 'application' ? 'app' : 'lib';

    // options.path 决定了应用原理图之后，要把原理图模板文件移动到的位置。
    // 原理图模式中的 path 选项默认会替换为当前工作目录。
    // 如果未定义 path，就使用项目配置中的 sourceRoot 和 projectType 来确定。
    if (options.path === undefined) {
      options.path = `${project.sourceRoot}/${projectType}`;
    }

    // Rule 可以使用外部模板文件，对它们进行转换，并使用转换后的模板返回另一个 Rule 对象。
    // 可以用模板来生成原理图所需的任意自定义文件。
    // apply() 方法会把多个规则应用到源码中，并返回转换后的源代码。它需要两个参数，一个源代码和一个规则数组。
    // url() 方法会从文件系统中相对于原理图的路径下读取源文件。
    // applyTemplates() 方法会接收一个参数，它的方法和属性可用在原理图模板和原理图文件名上。它返回一条 Rule。你可以在这里定义 classify() 和 dasherize() 方法，以及 name 属性。
    // classify() 方法接受一个值，并返回标题格式（title case）的值。比如，如果提供的名字是 my service，它就会返回 MyService。
    // dasherize() 方法接受一个值，并以中线分隔并小写的形式返回值。比如，如果提供的名字是 MyService，它就会返回 “my-service” 的形式。
    // 当应用了此原理图之后，move 方法会把所提供的源文件移动到目的地。
    const templateSource = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        name: options.name
      }),
      move(normalize(options.path as string))
    ]);

    // 规则工厂必须返回一条规则
    // chain() 方法允许你把多个规则组合到一个规则中，这样就可以在一个原理图中执行多个操作。
    // 这里你只是把模板规则和原理图要执行的代码合并在一起。
    return chain([
      mergeWith(templateSource)
    ]);
  };
}


// Schematics 框架提供了一个文件模板系统，它支持路径和内容模板。
// 系统会操作在这个输入文件树（Tree）中加载的文件内或路径中定义的占位符，用传给 Rule 的值来填充它们。
