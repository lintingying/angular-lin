// 兼容ie
if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(targetLength, padString) {
    targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (this.length > targetLength) {
      return String(this);
    } else {
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }
      return padString.slice(0, targetLength) + String(this);
    }
  };
}
// 兼容ie8以下  JSON
if (!window.JSON) {
  window.JSON = {
    parse: function (jsonStr) {
      return eval('(' + jsonStr + ')');
    },
    stringify: function (jsonObj) {
      var result = '',
        curVal;
      if (jsonObj === null) {
        return String(jsonObj);
      }
      switch (typeof jsonObj) {
        case 'number':
        case 'boolean':
          return String(jsonObj);
        case 'string':
          return '"' + jsonObj + '"';
        case 'undefined':
        case 'function':
          return undefined;
      }

      switch (Object.prototype.toString.call(jsonObj)) {
        case '[object Array]':
          result += '[';
          for (var i = 0, len = jsonObj.length; i < len; i++) {
            curVal = JSON.stringify(jsonObj[i]);
            result += (curVal === undefined ? null : curVal) + ",";
          }
          if (result !== '[') {
            result = result.slice(0, -1);
          }
          result += ']';
          return result;
        case '[object Date]':
          return '"' + (jsonObj.toJSON ? jsonObj.toJSON() : jsonObj.toString()) + '"';
        case '[object RegExp]':
          return "{}";
        case '[object Object]':
          result += '{';
          for (i in jsonObj) {
            if (jsonObj.hasOwnProperty(i)) {
              curVal = JSON.stringify(jsonObj[i]);
              if (curVal !== undefined) {
                result += '"' + i + '":' + curVal + ',';
              }
            }
          }
          if (result !== '{') {
            result = result.slice(0, -1);
          }
          result += '}';
          return result;

        case '[object String]':
          return '"' + jsonObj.toString() + '"';
        case '[object Number]':
        case '[object Boolean]':
          return jsonObj.toString();
      }
    }
  };
}

// 兼容ie8
window._console = window.console;//将原始console对象缓存
window.console = (function (orgConsole) {
  return {//构造的新console对象
    log: getConsoleFn("log"),
    debug: getConsoleFn("debug"),
    info: getConsoleFn("info"),
    warn: getConsoleFn("warn"),
    exception: getConsoleFn("exception"),
    assert: getConsoleFn("assert"),
    dir: getConsoleFn("dir"),
    dirxml: getConsoleFn("dirxml"),
    trace: getConsoleFn("trace"),
    group: getConsoleFn("group"),
    groupCollapsed: getConsoleFn("groupCollapsed"),
    groupEnd: getConsoleFn("groupEnd"),
    profile: getConsoleFn("profile"),
    profileEnd: getConsoleFn("profileEnd"),
    count: getConsoleFn("count"),
    clear: getConsoleFn("clear"),
    time: getConsoleFn("time"),
    timeEnd: getConsoleFn("timeEnd"),
    timeStamp: getConsoleFn("timeStamp"),
    table: getConsoleFn("table"),
    error: getConsoleFn("error"),
    memory: getConsoleFn("memory"),
    markTimeline: getConsoleFn("markTimeline"),
    timeline: getConsoleFn("timeline"),
    timelineEnd: getConsoleFn("timelineEnd")
  };
  function getConsoleFn(name) {
    return function actionConsole() {
      if (typeof (orgConsole) !== "object") return;
      if (typeof (orgConsole[name]) !== "function") return;//判断原始console对象中是否含有此方法，若没有则直接返回
      return orgConsole[name].apply(orgConsole, Array.prototype.slice.call(arguments));//调用原始函数
    };
  }
}(window._console));


if (typeof Object.assign != 'function') {
  Object.assign = function (target) {
    'use strict';
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}

if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    value: function (search, pos) {
      pos = !pos || pos < 0 ? 0 : +pos;
      return this.substring(pos, pos + search.length) === search;
    }
  });
}
