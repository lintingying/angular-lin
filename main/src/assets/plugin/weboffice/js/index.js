// $(window).resize(function () {
//   $('#objectContainer').width('100%');
//   $('body').css('height', $(window).height());
// });

$(document).ready(function () {
  // 兼容ie8  100vh不起作用
  $('body').css('height', $(window).height());
});

// 设置全局ajax
$.ajaxSetup({
  // cache: false, // 缓存页面
  contentType: "application/json;charset=UTF-8",
  beforeSend: function (request) {
    request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    request.setRequestHeader("Authorization", "Bearer " + Util.getQueryString("access_token"));
  },
  error: function (err) {
    console.log(err);
  }
});

var config = window.config = new WebOfficeConfig();

if (Util.getQueryString("processId")) {
  loadScript('js/document-file.js?v=' + version, function () {
    getWorkflowDetail();
  });
} else if (Util.getQueryString("templateId")) {
  loadScript('js/document-template.js?v=' + version, function () {
    getDocumentTemplate();
  });
} else {
  loadScript('js/custom-file.js?v=' + version, function () {
    getFile();
  });
}

/**
 * 初始化webOffice
 */
function initWebOffice() {
  $.ajax({
    method: "POST",
    url: Util.getOrigin() + Util.parsePath("/api/attachment/WebOffice/getConfig", 0),
    success: function (result) {
      handleConfig(result.Data);
    }
  });
}

function handleConfig(info) {
  config.protectSecret = info.ProtectSecret;
  config.userId = info.CurrentUserId;
  config.userName = info.CurrentUserName;
  config.openerId = Util.getQueryString('openerId');
  config.showTitleBar = info.ShowTitleBar;
  config.enableReview = info.EnableReview;

  if (Util.getQueryString('preview') == 'true') {
    getAttachmentOptions();
  } else {
    $('#objectContainer').append(getObjectConfig(info.License, info.Version));
    notSuttport();
    var docObjElement = document.getElementById('iWebOffice');
    if (!Util.isUndefinedOrNull(docObjElement)) {
      var webOffice = window.webOffice = new WebOffice(config, docObjElement, Util.getQueryString('access_token'));
      $('#objectContainer').append(getScript());
      webOffice.initSkin();
      webOffice.init();
    } else {
      console.log('文档控件尚未初始化');
    }
  }
}

/**
 * 获取附件配置-AttachmentOptions
 */
function getAttachmentOptions() {
  $.ajax({
    method: "POST",
    url: Util.getOrigin() + Util.parsePath("/api/attachment/File/GetAttachmentOptions", 0),
    success: function (result) {
      handleAttachmentOptions(result.Data);
    }
  });
}

function handleAttachmentOptions(info) {
  config.previewUrl = info.PreviewUrl;
  if (Util.isNullOrWhiteSpace(info.VirtualDomain)) {
    config.virtualDomain = Util.getOrigin();
  } else {
    var origin;
    //1.VirtualDomain仅配置了域名，此处需要自动补上端口号
    if (!Util.isNullOrWhiteSpace(window.location.port)) {
      origin = info.VirtualDomain + ':' + window.location.port;
    } else {
      origin = info.VirtualDomain;
    }

    //2.补充协议头
    if (origin.indexOf('://') === -1) {
      origin = window.location.protocol + '//' + origin;
    }
    config.virtualDomain = origin;
    filePreview();
  }
}

function filePreview() {
  Util.showNoticeDialog(config.docObj, '正在进入文件阅读模式,请稍候...');
  var token = Util.getQueryString('access_token');
  var fileSrc = config.virtualDomain + "/api/attachment/file/preview?id=" + config.id + "&modCode=" + config.moduleCode + "&hash=" + config.hash + "&access_token" + token;
  var targetUrl = config.previewUrl + "?src=" + encodeURIComponent(fileSrc);
  $('#previewiframe').attr('src', targetUrl);
  $('#previewiframe').css('display', 'block');
}

