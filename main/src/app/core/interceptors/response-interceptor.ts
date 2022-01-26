
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
/**
 * 拦截器-处理Http响应
 */
@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

  constructor(private messageService: NzMessageService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const resp: HttpResponse<any> = event;
          if (resp.body && resp.body.ShowMsg && resp.body.Message) {
            this.messageService.warning(resp.body.Message);
          }
        }
      }, (err) => {
        let errorMsg = '对不起，服务器发生错误，请检查提交的数据后再试一次!';
        let showMsg = err.error ? err.error.ShowMsg : true;
        if (err.status === 500) {
          if (err.error && err.error.Status === 500 && err.error.ShowMsg) {
            errorMsg = err.error.Message;
          }
        } else if (err.status === 404) {
          showMsg = true;
          errorMsg = '无法找到资源';
        } else if (err.status === 401) {
          errorMsg = '登录已失效，请刷新页面后重新登录';
        } else if (err.status === 403) {
          if (err.error && err.error.ShowMsg) {
            errorMsg = err.error.Message;
          } else {
            errorMsg = '你无权进行该操作！';
          }
        } else if (err.status === 0) {
          showMsg = true;
          errorMsg = '无法连接到服务器';
        } else if (err.status === 502) {
          showMsg = true;
          errorMsg = '服务器发生错误';
        } else if (err.status === 504) {
          showMsg = true;
          errorMsg = '网关超时，无法连接到服务器';
        }
        if (showMsg) {
          this.messageService.error(errorMsg);
        }
      }));
  }

}
