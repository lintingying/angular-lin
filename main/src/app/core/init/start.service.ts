import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Config } from './config';
/**
 * 用于应用启动时
 * 获取应用基础数据
 */
@Injectable({
  providedIn: 'root',
})
export class StartService {

  constructor(private http: HttpClient, private messageSvc: NzMessageService, private config: Config) { }

  load(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get('/assets/config/config.json').subscribe((res: Config) => {
        this.config.BaseUrl = res.BaseUrl;
        this.config.MicroApps = res.MicroApps;
        resolve(res);
      }, (err: HttpErrorResponse) => {
        this.messageSvc.error('加载服务器信息失败，API服务不可用');
      });
    });
  }
}
