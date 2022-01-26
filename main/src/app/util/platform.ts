import { Util } from './utils';
export class Platform {
  static IsWechat() {
    const userAgent = Platform.getUserAgent();
    return userAgent.includes('MicroMessenger');
  }
  static IsWechatWork() {
    const userAgent = Platform.getUserAgent();
    return userAgent.includes('wxwork');
  }
  private static getUserAgent(): string {
    return Util.getter(window, 'navigator.userAgent');
  }
  static IsDingTalk() {
    const userAgent = Platform.getUserAgent();
    return userAgent.toLowerCase().includes('dingtalk');
  }
  static IsWindows() {
    return window.navigator.platform === 'Win32';
  }
  static IsMobile() {
    const userAgent = Platform.getUserAgent();
    return userAgent.toLowerCase().indexOf('mobile') !== -1;
  }

  static isIE(): boolean {
    return window.ActiveXObject !== undefined || window.ActiveXObject != null || 'ActiveXObject' in window;
  }
  static isEdge(): boolean {
    return !Platform.isIE() && !!window.StyleMedia;
  }
  static isChrome(): boolean {
    const userAgent = Platform.getUserAgent();
    return userAgent.indexOf('Chrome') > -1;
  }

  static IsAndroid() {
    const userAgent = Platform.getUserAgent();
    return /android/i.test(userAgent);
  }

  static IsIos() {
    const userAgent = Platform.getUserAgent();
    // tslint:disable-next-line: no-angle-bracket-type-assertion
    return /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
  }

  static smallScreenDetected() {
    let result = false;
    if (location.search !== '?pc' && window.sessionStorage.getItem('pc') !== 'on') {
      // tslint:disable-next-line: no-angle-bracket-type-assertion whitespace
      const screen = <any>window.screen;
      let orientation = '';
      if (screen.msOrientation) {
        orientation = screen.msOrientation;
      } else if (screen.orientation && screen.orientation.type) {
        orientation = screen.orientation.type;
      }
      if (orientation) {
        if (orientation.includes('portrait')) {
          if (screen.width < 600) {
            result = true;
          }
        } else {
          if (screen.height < 600) {
            result = true;
          }
        }
      } else {
        if (screen.width < 600) {
          result = true;
        }
      }
    } else {
      window.sessionStorage.setItem('pc', 'on');
    }
    return result;
  }
}
