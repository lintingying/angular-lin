import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
/**
 * 只有当用户登录并拥有某些权限的时候才能进入某些路由。
 * CanActivate 只让登录用户进入根路由。
 */
@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {

  constructor() { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.isLoggedIn().pipe(map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      } else {
        // 跳转到登录页TODO
        return false;
      }
    }));
  }

  /**
   * 是否登录TODO
   */
  isLoggedIn(): Observable<boolean> {
    return of(true);
  }

}
