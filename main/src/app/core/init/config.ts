import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class Config {
  BaseUrl: string;
  MicroApps: Array<any>;
}
