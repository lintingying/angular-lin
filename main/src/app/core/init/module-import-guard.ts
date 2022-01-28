/**
 * 防止重复导入 https://angular.cn/guide/singleton-services#prevent-reimport-of-the-greetingmodule
 */
export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
  if (parentModule) {
    throw new Error(`${moduleName} has already been loaded. Import ${moduleName} in the AppModule only.`);
  }
}
