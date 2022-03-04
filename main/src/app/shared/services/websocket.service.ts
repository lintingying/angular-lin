import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { Util } from 'src/app/util/utils';
import { EventBusService } from './event-bus.service';

/**
 * websocket 实时通信
 * https://docs.microsoft.com/en-us/aspnet/core/signalr/javascript-client?view=aspnetcore-6.0&tabs=visual-studio
 */
@Injectable()
export class WebsocketService {

  private hubConnection: HubConnection;
  /**
   * 是否已建立连接
   */
  isConnect = false;
  constructor(private eventbus: EventBusService) {
    this.init();
  }
  init() {
    this.hubConnection = new HubConnectionBuilder().withUrl("/chathub").build();
    this.start();
    this.registerServerEvents();
  }


  async start() {
    try {
      await this.hubConnection.start();
      console.log("SignalR Connected.");
    } catch (err) {
      console.log(err);
      setTimeout(this.start, 5000);
    }
  };

  stopConnection() {
    if (!Util.isUndefinedOrNull(this.hubConnection)) {
      return this.hubConnection.stop();
    } else {
      return Promise.resolve();
    }
  }
  /**
    * 注册服务端事件
    */
  private registerServerEvents() {
    this.hubConnection.onclose(e => {
      console.error(`连接关闭,e:${e}`);
      this.isConnect = false;
    });
    this.hubConnection.on('ReceiveMessage', (modCode: string, eventIdentifier: string, msgBody: any) => {
      this.eventbus.trigger(modCode, eventIdentifier, msgBody);
    });
    this.hubConnection.onreconnecting(error => {
      console.error(`连接断开，正在重连,e:${error}`);
      this.isConnect = false;
    });
    this.hubConnection.onreconnected(e => {
      console.log(`连接重连成功,e:${e}`);
      this.isConnect = true;
    });
  }
  /**
   * @description 监听服务端消息事件
   * @template T
   * @param {string} modCode 事件来源模块
   * @param {string} eventIdentifier 事件唯一标识
   * @returns {Observable<T>}
   */
  on<T>(modCode: string, eventIdentifier: string): Observable<T> {
    return this.eventbus.on(modCode, eventIdentifier);
  }

}

// 服务器端代码
// using Microsoft.AspNetCore.SignalR;
// namespace SignalRChat.Hubs;

// public class ChatHub : Hub
// {
//     public async Task SendMessage(string user, string message)
//     {
//         await Clients.All.SendAsync("ReceiveMessage", user, message);
//     }
// }
