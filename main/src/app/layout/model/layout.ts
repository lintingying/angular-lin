export type MenuThemeType = 'light' | 'dark';
export enum MenuType {
  Side,
  Top,
  Compact,
}

export interface Layout {
  /** 是否固定顶部菜单 */
  fixed: boolean;
  /** 是否折叠右边菜单 */
  collapsed: boolean;
  /** 是否固定宽度 */
  boxed: boolean;
  /** 当前主题 */
  theme: string;
  /** 语言环境 */
  lang: string;
  /** 菜单风格 */
  menuThemeType: MenuThemeType;
  /** 页面布局 */
  menuType: MenuType;
  /** 是否紧凑模式 */
  compact: boolean;
}
