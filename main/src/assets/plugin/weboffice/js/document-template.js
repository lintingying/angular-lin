// 公文模板编辑页
/**
 * 获取公文模板-文档信息
 */
function getDocumentTemplate() {
  $.ajax({
    method: 'POST',
    url: Util.getOrigin() + Util.parsePath('/api/document/template/getTemplateFileInfo', 0),
    data: JSON.stringify({
      templateId: Util.getQueryString('templateId'),
    }),
    success: function (result) {
      var file = result.Data;
      config.downloadUrl = Util.getOrigin() + Util.parsePath('/api/document/template/downloadTemplateFile', 0);
      config.uploadUrl = Util.getOrigin() + Util.parsePath('/api/document/template/saveTemplateFile', 0);
      config.moduleCode = 'Doc$Template';
      if (file) {
        config.id = file.Id;
        config.moduleCode = file.ModCode;
        config.objectId = file.ObjectId;
        config.fileExtension = file.Extension;
        config.caption = file.FileName + file.Extension;
        config.fileName = file.FileName + file.Extension;
      }
      // if (Util.getQueryString("rightType") === Util.consts.rightType.edit) {
      //   config.editMode = Util.consts.editMode.editAndLock;
      // }
      config.afterInitCallback = function (control) {
        // 非草稿状态下的草稿需要跟踪修订痕迹
        if (!Util.isNullOrWhiteSpace(config.id) && config.id !== '0') {
          control.trackRevisions();
          control.showRevisions();
        }
      };
      document.title = config.fileName;
      configDocumentTemplateButtons();
      initWebOffice();
    }
  });
}
/**
 * 公文模板工具栏按钮
 */
function configDocumentTemplateButtons() {
  config.toolButtons = [];
  config.toolButtons.push(
    new ToolButton('保存并退出', '', '', 0, function (control) {
      saveAndExit(control);
    })
  );
  config.toolButtons.push(
    new ToolButton('保存', '', '', 0, function (control) {
      save(control);
    })
  );
  config.toolButtons.push(
    new ToolButton('导入文档', '', '', 0, function (control) {
      control.importFile(control);
    })
  );
  config.toolButtons.push(
    new ToolButton('插入书签', '', '', 0, function (control) {
      insertBookmark(control);
    })
  );
  config.toolButtons.push(
    new ToolButton('打印', '', '', 0, function (control) {
      control.print();
    })
  );
  config.toolButtons.push(
    new ToolButton('切换全屏', '', '', 0, function (control) {
      control.toggleFullScreen();
    })
  );
  config.toolButtons.push(
    new ToolButton('关闭', '', '', 0, function (control) {
      commonClose(control);
    })
  );
}
/**
 * 保存
 */
function commonSave(control, callback) {
  var parameters = {
    templateId: Util.getQueryString('templateId'),
  };
  control.upLoadFile(control.options.uploadUrl, parameters, null, function (result) {
    if (callback) {
      callback(result);
    }
  });
}

/**
 * 公文模板工具栏-保存
 */
function save(control) {
  commonSave(control, function (fileInfo) {
    control.options.id = fileInfo.Id;
    control.options.caption = fileInfo.FileName;
    Util.showNoticeDialog(control.docObj, '保存成功');
  });
}

/**
 * 公文模板工具栏-保存并退出
 */
function saveAndExit(control) {
  commonSave(control, function (fileInfo) {
    control.options.id = fileInfo.Id;
    window.close();
  });
}

/**
  * 公文模板工具栏-插入书签
  */
function insertBookmark(control) {
  control.hide();

  // 动态生成“书签”列表
  $.ajax({
    method: 'POST',
    url: Util.getOrigin() + Util.parsePath('/api/document/bookmark/getList', 0),
    success: function (result) {
      var list = result.Data;
      var content = "";
      for (var i = 0; i < list.length; i++) {
        content += '<div class="bookmark-item" data-key="' + list[i].Key + '" data-value="' + list[i].Value + '">' + list[i].Value + '</div>';
      }

      var modal = new Modal();
      modal.open({
        title: '书签管理',
        content: content,
        footer: [
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

      // 分别绑定click事件
      $(".modal-container .modal-mask .modal .modal-content .bookmark-item").on("click", function () {
        modal.loading();
        control.addBookmark($(this).attr("data-key"), $(this).attr("data-value"));
        modal.close();
        control.show();
      });
    }
  });
}

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
            // control.unlockFile();
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
