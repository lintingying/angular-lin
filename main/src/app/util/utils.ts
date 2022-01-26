///<reference path="../../typings.d.ts"/>
import { from, isObservable, Observable, of } from 'rxjs';
export class Util {
  /**
   * 判断是否为undefined或Null
   */
  static isUndefinedOrNull(obj: any): boolean {
    return typeof obj === 'undefined' || obj === null;
  }
  /**
   * 判断是否为undefined、null或仅有空白字符
   */
  static isNullOrWhiteSpace(str: string | undefined | null): boolean {
    return typeof str === 'undefined' || str === null || /^\s*$/.test(str);
  }
  /**
   * 判断是否为0或空白字符等
   */
  static isZeroOrWhiteSpace(str: string | number): boolean {
    if (typeof str === 'undefined' || str === null) {
      return true;
    } else if (typeof str === 'string') {
      return /^\s*$/.test(str) || str === '0';
    } else if (typeof str === 'number') {
      return str === 0;
    } else {
      return false;
    }
  }
  /**
   * 判断是否是布尔值
   */
  static isBoolean(obj: any): boolean {
    return obj === true || obj === false;
  }
  /**
   * 判断是否是整数
   */
  static isInt(obj: any): boolean {
    return Number(obj) === obj && obj % 1 === 0;
  }
  /**
   * 判断是否是浮点数
   */
  static isFloat(obj: any): boolean {
    return obj === Number(obj) && obj % 1 !== 0;
  }
  /**
   * 判断是否是数字
   */
  static isNumber(obj: any): boolean {
    return !isNaN(Number(obj));
  }
  /**
   * 判断是否是数组
   */
  static isArray(obj: any) {
    return Array.isArray(obj);
  }

  /**
   * 对字符串进行补齐,不够长度的在左边补齐fillstr
   */
  static padLeft(n: string, length: number, fillstr: string = '0'): string {
    return (Array(length).join(fillstr) + n).substr(-length);
  }
  static objectLength(obj: any) {
    return Reflect.ownKeys(obj).length;
  }

