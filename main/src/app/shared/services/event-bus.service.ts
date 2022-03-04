import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  constructor() { }

  private eventHandle: { [key: string]: Subject<any> } = {};
  private parseKey(modCode: string, event: string): string {
    return modCode + '.' + event;
  }

  on<T>(modCode: string, event: string): Observable<T> {
    const key = this.parseKey(modCode, event);
    if (!(key in this.eventHandle)) {
      this.eventHandle[key] = new Subject<T>();
    }
    return this.eventHandle[key];
  }

  trigger<T>(modCode: string, event: string, data: T) {
    const key = this.parseKey(modCode, event);
    if (key in this.eventHandle) {
      this.eventHandle[key].next(data);
    }
  }

}
