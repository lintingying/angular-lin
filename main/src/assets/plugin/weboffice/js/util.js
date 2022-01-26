function Util() { }
// 静态变量-不用new一个实例，只能通过类名Util调用
Util.consts = {
  httpType: {
    get: 0,
    post: 1
  },
  /**
   * 文档类型
   */
  docType: {
    word: 0,
    excel: 1,
    ppt: 2,
    unknown: 99999
  },
  /**
   * 文档类型对应值
   */
  docTypeValue: {
    doc: 0,
    docx: 16,
    xls: 56,
    xlsx: 51,
    wps: 0,
    et: 56,
    pdf: 41,
    ofd: 42
  },
  dialogType: {
    // 新建
    dialogNew: 0,
    // 打开
    dialogOpen: 1,
    // 另存为
    dialogSaveAs: 2,
    // 另存为拷贝
    dialogSaveCopyAs: 3,
    // 打印
    dialogPrint: 4,
    // 打印设置
    dialogPageSetup: 5,
    // 文档属性
    dialogProperties: 6
  },
  /**
   * 文档编辑模式
   */
  editMode: {
    /**
     * 新建
     */
    newMode: 0,
    /**
     * 编辑并锁定
     */
    editAndLock: 1
  },
  // 存储于%UserProfile%\AppData\Roaming\iWebOffice\cache
  localTempPath: '\\iWebOffice\\cache',
  /**
   * 文档权限
   */
  rightType: {
    // 只读
    readonly: '0',
    // 编辑
    edit: '1'
  }
};

// 静态函数-不用new一个实例，只能通过类名Util调用
/**
 * 获取URL中的参数
 */
Util.getQueryString = function (name) {
  var query = sessionStorage.getItem('weboffice_query');
  if (!query) {
    var query = window.location.search.substring(1);
  }
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == name) {
      return pair[1];
    }
  }
  return false;
}
/**
   * 获取浏览器信息
   */
Util.getBrowserInfo = function () {
  var ua = navigator.userAgent.toLowerCase(),
    rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
    rFirefox = /(firefox)\/([\w.]+)/,
    rOpera = /(opera).+version\/([\w.]+)/,
    rChrome = /(chrome)\/([\w.]+)/,
    rSafari = /version\/([\w.]+).*(safari)/;

  var match = rMsie.exec(ua);
  if (match != null) {
    return { browser: "IE", version: match[2] || "0" };
  }
  var match = rFirefox.exec(ua);
  if (match != null) {
    return { browser: match[1] || "", version: match[2] || "0" };
  }
  var match = rOpera.exec(ua);
  if (match != null) {
    return { browser: match[1] || "", version: match[2] || "0" };
  }
  var match = rChrome.exec(ua);
  if (match != null) {
    return { browser: match[1] || "", version: match[2] || "0" };
  }
  var match = rSafari.exec(ua);
  if (match != null) {
    return { browser: match[2] || "", version: match[1] || "0" };
  }
  if (match != null) {
    return { browser: "", version: "0" };
  }
}

/**
 * 判断是否为undefined或Null
 */
Util.isUndefinedOrNull = function (obj) {
  return typeof obj === 'undefined' || obj === null;
}
/**
 * 判断是否为undefined、null或仅有空白字符
 */
Util.isNullOrWhiteSpace = function (str) {
  return typeof str === 'undefined' || str === null || /^\s*$/.test(str);
}
/**
 * 判断是否为0或空白字符等
 */
