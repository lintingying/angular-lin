// 通用附件编辑页
/**
 * 获取文档信息
 */
function getFile() {
  $.ajax({
    method: 'POST',
    url: Util.getOrigin() + Util.parsePath('/api/attachment/File/Get', 0),
    data: JSON.stringify({
      id: Util.getQueryString('id'),
      modCode: Util.getQueryString("moduleCode")
    }),
    success: function (result) {
      var file = result.Data;
      config.id = Util.getQueryString("id");
      config.moduleCode = Util.getQueryString("moduleCode");
      config.objectId = file.ObjectId;
      config.fileExtension = file.Extension;
      config.caption = file.FileName + file.Extension;
      config.fileName = file.FileName + file.Extension;
      if (Util.getQueryString("rightType") === Util.consts.rightType.edit) {
        config.editMode = Util.consts.editMode.editAndLock;
      }
      document.title = config.fileName;
      configButtons();
      initWebOffice();
    }
  });
}
/**
 * 默认工具栏按钮
 */
function configButtons() {
  var btnSaveAndExit = new ToolButton('保存退出', '', '', 0, function (control) {
    saveAndExit(control);
  });
  var btnSave = new ToolButton('保存', '', '', 0, function (control) {
    save(control);
  });
  var btnGeneratePdf = new ToolButton('生成PDF', '', '', 0, function (control) {
    generatePdf(control);
  });
  var btnExport = new ToolButton('导出文件', '', '', 0, function (control) {
    control.exportFile();
  });
  var btnPrintPreview = new ToolButton('打印预览', '', '', 0, function (control) {
    control.printPreview();
  });
  var btnPrint = new ToolButton('打印', '', '', 0, function (control) {
    control.print();
  });
  var btnClose = new ToolButton('关闭', '', '', 0, function (control) {
    commonClose(control);
  });

  // 根据权限配置按钮  ---0、只读 1、可修改
  if (Util.getQueryString("rightType") === Util.consts.rightType.readonly) {
    config.toolButtons.push(btnPrintPreview);
    config.toolButtons.push(btnPrint);
    config.toolButtons.push(btnClose);
  } else {
    config.toolButtons.push(btnSaveAndExit);
    config.toolButtons.push(btnSave);
    if (Util.isWordFile(config.fileExtension)) {
      config.toolButtons.push(btnGeneratePdf);
    }
    config.toolButtons.push(btnExport);
    config.toolButtons.push(btnPrintPreview);
    config.toolButtons.push(btnPrint);
    config.toolButtons.push(btnClose);
  }
}

/**
 * 保存
 */
function commonSave(control, callback) {
  var parameters = {
    modCode: control.options.moduleCode,
    id: control.options.id
  };
  control.upLoadFile(control.options.uploadUrl, parameters, null, function () {
    if (callback) {
      callback();
    }
  });
}

/**
 * 默认工具栏-保存
 */
function save(control) {
  commonSave(control, function () {
    Util.showNoticeDialog(control.docObj, '保存成功');
  });
}

/**
 * 默认工具栏-保存并退出
 */
function saveAndExit(control) {
  commonSave(control, function () {
    window.close();
  });
}

/**
 * 默认工具栏-生成pdf文件
 */
function generatePdf(control) {
  control.unLockEdit();
  control.protectFile();
  control.save();
  var filePath = control.saveAsPdf();
  var parameters = {
    modCode: control.options.moduleCode,
    id: control.options.id,
    objectId: control.options.objectId
  };
  // filePath = filePath.replace('\\\\', '\\');
  control.upLoadFile(control.options.generatePdfUrl, parameters, filePath, function () {
    Util.showNoticeDialog(control.docObj, '已将PDF导出到附件列表。');
  });
}

/**
 * 默认工具栏-关闭
 */
function commonClose(control) {
  if (control.hasUnSavedChange()) {
    var isNowFullScreen = control.isFullScreen();

    if (isNowFullScreen) {
      control.toggleFullScreen();
    }
    control.hide();
    var modal = new Modal();
    modal.open({
      title: '提示',
      content: '是否保存更改？',
      footer: [
        {
          text: '保存',
          className: 'button primary-btn',
          callback: function () {
            saveAndExit(control);
          }
        },
        {
          text: '不保存',
          className: 'button',
          callback: function () {
            window.close();
          }
        },
        {
          text: '取消',
          className: 'button',
          callback: function () {
            modal.close();
            control.show();
          }
        }
      ],
      close: function () {
        modal.close();
        control.show();
      }
    });
  } else {
    window.close();
  }
}