  static isDateStr(str: string) {
    // tslint:disable-next-line:max-line-length
    const reg = /((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2 - 9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2 - 9][0 - 9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0 ? 2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/gi;
    if (reg.test(str)) {
      return true;
    } else {
      return false;
    }
  }
  /**
   *
   * 将字符串转为boolean
   */
  static ConvertToBoolean(str: string): boolean {
    if (str == null) {
      return false;
    }
    return str.toLowerCase() === 'true';
  }
  /**
   * 判断数组是否为Null或者空
   */
  static IsNullOrEmpty<T>(array: T[]) {
    if (!Util.isUndefinedOrNull(array)) {
      if (array instanceof Array) {
        if (array.length > 0) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * 检查是否有真值
   */
  static isTruth(value: any): boolean {
    return typeof value !== 'undefined' && value !== false;
  }

  static fixedZero(val: number) {
    return val * 1 < 10 ? `0${val}` : val;
  }

  // static getTimeDistance(type: 'today' | 'week' | 'month' | 'year') {
  //   const now = new Date();
  //   const oneDay = 1000 * 60 * 60 * 24;
  //   const year = now.getFullYear();
  //   switch (type) {
  //     case 'today':
  //       now.setHours(0);
  //       now.setMinutes(0);
  //       now.setSeconds(0);
  //       return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  //     case 'week':
  //       let day = now.getDay();
  //       now.setHours(0);
  //       now.setMinutes(0);
  //       now.setSeconds(0);
  //       if (day === 0) {
  //         day = 6;
  //       } else {
  //         day -= 1;
  //       }
  //       const beginTime = now.getTime() - day * oneDay;
  //       return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  //     case 'month':
  //       const month = now.getMonth();
  //       const nextDate = moment(now).add(1, 'months');
  //       const nextYear = nextDate.year();
  //       const nextMonth = nextDate.month();
  //       return [
  //         moment(`${year}-${Util.fixedZero(month + 1)}-01 00:00:00`),
  //         moment(moment(`${nextYear}-${Util.fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
  //       ];
  //     case 'year':
  //       return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  //     default:
  //       return [moment(), moment()];
  //   }
  // }

  static isFunction(value: any) {
    return typeof value === 'function';
  }

  /**
   * 从data中获取field的值
   */
  static getter(data: any, field: string): any {
    if (!(data instanceof Object) || typeof field === 'undefined') {
      return null;
    }
    const fieldTemp = field.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
    const pathArray = fieldTemp.split(/\./);
    let value = data;
    for (let i = 0, n = pathArray.length; i < n; ++i) {
      const key = pathArray[i];
      if (typeof value === 'object' && key in value) {
        if (value[key] !== null) {
          value = value[key];
        } else {
          return null;
        }
      } else {
        if (i > 0 && typeof value === 'string') {
          value = JSON.parse(value);
          if (typeof value === 'object' && key in value) {
            if (value[key] !== null) {
              value = value[key];
            } else {
              return null;
            }
          } else {
            return null;
          }
        } else {
          return null;
        }
      }
    }
    return value;
  }

  /**
   * 往data中设置field的值
   */
  static setter(field: string, value: any, data: any) {
    const fieldTemp = field.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
    const pathArray = fieldTemp.split(/\./);
    if (pathArray.length < 2) {
      data[pathArray[0]] = value;
    } else {
      if (!data[pathArray[0]]) {
        if (Util.isNumber(pathArray[1])) {
          data[pathArray[0]] = [];
        } else {
          data[pathArray[0]] = {};
        }
      }
      data = data[pathArray.shift()!];
      this.setter(pathArray.join('.'), value, data);
    }
  }

  /**
   * 数组交集
   */
  static intersection(one: any[], another: any[]): any[] {
    const result: any[] = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < one.length; i++) {
      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < another.length; j++) {
        if (one[i] === another[j] && result.indexOf(one[i]) === -1) {
          result.push(one[i]);
          break;
        }
      }
    }
    return result;
  }

  /**
   * 数组并集
   * @param one 数组one
   * @param another 数组another
   */
  static union(one: any[], another: any[]): any[] {
    return [...one, ...another];
  }

  /**
   * 数组去重
   */
  static distinct(a: any[], b: any[]): any[] {
    const arr = a.concat(b);
    const result = [];
    const obj: any = {};

    for (const i of arr) {
      if (!obj[i]) {
        result.push(i);
        obj[i] = 1;
      }
    }

    return result;
  }

  static unique(arr: Array<any>) {
    return Array.from(new Set(arr));
  }

  static toFriendlyString(value: any) {
    if (Util.isNullOrWhiteSpace(value)) {
      return '';
    } else if (value.toString() === 'NaN') {
      return '';
    } else if (value.toString() === 'Infinity') {
      return '';
    } else if (value.toString() === 'Invalid Date') {
      return '';
    } else if (value.toString() === 'Invalid date') {
      return '';
    } else {
      return value;
    }
  }

  static getUUID(): string {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // tslint:disable-next-line:no-bitwise
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      // tslint:disable-next-line:no-bitwise
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }

  static getOrigin(): string {
    if (!window.location.origin) {
      return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    } else {
      return window.location.origin;
    }
  }

  static getBaseHref() {
    const baseNode = document.querySelector('base');
    if (baseNode) {
      return baseNode.getAttribute('href');
    } else {
      return '/';
    }
  }
  static getBaseUri() {
    if (document.baseURI) {
      return document.baseURI;
    } else {
      return this.getOrigin() + this.getBaseHref();
    }
  }
  static inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  static addIfNotExist(array: Array<any>, value: any) {
    if (array.indexOf(value) === -1) {
      array.push(value);
    }
    return array;
  }
  static escapeRegExp(str: string) {
    const specials = [
      // order matters for these
      '-',
      '[',
      ']',
      // order doesn't matter for any of these
      '/',
      '{',
      '}',
      '(',
      ')',
      '*',
      '+',
      '?',
      '.',
      '\\',
      '^',
      '$',
      '|',
    ];

    // I choose to escape every character with '\'
    // even though only some strictly require it when inside of []
    const regex = RegExp('[' + specials.join('\\') + ']', 'g');

    return str.replace(regex, '\\$&');
  }
  static trimEnd(str: string, char: string) {
    char = Util.escapeRegExp(char);
    return str.replace(new RegExp(`${char}+$`, 'g'), '');
  }
  static trim(str: string, char: string) {
    char = Util.escapeRegExp(char);
    return str.replace(new RegExp(`^${char}+`, 'g'), '');
  }
  static trimStart(str: string, char: string) {
    char = Util.escapeRegExp(char);
    return str.replace(new RegExp(`^${char}+|${char}+$`, 'g'), '');
  }

  static isPromise<T>(obj: any): obj is Promise<T> {
    return !!obj && typeof obj.then === 'function' && typeof obj.catch === 'function';
  }

  static wrapIntoObservable<T>(value: T | Promise<T> | Observable<T>): Observable<T> {
    if (isObservable(value)) {
      return value;
    }

    if (Util.isPromise(value)) {
      // Use `Promise.resolve()` to wrap promise-like instances.
      return from(Promise.resolve(value));
    }

    return of(value);
  }
}