function getObjectConfig(copyRight, version) {
  var browserInfo = Util.getBrowserInfo();
  var cabVersion = Util.isZeroOrWhiteSpace(version) ? 'iWebOffice2015.cab#version=12,8,0,940' : 'iWebOffice2015_premium.cab#version=12,8,0,940';
  var objectConfig = '<object id="iWebOffice" width="100%" height="100%"';
  if (window.ActiveXObject !== undefined || window.ActiveXObject != null || 'ActiveXObject' in window) {
    if (window.navigator.platform === 'Win32') {
      objectConfig += 'CLASSID="CLSID:D89F482C-5045-4DB5-8C53-D2C9EE71D025"  codebase="../assets/setup/iWebOffice2015/' + cabVersion;
    }

    if (window.navigator.platform === 'Win64') {
      objectConfig += 'CLASSID="CLSID:D89F482C-5045-4DB5-8C53-D2C9EE71D024"  codebase="../assets/setup/iWebOffice2015/' + cabVersion;
    }
    objectConfig += '">';
    objectConfig += '<param name="Copyright" value="' + copyRight + '">';
  } else if (browserInfo.browser === 'chrome') {
    objectConfig += ' clsid="CLSID:D89F482C-5045-4DB5-8C53-D2C9EE71D025"';
    objectConfig += ' type="application/kg-plugin"';
    objectConfig += ' OnReady="OnReady"';
    objectConfig += ' OnCommand="OnCommand"';
    objectConfig += ' OnRightClickedWhenAnnotate="OnRightClickedWhenAnnotate"';
    objectConfig += ' OnSending="OnSending"';
    objectConfig += ' OnSendEnd="OnSendEnd"';
    objectConfig += ' OnRecvStart="OnRecvStart"';
    objectConfig += ' OnRecving="OnRecving"';
    objectConfig += ' OnRecvEnd="OnRecvEnd"';
    objectConfig += ' OnFullSizeBefore="OnFullSizeBefore"';
    objectConfig += ' OnFullSizeAfter="OnFullSizeAfter"';
    objectConfig += ' Copyright="' + copyRight + '"';
    objectConfig += '>';
  } else if (browserInfo.browser === 'firefox') {
    objectConfig += ' clsid="CLSID:D89F482C-5045-4DB5-8C53-D2C9EE71D025"';
    objectConfig += ' type="application/kg-activex"';
    objectConfig += ' OnCommand="OnCommand"';
    objectConfig += ' OnReady="OnReady"';
    objectConfig += ' OnOLECommand="OnOLECommand"';
    objectConfig += ' OnExecuteScripted="OnExecuteScripted"';
    objectConfig += ' OnQuit="OnQuit"';
    objectConfig += ' OnSendStart="OnSendStart"';
    objectConfig += ' OnSending="OnSending"';
    objectConfig += ' OnSendEnd="OnSendEnd"';
    objectConfig += ' OnRecvStart="OnRecvStart"';
    objectConfig += ' OnRecving="OnRecving"';
    objectConfig += ' OnRecvEnd="OnRecvEnd"';
    objectConfig += ' OnRightClickedWhenAnnotate="OnRightClickedWhenAnnotate"';
    objectConfig += ' OnFullSizeBefore="OnFullSizeBefore"';
    objectConfig += ' OnFullSizeAfter="OnFullSizeAfter"';
    objectConfig += ' Copyright="' + copyRight + '"';
    objectConfig += '>';
  }
  objectConfig += '</object>';
  return objectConfig;
}

function notSuttport() {
  var browserInfo = Util.getBrowserInfo();
  var browser;
  var version;
  if (browserInfo.browser) {
    browser = browserInfo.browser;
    version = browserInfo.version;
  }
  if ((window.ActiveXObject != undefined) || (window.ActiveXObject != null) || "ActiveXObject" in window) {

  } else {
    if (browser == "firefox") {
      if (version < "52") {
        var fireFoxType = navigator.mimeTypes["application/kg-activex"];
        if (fireFoxType == undefined) {
          document.getElementById("iWebOffice").width = "1px";
          var str = '<div width="100%" height="100%" style="text-align:center; color: red;font-size:30px;" >该插件不受支持</br>点击跳转解决方案</div>';
          var t = document.getElementById("objectContainer");
          t.innerHTML = t.innerText + str;
        }
      } else {
        document.getElementById("iWebOffice").width = "1px";
        var str = '<div width="100%" height="100%" style="text-align:center;color: red;font-size:30px;" >该插件不受支持</br>请更换52版本以下的FireFox浏览器</div>';
        var t = document.getElementById("objectContainer");
        t.innerHTML = t.innerText + str;
      }
    } else if (browser == "chrome") {
      var kgchromeType = navigator.mimeTypes["application/kg-plugin"]; //高级版
      var chromeType = navigator.mimeTypes["application/kg-activex"]; //标准版
      var oldChromeType = navigator.mimeTypes["application/iWebPlugin"]; //早期淘汰版本
      if (document.getElementById("iWebOffice").type == "application/kg-plugin") {
        if (kgchromeType == undefined) {
          document.getElementById("iWebOffice").width = "1px";
          var str = '<div width="100%" height="100%" style="text-align:center; color: red;font-size:30px;" >该插件不受支持</br>引用的是高级版控件</br></div>';
          var t = document.getElementById("objectContainer");
          t.innerHTML = t.innerText + str;
          //window.open("Faq002.html");
        }
      } else {
        if (version > "45") {
          if (chromeType == undefined || oldChromeType == undefined) {
            document.getElementById("iWebOffice").width = "1px";
            var str = '<div width="100%" height="100%" style="text-align:center;color: red;font-size:30px;" >该插件不受支持</br>引用的是标准版控件</br></div>';
            var t = document.getElementById("objectContainer");
            t.innerHTML = t.innerText + str;
          }
        } else {
          document.getElementById("iWebOffice").width = "1px";
          var str = '<div width="100%" height="100%" style="text-align:center;color: red;font-size:30px;" >标准版插件不受支持</br>请更换45版本以下的Chrome浏览器</br>如果需要使用高版本Chrome浏览器,需集成高级版插件</div>';
          var t = document.getElementById("objectContainer");
          t.innerHTML = t.innerText + str;
        }
      }
    }
  }
}

function getScript() {
  var script = '<script type="text/javascript">function OnCommand(index) {webOffice.onCommand(index);}function OnSendEnd() {webOffice.onSendEnd();}function OnQuit() {webOffice.onQuit();}function OnBeforeKGBrowserClosed(){webOffice.onQuit();return true;}</script>';
  if (Util.isIE()) {
    script += '<script language=JScript>function iWebOffice::OnCommand(index){webOffice.onCommand(index);}function iWebOffice::OnQuit(){webOffice.onQuit();}function OnBeforeKGBrowserClosed(){webOffice.onQuit();return true;}</script>';
  }
  return script;
}

