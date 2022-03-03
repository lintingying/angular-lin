import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
/**
 * /**
 * 结构型指令(类似ngIf)
 * 星号 * 语法是 Angular 解释为较长形式的简写形式。
 *  Angular 将结构型指令前面的星号转换为围绕宿主元素及其后代的 <ng-template>
 * 下面写法是等价的
 * <div *linShow="true">哈哈哈</div>
 * <ng-template [linShow]="true">
 *   <div>哈哈哈</div>
 * </ng-template>
 */
@Directive({
  selector: '[linShow]'
})
export class LinShowDirective {

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) { }
  @Input() set linShow(value: boolean) {
    if (value) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (value) {
      this.viewContainer.clear();
    }
  }

}
