import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * 拦截器 处理Http请求头
 */
@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const Token = 'token';
    req = req.clone({
      setHeaders: {
        Authorization: Token,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    return next.handle(req);
  }
}