Util.isZeroOrWhiteSpace = function (str) {
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
 * 是否为数组
 */
Util.IsNullOrEmpty = function (array) {
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
* 检查是否安装了文档控件
*/
Util.checkPlugin = function () {
  var objectReady = false;

  if (this.isIE()) {
    try {
      objectReady = new ActiveXObject('Kinggrid.iWebOffice');
    } catch (e) {
      objectReady = false;
    }
  } else {
    var mimetype = navigator.mimeTypes['application/iwebplugin'];
    if (mimetype) {
      objectReady = mimetype.enabledPlugin;
    }
  }
  return objectReady;
}

/**
 * 获取文件后缀
 * @param {*} name
 * @returns
 */
Util.getFileExtension = function (name) {
  return name.substring(name.lastIndexOf('.')).toLowerCase();
}

/**
 * 当前是否ie浏览器
 */
Util.isIE = function () {
  return window.ActiveXObject !== undefined || window.ActiveXObject != null || 'ActiveXObject' in window;
}

Util.isOffice2003 = function (docObj) {
  try {
    var version = parseFloat(docObj.ActiveDocument.Application.Version);
    if (version === 11.0) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}
/**
 *  显示提示信息
 * @param message
 * @param action
 * @param autoClose
 * @param isDocObjFullSize
 */
Util.showNoticeDialog = function (docObj, message, action, autoClose, isDocObjFullSize) {
  try {
    docObj.FuncExtModule.Alert(message);
  } catch (e) {
    alert(message);
  }

  if (typeof action === 'function') {
    action();
  }
  if (autoClose && isDocObjFullSize) {
  }
}

Util.getOrigin = function () {
  if (!window.location.origin) {
    return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
  } else {
    var base = "";
    var sIndex = location.pathname.indexOf('/weboffice/');
    if (sIndex > 0) {
      base = location.pathname.substr(0, sIndex);
    }
    return window.location.origin + base;
  }
}

Util.isWordFile = function (extension) {
  var extreg = /.doc|docx/gi;
  var result = false;
  if (extension !== ' ') {
    result = extension.match(extreg) != null;
  }
  return result;
}
/**
 * 获取系统配置项
 * @param {*} arr
 * @param {*} code
 * @returns
 */
Util.getSystemProfileByCode = function (arr, code) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].ItemCode === code) {
      return JSON.parse(arr[i].ItemValue).Content;
    }
  }
  return null;
}


/**
 * 是否是当前流程步骤处理人
 */
Util.isCurrentHandler = function (processDetail) {
  // 如果存在ProcessTodoId，则表明当前登录用户是该步骤处理人，当前步骤处理人或草稿状态才能看到配置的按钮
  return !Util.isNullOrWhiteSpace(processDetail.ProcessTodoId);
}
/**
 * 当前流程是否处于草稿状态
 */
Util.isDraftState = function (processDetail) {
  return processDetail.TaskState === -1;
}

Util.getBasePath = function () {
  var base = "";
  var sIndex = location.pathname.indexOf('/weboffice/');
  if (sIndex > 0) {
    base = location.pathname.substr(0, sIndex);
  }
  return base;
}
/**
  * 先判断是否以插入字符串开头，不是才插入头部
  */
Util.prepend = function (str, insert) {
  if (!str.startsWith(insert)) {
    return insert + str;
  }
  return str;
}
Util.parsePath = function (url, resourceType) {
  if (url.indexOf('http:') !== 0 && url.indexOf('https:') !== 0 && url.indexOf('//') !== 0 && url.indexOf('data:') !== 0) {
    if (resourceType == 0) {
      if (!Util.isNullOrWhiteSpace(Util.getBasePath())) {
        if (url.indexOf('/') !== 0) {
          url = '/' + url;
        }
        url = Util.prepend(url, Util.getBasePath());
      }
    } else if (resourceType == 1) {
      // todo 前端资源未使用
      if (!Util.isNullOrWhiteSpace(window.appUtil.static_cdn)) {
        if (url.indexOf('/') === 0) {
          url = Util.prepend(url, window.appUtil.static_cdn);
        } else {
          url = Util.prepend(url, window.appUtil.public_path);
        }
      } else if (!Util.isNullOrWhiteSpace(Util.getBasePath())) {
        if (url.indexOf('/') === 0) {
          url = Util.prepend(url, Util.getBasePath());
        } else {
          url = Util.prepend(url, window.appUtil.public_path);
        }
      }
    }
  }
  return url;
}
