/**
 * weboffice构造函数
 * @param {*} options-WebOfficeConfig
 * @param {*} docObj
 * @param {*} token
 */
function WebOffice(options, docObj, token) {
  'use strict';
  /**
   * 类型：WebOfficeConfig
   */
  this.options = options;
  /**
   * Office控件对象,可直接调用控件接口及属性
   */
  this.docObj = docObj;
  this.token = token;
  this.fileSystem;
  this.http;
  this.localTempPath;
  /**
   * 当前编辑文档的文件名
   * 与套红模板、印章图片等其他文件无关
   */
  this.localTempFileName;
  /**
   * 日志
   */
  this.logger = Logger.GetLogger('WebOffice', 'HandleException');
  /**
   * 文档锁定状态
   */
  this.locked = false;

  this.getNewTempFileName = function () {
    // 返回string
    return new Date().getTime() + Util.getFileExtension(this.options.fileName);
  };
  this.initSkin = function () {
    if (!Util.isUndefinedOrNull(this.docObj)) {
      var titleBarColor = 0xd5b69f;
      var customToolbarStartColor = 0xd5b69f;
      var menuBarStartColor = 0xfcf3ef;
      var menuBarButtonStartColor = 0xf2eaf5;
      var menuBarButtonEndColor = 0xf2eaf5;
      var menuBarButtonFrameColor = 0xf2eaf5;
      if (!Util.isUndefinedOrNull(this.docObj.Style)) {
        var style = this.docObj.Style;
        style.titleBarColor = titleBarColor;
        style.titleBarTextColor = 0x000000;
        style.menuBarStartColor = menuBarStartColor;
        style.menuBarEndColor = 0xffffff;
        style.menuBarTextColor = 0x000000;
        style.menuBarHighlightTextColor = 0x000000;
        style.menuBarButtonStartColor = menuBarButtonStartColor;
        style.menuBarButtonEndColor = menuBarButtonEndColor;
        style.menuBarButtonFrameColor = menuBarButtonFrameColor;
        style.customToolbarStartColor = customToolbarStartColor;
        style.Invalidate();
      }
    }
  };

  this.init = function () {
    this.fileSystem = this.docObj.fileSystem;
    this.http = this.docObj.http;
    //按月归集缓存文件夹
    var current = new Date();
    this.localTempPath = this.fileSystem.getSpecialFolderPath(0x1a) + Util.consts.localTempPath + '\\' + current.getFullYear() + '-' + (current.getMonth() + 1).toString().padStart(2, '0') + '\\';
    this.localTempFileName = this.getNewTempFileName();
    this.fileSystem.CreateDirectory(this.localTempPath);
    this.http.SetRequestHeader('Authorization', 'Bearer ' + this.token);
    try {
      this.http.SetRequestHeader('Referer', location.href);
    } catch (err) {
      console.log(err);
    }
    this.docObj.Caption = this.options.caption;
    this.docObj.Style.ShowMenuBar = this.options.showMenuBar;
    this.docObj.Style.ShowTitleBar = this.options.showTitleBar;
    this.docObj.Style.ShowStatusBar = this.options.showStatusBar;
    this.docObj.Style.ShowCustomToolbar = true;
    this.docObj.Style.ShowToolBars = true;
    this.docObj.Style.Invalidate();

    // 在选中修订文本的时候是否控制右键菜单的显示
    this.docObj.RevisionRightMenuCloseOff = false;
    this.trustInit(this.localTempPath);
    this.hookEnabled();
    this.initToolBar();
    if (!Util.isZeroOrWhiteSpace(this.options.id)) {
      var parameters = {
        modCode: this.options.moduleCode,
        id: this.options.id
      };
      if (this.options.editMode === Util.consts.editMode.editAndLock) {
        this.lockFile();
      }
      this.downLoadFile(this.options.downloadUrl, parameters, null, 1, function (result) {
        if (result.isSuccess) {
          this.openFile(result.localFilePath);
        }
      });
    } else {
      this.newEmptyFile();
    }
    if (this.options.afterInitCallback) {
      this.options.afterInitCallback(this);
    }
  };

  /**
   * 设置office信任目录
   */
  this.setTrustLocation = function (app, version, location) {
    try {
      var key = 0x80000001; // HKEY_CURRENT_USER
      var path = 'Software\\Microsoft\\Office\\' + version + '\\' + app + '\\Security\\Trusted Locations\\Location99';
      if (this.docObj.Register.QueryStringValue(key, path, location) == null) {
        this.docObj.Register.SetStringValue(key, path, 'Path', location);
      }
    } catch (e) {
      this.logger.handeleException(e, '设置regedit出错');
      console.log('设置regedit出错', e);
    }
  };

  this.trustInit = function (location) {
    try {
      var i = 10;
      while (i <= 20) {
        this.setTrustLocation('Word', i + '.0', location);
        this.setTrustLocation('Excel', i + '.0', location);
        i++;
      }
    } catch (e) {
      this.logger.handeleException(e, 'trust init error');
      console.log('trustInit:', e);
    }
  };

  this.hookEnabled = function () {
    if (this.options.docType === Util.consts.docType.word) {
      this.docObj.Style.showToolSpace = true;
      this.docObj.SelectionInformationEnabled = false;
    }
    if (!Util.isIE()) {
      this.docObj.HookEnabled = false;
    }
  };

  this.initToolBar = function () {
    var toolbar = this.docObj.CustomToolbar;
    if (this.options.toolButtons != null && this.options.toolButtons.length) {
      if (this.options.enableReview) {
        var btnSaveIdx = -1;
        for (var i = 0; i < this.options.toolButtons.length; i++) {
          if (this.options.toolButtons[i].caption == '保存') {
            btnSaveIdx = i;
          }
        }
        if (btnSaveIdx != -1) {
          var showRevisionsBtn = new ToolButton('显示修订痕迹', '', '', 0, function (webOffice) {
            webOffice.showRevisions();
          });
          var hideRevisionsBtn = new ToolButton('隐藏修订痕迹', '', '', 0, function (webOffice) {
            webOffice.hideRevisions();
          });
          this.options.toolButtons.splice(btnSaveIdx + 1, 0, showRevisionsBtn, hideRevisionsBtn);
        }
      }
      for (var j = 0; j < this.options.toolButtons.length; j++) {
        var button = this.options.toolButtons[j];
        toolbar.addToolButton(j, button.caption, '', button.toolTip, button.style);
      }
    }
  };

  /**
   * 清除http参数并设置验证header 防止多次使用http.AddForm()后，参数缓存
   */
  this.clearHttp = function () {
    this.http.Clear();
    this.http.SetRequestHeader('Authorization', 'Bearer ' + this.token);
    try {
      this.http.SetRequestHeader('Referer', location.href);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * 显示隐藏工具栏
   * @param flag  true:显示 false:隐藏
   */
  this.setToolbarVisible = function (flag) {
    this.docObj.Style.ShowCustomToolbar = flag;
  };

  /**
   * 判断控件是否全屏状态
   */
  this.isFullScreen = function () {
    return this.docObj.FullSize === true;
  };

  /**
   * 文档是否有未保存的更改
   */
  this.hasUnSavedChange = function () {
    return !this.docObj.ActiveDocument.Saved;
  };

  /**
   * 新建空白文档
   */
  this.newEmptyFile = function () {
    switch (this.options.docType) {
      case Util.consts.docType.word:
        this.docObj.CreateNew('Word.Document');
        break;
      case Util.consts.docType.excel:
        this.docObj.CreateNew('Excel.Sheet');
        break;
      default:
        this.docObj.CreateNew('Word.Document');
        break;
    }
  };

  /**
   * 下载文件
   * @param url  请求地址
   * @param parameters 请求参数
   * @param fileName 保存文件名
   * @param httpMethod 访问方法 参见consts.httpType 0、get 1、post
   */
  this.downLoadFile = function (url, parameters, fileName, httpMethod, callback) {
    var localPath = '';
    if (Util.isNullOrWhiteSpace(fileName)) {
      //当前的编辑文档
      localPath = this.localTempPath + this.localTempFileName;
    } else {
      localPath = this.localTempPath + new Date().getTime() + '.' + fileName;
    }
    this.clearHttp();
    if (!Util.isNullOrWhiteSpace(parameters)) {
      for (var key in parameters) {
        if (parameters.hasOwnProperty(key)) {
          this.http.addForm(key, parameters[key]);
        }
      }
    }
    if (this.http.open(httpMethod, url, false)) {
      if (this.http.send()) {
        if (this.http.status === 200) {
          this.http.hidden = false;
          this.http.responseSaveToFile(localPath);
          // 传一个callback
          if (callback) {
            callback.call(this, { localFilePath: localPath, isSuccess: true });
          }
        } else {
          Util.showNoticeDialog(
            this.docObj,
            'downloadFile访问出错，错误信息：url:' + url + ',status:' + this.http.Status + ',errorText:' + this.http.StatusText
          );
        }
      } else {
        alert('加载文档出错');
      }
    } else {
      Util.showNoticeDialog(
        this.docObj,
        'downloadFile访问出错，错误信息：url:' + url + ',status:' + this.http.Status + ',errorText:' + this.http.ErrorText
      );
    }

    this.http.close();
  };

  /**
   * 上传文件-保存
    * @param url  请求的服务器处理地址
    * @param filePath 要上传的文件路径
    * @param parameters 请求参数
   */
  this.upLoadFile = function (url, parameters, filePath, callback) {
    //优先清空http信息，确保后续操作正常执行
    this.clearHttp();
    if (!Util.isNullOrWhiteSpace(parameters)) {
      for (var key in parameters) {
        if (parameters.hasOwnProperty(key)) {
          this.http.addForm(key, parameters[key]);
        }
      }
    }
    //拼装文件路径
    if (Util.isNullOrWhiteSpace(filePath)) {
      filePath = this.localTempPath + this.getNewTempFileName();
      this.saveToLocalPath(filePath);
    }
    this.http.AddFile('file', filePath);
    if (Util.getQueryString('isProduction')) {
      this.http.ShowProgressUI = true;
    } else {
      this.http.ShowProgressUI = false; // 设置false 调试不会卡死
    }
    if (this.http.Open(Util.consts.httpType.post, url, false)) {
      if (this.http.Send()) {
        var status = this.http.Status;
        if (status === 200) {
          //激发刷新列表消息
          this.refreshOpenner();
          // 传一个callback
          if (callback) {
            var result = JSON.parse(this.http.ResponseText.toString()).Data;
            callback.call(this, result);
          }
        } else {
          if (status === 401) {
            alert('请重新登录后再保存!\r\n建议先将文件导出到本地文件夹中。');
          } else {
            alert('文件保存失败，请稍后重试!\r\n建议先将文件导出到本地文件夹中。');
          }
        }
        console.log('status:' + status);
      }
      this.http.Close();
    } else {
      alert('网络错误，请稍后重试');
    }
  };

  this.refreshOpenner = function () {
    //激发刷新列表消息
    // if (window.opener) {
    //   PostMessage.send('webOffice', 'refresh', { modCode: this.options.moduleCode }, window.opener);
    // }
    if (window.opener) {
      if (window.opener && (window.hasOwnProperty('ActiveXObject') || 'ActiveXObject' in window)) {
        try {
          window.opener.appUtil.parentPostMessageFunProxy(JSON.stringify({ modCode: 'webOffice', msgt: 'refresh', data: { modCode: this.options.moduleCode } }));
        } catch (e) { }
      }
      window.opener.postMessage(JSON.stringify({ modCode: 'webOffice', msgt: 'refresh', data: { modCode: this.options.moduleCode } }), '*');
    }
    if (this.options.openerId) {
      var strUrl = 'http://127.0.0.1:9588/SendMsg?targetid=' + this.options.openerId + '$msg="refresh"';
      $.ajax({
        type: 'get',
        async: false,
        url: strUrl,
        jsonp: 'hookback',
        dataType: 'jsonp',
        success: function (/*data*/) { },
        error: function (/*a, b, c*/) { }
      });
    }
  };

  /**
   * 保存文件到指定路径
   * @param filePath  文件路径
   */
  this.saveToLocalPath = function (filePath) {
    if (Util.isOffice2003(this.docObj)) {
      this.docObj.Save(filePath);
    } else {
      var extension = Util.getFileExtension(filePath);
      this.docObj.Save(filePath, Util.consts.docTypeValue[extension], true);
    }
    return filePath;
  };

  /**
   * 保存当前文件
   */
  this.save = function () {
    var filePath = this.localTempPath + this.localTempFileName;
    return this.saveToLocalPath(filePath);
  };

  /**
   *  打开文件
   * @param filePath
   */
  this.openFile = function (filePath) {
    // 打开其他文件前，先关闭当前打开的文件。1、节约内存 2、套红后，控件当前打开的是“正文模板”，此时保存时，需要将内容保存至控件初始化时生成的文件里。若未关闭文件，就会因未关闭而导致无法保存
    this.closeFile();
    if (this.docObj.open(filePath) === 0) {
      this.docObj.ActiveDocument.Application.UserName = this.options.userName || '';
      return true;
    } else {
      Util.showNoticeDialog(this.docObj, '无法打开文件',
        function () {
          window.close();
        },
        this.docObj.FullSize
      );
    }
  };

  /**
   * 关闭文件
   */
  this.closeFile = function () {
    this.docObj.Close();
  };

  /**
   * 获取当前打开的文件全路径
   */
  this.getCurrentFilePath = function () {
    return this.localTempPath + this.localTempFileName;
  };

  /**
   * 导入文件
   */
  this.importFile = function () {
    if (this.options.docType === Util.consts.docType.word) {
      this.docObj.ShowDialog(Util.consts.dialogType.dialogOpen, 'Word File(*.doc;*.docx;*.wps)|*.doc;*.docx;*.wps||');
    } else if (this.options.docType === Util.consts.docType.excel) {
      this.docObj.ShowDialog(Util.consts.dialogType.dialogOpen, 'Execel File(*.xls;*.xlsx;*.et)|*.xls;*.xlsx;*.et||');
    } else if (this.options.docType === Util.consts.docType.ppt) {
      this.docObj.ShowDialog(Util.consts.dialogType.dialogOpen, 'PowerPoint File(*.ppt;*.pptx;*.dps)|*.ppt;*.pptx;*.dps||');
    } else {
      alert('不支持的文件类型: [' + this.options.docType + ']');
    }
  };

  /**
   * 打印预览
   */
  this.printPreview = function () {
    this.docObj.PrintPreview();
  };

  /**
   * 打印文件
   */
  this.print = function () {
    this.docObj.ShowDialog(Util.consts.dialogType.dialogPrint);
  };

  /**
   * 导出文件
   */
  this.exportFile = function () {
    this.docObj.ShowDialog(Util.consts.dialogType.dialogSaveAs);
  };

  /**
   * 添加书签
   * @param name 书签名
   * @param value 书签值
   */
  this.addBookmark = function (name, value) {
    if (this.docObj.ActiveDocument.BookMarks.Exists(name)) {
      // 判断是否存在该书签
      this.docObj.ActiveDocument.Bookmarks(name).Delete();
    }
    var len = value.length;
    // 插入内容
    this.docObj.ActiveDocument.Application.Selection.TypeText(value);
    this.docObj.ActiveDocument.Application.Selection.MoveLeft(1, len);
    var startIndex = this.docObj.ActiveDocument.Application.Selection.Start;
    var endIndex = this.docObj.ActiveDocument.Application.Selection.Start + len;
    this.docObj.ActiveDocument.Range(startIndex, endIndex).Select();
    // 添加书签
    this.docObj.ActiveDocument.Bookmarks.Add(name);
  };

  /**
   * 获取书签值
   * @param name 书签名
   */
  this.getBookMarkValue = function (name) {
    if (this.docObj.ActiveDocument.BookMarks.Exists(name)) {
      var bookMark = this.docObj.ActiveDocument.BookMarks.Item(name);
      return bookMark && bookMark.Range && bookMark.Range.Text;
    }
    return '';
  };

  /**
   * 设置书签值
   * @param name 书签名
   * @param value 书签值
   */
  this.setBookMarkValue = function (name, value) {
    if (this.docObj.ActiveDocument.BookMarks.Exists(name)) {
      this.docObj.ActiveDocument.BookMarks.Item(name).Range.Text = value;
    }
  };

  /**
   * 是否存在书签
   * @param name 书签名
   */
  this.isExistsBookMark = function (name) {
    return this.docObj.ActiveDocument.BookMarks.Exists(name);
  };

  /**
   * 删除书签
   * @param name 书签名
   */
  this.deleteBookMark = function (name) {
    if (this.isExistsBookMark(name)) {
      this.docObj.ActiveDocument.BookMarks(name).Range.Text = '';
      this.docObj.ActiveDocument.BookMarks(name).Delete();
    }
  };

  /**
   * 选中并跳转到书签
   * @param name 书签名
   */
  this.selectBookMark = function (name) {
    if (this.isExistsBookMark(name)) {
      this.docObj.ActiveDocument.BookMarks(name).Range.Select();
    }
  };

  /**
   * 保护文档  执行此操作后将锁定文档，文档不可进行编辑
   * @param password
   */
  this.protectFile = function (password) {
    password = password || '';
    if (this.options.docType === Util.consts.docType.word) {
      if (this.docObj.ActiveDocument.ProtectionType === -1) {
        this.docObj.ActiveDocument.Protect(3, false, password);
      }
    }
    if (this.options.docType === Util.consts.docType.excel) {
      if (!this.docObj.ActiveDocument.Application.Sheets(1).ProtectContents) {
        this.docObj.ActiveDocument.Application.Sheets(1).Protect(password);
      }
    }
  };

  /**
   * 解除保护文档  执行此操作后，文档将从锁定状态到可编辑状态
   * @param password
   */
  this.unProtectFile = function (password) {
    password = password || '';
    if (this.options.docType === Util.consts.docType.word && this.docObj.ActiveDocument.ProtectionType != -1) {
      this.docObj.ActiveDocument.Unprotect(password);
    }
    if (this.options.docType === Util.consts.docType.excel) {
      this.docObj.ActiveDocument.Application.Sheets(1).Unprotect(password);
    }
  };

  /**
   * 锁定修订  将word文件的“审阅=>修订“按钮置为灰色不可用，使后面操作者不能关闭修订，所有修订会被追踪
   * @param password 锁定密码
   */
  this.lockEdit = function (password) {
    password = password || '';
    if (this.options.docType === Util.consts.docType.word) {
      if (this.docObj.ActiveDocument.ProtectionType === -1) {
        this.docObj.ActiveDocument.Protect(0, false, password);
      }
    }
    if (this.options.docType === Util.consts.docType.excel) {
      if (!this.docObj.ActiveDocument.Application.Sheets(1).ProtectContents) {
        this.docObj.ActiveDocument.Application.Sheets(1).Protect(password);
      }
    }
  };

  /**
   * 解除锁定修订  修订按钮重新可用
   * @param password
   */
  this.unLockEdit = function (password) {
    password = password || '';
    if (this.options.docType === Util.consts.docType.word && this.docObj.ActiveDocument.ProtectionType != -1) {
      this.docObj.ActiveDocument.Unprotect(password);
    }
    if (this.options.docType === Util.consts.docType.excel) {
      this.docObj.ActiveDocument.Application.Sheets(1).Unprotect(password);
    }
  };

  /**
   * 接受所有修订
   */
  this.acceptAllRevisions = function () {
    try {
      this.docObj.Activate(true);
      if (this.docObj.ActiveDocument.Revisions.Count > 1) {
        this.docObj.ActiveDocument.Revisions.AcceptAll();
      }
    } catch (e) {
      this.logger.handeleException(e, '接收修订失败');
      console.log('接收修订失败：', e);
    }
  };

  /**
   * 显示痕迹
   */
  this.showRevisions = function () {
    try {
      this.docObj.ActiveDocument.ShowRevisions = true;
    } catch (e) {
      this.logger.handeleException(e, '调用显示痕迹失败');
      console.log('调用显示痕迹失败:', e);
    }
    // if (this.docObj.ActiveDocument && this.docObj.ActiveDocument.ProtectionType === -1) {
    //   this.docObj.ActiveDocument.ShowRevisions = true;
    // }
  };

  /**
   * 隐藏痕迹
   */
  this.hideRevisions = function () {
    try {
      this.docObj.ActiveDocument.ShowRevisions = false;
    } catch (e) {
      this.logger.handeleException(e, '调用隐藏痕迹失败');
      console.log('调用隐藏痕迹失败:', e);
    }

    // if (this.docObj.ActiveDocument && this.docObj.ActiveDocument.ProtectionType === -1) {
    //   this.docObj.ActiveDocument.ShowRevisions = false;
    // }
  };

  /**
   * 打开修订模式
   */
  this.trackRevisions = function () {
    if (this.docObj.ActiveDocument && this.docObj.ActiveDocument.ProtectionType === -1) {
      this.docObj.ActiveDocument.TrackRevisions = true;
      return true;
    }
    return false;
  };

  /**
   * 关闭修订模式
   */
  this.unTrackRevisions = function () {
    if (this.docObj.ActiveDocument && this.docObj.ActiveDocument.ProtectionType === -1) {
      this.docObj.ActiveDocument.TrackRevisions = false;
    }
  };

  /**
   * 插入图片到文档中
   * @param imgUrl 图片网络地址
   * @param bookMarkName 将图片插入书签对应的位置，为空时，插到光标处
   * @param imageName 图片名称
   */
  this.insertImage = function (imgUrl, bookMarkName) {
    this.downLoadFile(imgUrl, null, '图片', 0, function (result) {
      if (result.isSuccess) {
        if (this.isExistsBookMark(bookMarkName)) {
          this.docObj.ActiveDocument.Application.Selection.GoTo(-1, 0, 0, bookMarkName);
        }
        var image = this.docObj.ActiveDocument.Application.Selection.InlineShapes.AddPicture(result.localFilePath);
        // todo 如今后有必要再将WrapFormat.Type LockAnchor作为入参提供外部调用
        // 转为浮动型
        image = image.ConvertToShape();
        // 0:四周型  1：紧密型  2：穿越型环绕 3：浮于文字上方 4：上下型环绕 5：衬于文字下方  6：浮于文字上方
        image.WrapFormat.Type = 5;
        // 必须设置该属性为true，否则拖动图片时会导致word中文字排版错位
        image.LockAnchor = true;
      }
    });
  };

  /**
   * 将文档另存为pdf文件
   */
  this.saveAsPdf = function () {
    var filePath = '';
    if (this.options.docType === Util.consts.docType.word) {
      filePath = this.localTempPath + new Date().getTime().toString() + '.pdf';
      this.docObj.ActiveDocument.ExportAsFixedFormat(filePath, 17, false, 0, 0, 1, 1, 0, true, true, 0, true, true, true);
    }
    return filePath;
  };

  /**
   * 全屏切换
   */
  this.toggleFullScreen = function () {
    this.docObj.FullSize = !this.docObj.FullSize;
  };

  /**
   * 锁定文件
   */
  this.lockFile = function () {
    var result = null;
    this.clearHttp();
    this.http.addForm("modCode", this.options.moduleCode);
    this.http.addForm("id", this.options.id);
    if (this.http.open(Util.consts.httpType.post, this.options.lockUrl, false)) {
      if (this.http.send()) {
        if (this.http.status === 200) {
          this.http.hidden = false;
          result = JSON.parse(this.http.ResponseText.toString()).Data;
          if (!result.Success) {
            this.setToolbarVisible(false);
            Util.showNoticeDialog(
              this.docObj,
              '当前文件已由' + result.LockUserName + '锁定。如需编辑，请稍后刷新页面重试或联系' + result.LockUserName + '进行解锁。'
            );
          } else {
            this.locked = true;
          }
        }
      }
    }
    this.http.close();
  };

  /**
   *  解除文件锁定
   */
  this.unlockFile = function () {
    var continueFlag = true;
    var requestSend = false;
    var beginTime = new Date().getTime();
    while (continueFlag) {
      if (!requestSend) {
        this.clearHttp();
        this.http.addForm("modCode", this.options.moduleCode);
        this.http.addForm("id", this.options.id);
        if (this.http.open(Util.consts.httpType.post, this.options.unlockUrl, false)) {
          this.http.send();
          this.refreshOpenner();
          requestSend = true;
        }
      }
      // 保证2秒内能退出界面
      if (requestSend || new Date().getTime() - beginTime >= 2000) {
        continueFlag = false;
      }
    }
    this.http.close();
  };

  this.onCommand = function (index) {
    if (this.options.toolButtons != null && this.options.toolButtons.length) {
      var toolButton = this.options.toolButtons[index];
      toolButton.handler.call(this, this);
    }
  };

  /**
   * 文档控件准备退出前的回调
   */
  this.onQuit = function () {
    // 退出编辑状态时，主动解锁文件,释放独占权
    if (
      !Util.isUndefinedOrNull(this.options) &&
      this.options.editMode === Util.consts.editMode.editAndLock &&
      this.locked &&
      !Util.isZeroOrWhiteSpace(this.options.id)
    ) {
      this.unlockFile();
      this.docObj.Close();
    }
  };

  this.onSendEnd = function () { };
  /**
   * 显示文档控件
   */
  this.show = function () {
    $('#objectContainer').width('100%');
  };

  /**
   * 隐藏文档控件
   */
  this.hide = function () {
    $('#objectContainer').width(0);
  };
}

