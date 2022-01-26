import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
/**
 * 只有当用户登录并拥有某些权限的时候才能进入某些路由。
 * CanActivateChild 拥有某些权限的时候才能进入子路由。
 */
@Injectable({ providedIn: 'root' })
export class RightGuardService implements CanActivateChild {

  constructor() { }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const path = state.url.split(';')[0];
    return this.hasRight(path).pipe(map(hasRight => {
      if (hasRight) {
        return true;
      } else {
        // 跳转到无权限页面TODO
        return false;
      }
    }));
  }
  /**
   * 当前用户是否有权限访问当前页面TODO
   */
  hasRight(path): Observable<boolean> {
    return of(true);
  }
}
