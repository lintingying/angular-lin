var EncryptUrlFragment = '?q=';
var LogLevel = {
  // 调试
  DEBUG: 30000,

  // 错误
  ERROR: 70000,

  // 严重错误
  FATAL: 110000,

  // 信息
  INFO: 40000,

  // 警告
  WARN: 60000
};

function InnerLogger() { }
InnerLogger.operQueen = new Array();
InnerLogger.sendQueen = new Array();
InnerLogger.browserInfo;

function LoggerClient(moduleName, category) {
  this.moduleName = moduleName;
  this.category = category;

  this.info = function (message, ex) {
    this.paser(LogLevel.INFO, ex, message);
  }

  this.warn = function (message, ex) {
    this.paser(LogLevel.WARN, ex, message);
  }
  this.error = function (message, ex) {
    this.paser(LogLevel.ERROR, ex, message);
  }
  this.handeleException = function (ex, message) {
    this.paser(LogLevel.ERROR, ex, message);
  }
  this.paser = function (logLevel, ex, message) {
    if (ex == null && message == null) {
      return;
    }
    var msg = '';
    var stackTrack = null;
    if (ex) {
      msg = ex.name + ': ' + ex.message;
      stackTrack = ex.stack;
      if (ex.originalError) {
        msg += 'Original Msg:' + ex.originalError.name + ',' + ex.originalError.message;
        stackTrack += ex.originalError.stack;
      }
    }
    if (message) {
      msg = JSON.stringify(message) + message;
    }
    this.sendErrorLog({
      Message: msg,
      StackTrace: stackTrack,
      ExtraInfo: null,
      Level: logLevel,
    });
  }
  this.checkDup = function (data) {
    if (
      InnerLogger.sendQueen.some(function (v) {
        if (data.StackTrace) {
          return data.StackTrace === v.StackTrace;
        } else {
          return data.Message === v.Message;
        }
      })
    ) {
      return true;
    } else {
      InnerLogger.sendQueen.push(data);
      return false;
    }
  }
  this.sendErrorLog = function (data) {
    if (data) {
      // var url = CryptoUtils.decryptUrl(location.href);
      var url = location.href;
      var moduleName = this.moduleName;
      if (moduleName === 'Global' && !url.includes(EncryptUrlFragment)) {
        var tempUrl = url.replace(Util.getBaseUri(), '');
        var urls = tempUrl.split('/');
        if (urls.length >= 1) {
          if (urls[0] === 'extra') {
            if (urls.length >= 1) {
              if (urls[1]) {
                moduleName = urls[1];
              }
            }
          } else if (urls[0].indexOf('#') >= 0 || url[0].indexOf('?') >= 0) {
          } else {
            if (urls[0]) {
              moduleName = urls[0];
            }
          }
        }
      }
      data.ModuleName = moduleName;
      data.Category = this.category;

      data.BrowserInfo = InnerLogger.browserInfo;
      try {
        if (!Util.isUndefinedOrNull(window.opener)) {
          // var opener = CryptoUtils.decryptUrl(window.opener.location.href);
          var opener = window.opener.location.href;
          if (!Util.isUndefinedOrNull(opener)) {
            url += ',openner:' + opener;
          }
        }
      } catch (e) { }

      data.Url = url;
      if (Util.isUndefinedOrNull(data.Level)) {
        data.Level = LogLevel.ERROR;
      }
      data.OperTrace = JSON.stringify(InnerLogger.operQueen);
      InnerLogger.operQueen.length = 0;
      if (!this.checkDup(data)) {
        this.ajaxSend(data);
      }
    }
  }
  this.ajaxSend = function (data) {
    if (data) {
      var token = Util.getQueryString("access_token");

      var base = "";
      var sIndex = location.pathname.indexOf('/weboffice/');
      if (sIndex > 0) {
        base = location.pathname.substr(0, sIndex);
      }
      var xhr = new XMLHttpRequest();
      xhr.open('post', base + '/api/Logging/FrontEndLog/Add', true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.setRequestHeader('Content-Type', 'application/json');
      if (token) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      }
      xhr.send(JSON.stringify(data));
    }
  }
}

function Logger() { }
Logger.loggers = {};
Logger.GetLogger = function (moduleName, category) {
  var loggerName = moduleName + '.' + category;
  if (Logger.loggers[loggerName]) {
    return Logger.loggers[loggerName];
  } else {
    Logger.loggers[loggerName] = new LoggerClient(moduleName, category);
  }
  return Logger.loggers[loggerName];
}



