// 公文流程附件编辑页
/**
 * 获取流程detail
 */
function getWorkflowDetail() {
  $.ajax({
    method: 'POST',
    url: Util.getOrigin() + Util.parsePath('/api/workflow/FlowMan/GetDetail', 0),
    data: JSON.stringify({
      processId: Util.getQueryString("processId"),
      notificationId: null,
      relatedId: null,
      processTodoId: null,
      versionId: null,
      templateId: null,
      isDraft: Util.getQueryString("isDraft"),
      isMonitor: null,
      moduleCode: null,
      objectId: null,
      isContinue: null,
      isAnonymous: false
    }),
    success: function (result) {
      config.processDetail = result.Data;
      config.moduleCode = result.Data.AttModCode;
      config.taskId = result.Data.AttObjectId;
      config.workflowTemplateId = result.Data.TemplateId;
      getDocumentFile(result.Data.AttObjectId);
    }
  });
}

/**
 * 获取公文附件信息
 */
function getDocumentFile(taskId) {
  $.ajax({
    method: 'POST',
    url: Util.getOrigin() + Util.parsePath('/api/document/taskProcess/getLetterInfo', 0),
    data: JSON.stringify({
      taskId: taskId
    }),
    success: function (result) {
      var file = result.Data;
      config.downloadUrl = Util.getOrigin() + Util.parsePath("/api/document/taskProcess/downloadLetter", 0);
      config.uploadUrl = Util.getOrigin() + Util.parsePath("/api/document/taskProcess/saveLetter", 0);
      config.generatePdfUrl = Util.getOrigin() + Util.parsePath('/api/document/taskProcess/generatePdf', 0);
      config.id = file.Id;
      config.objectId = file.ObjectId;
      config.fileExtension = file.Extension;
      config.caption = file.FileName + file.Extension;
      config.fileName = file.FileName + file.Extension;
      if (Util.isCurrentHandler(config.processDetail)) {
        config.editMode = Util.consts.editMode.editAndLock;
      }
      document.title = config.fileName;
      getRelatedTplByWorkflowTplId(1);
      getRelatedTplByWorkflowTplId(2);
      getDocumentSetting();
    }
  });
}

/**
 * 获取模板 type=1正文模板 type=2草稿模板
 */
function getRelatedTplByWorkflowTplId(typeTml) {
  $.ajax({
    method: 'POST',
    url: Util.getOrigin() + Util.parsePath('/api/document/template/getRelatedTplByWorkflowTplId', 0),
    data: JSON.stringify({
      id: config.processDetail.TemplateId,
      type: typeTml
    }),
    success: function (result) {
      if (typeTml === 1) {
        config.decorateTemplate = result.Data;
      }
      if (typeTml === 2) {
        config.template = result.Data;
      }
    }
  });
}

/**
 * 获取公文模块设置项--生成公文文稿工具栏按钮
 */
function getDocumentSetting() {
  $.ajax({
    method: 'POST',
    url: Util.getOrigin() + Util.parsePath('/api/Cache/SystemProfile/GetList', 0),
    data: JSON.stringify({
      moduleCode: 'Document'
    }),
    success: function (result) {
      config.documentSettings = result.Data;

      config.afterInitCallback = function (control) {
        // 非草稿状态下的草稿需要跟踪修订痕迹
        if (!Util.isDraftState(config.processDetail)) {
          control.trackRevisions();
          // 根据配置项设置默认是否显示修订痕迹
          if (Util.getSystemProfileByCode(config.documentSettings, 'DocShowTrace') === "true") {
            control.showRevisions();
          } else {
            control.hideRevisions();
          }
        } else {
          // 如果是还未保存过文稿
          if (Util.isZeroOrWhiteSpace(control.options.id)) {
            // 拟稿时 只有一个模板时自动导入
            if (control.template.length === 1 && !Util.isZeroOrWhiteSpace(control.template[0].FileId)) {
              importByTmp(control, control.template[0].FileId);
            } else if (control.template.length > 1) {
              importTemplate(control);
            }
          }
        }
      };
      configDocumentButtons();
      initWebOffice();
    }
  });
}
/**
 * 公文文稿工具栏按钮
 */
function configDocumentButtons() {
  var btnImportTemplate = new ToolButton('导入模板', '', '', 0, function (control) {
    importTemplate(control);
  });
  var btnImportFile = new ToolButton('导入文件', '', '', 0, function (control) {
    control.importFile();
  });
  var btnSave = new ToolButton('保存', '', '', 0, function (control) {
    save(control);
  });
  var btnDecorate = new ToolButton('套红', '', '', 0, function (control) {
    changeNormal(control);
  });
  var btnInsertBarcode = new ToolButton('插入条码', '', '', 0, function (control) {
    insertPdf417(control);
  });
  var btnSeal = new ToolButton('盖章', '', '', 0, function (control) {
    seal(control);
  });
  var btnGeneratePdf = new ToolButton('生成PDF', '', '', 0, function (control) {
    generatePdfFromDocument(control);
  });
  var btnExportFile = new ToolButton('导出文件', '', '', 0, function (control) {
    control.exportFile();
  });
  var btnPrintPreview = new ToolButton('打印预览', '', '', 0, function (control) {
    control.printPreview();
  });
  var btnPrint = new ToolButton('打印', '', '', 0, function (control) {
    control.print();
  });
  var btnToggleFullScreen = new ToolButton('全屏切换', '', '', 0, function (control) {
    control.toggleFullScreen();
  });
  var btnUnProtected = new ToolButton('解除保护', '', '', 0, function (control) {
    unProtectFile(control);
  });
  var btnClose = new ToolButton('关闭文件', '', '', 0, function (control) {
    commonClose(control);
  });

  // 如果存在ProcessTodoId，则表明当前登录用户是该步骤处理人，当前步骤处理人或草稿状态才能看到配置的按钮
  if (Util.isCurrentHandler(config.processDetail) || Util.isDraftState(config.processDetail)) {
    // 从流程编码中解析出文档控件的按钮集合
    var codes = config.processDetail.ActivityCode.split(',');
    // 文稿编辑模式：在本窗口打开-屏蔽‘关闭文件’按钮
    if (!(Util.getQueryString('isCurWindow') && Util.getQueryString('isCurWindow') == 'true')) {
      codes.push('Close');
    }
    if (!Util.IsNullOrEmpty(codes)) {
      for (var i = 0; i < codes.length; i++) {
        switch (codes[i]) {
          case 'ImportTemplate':
            config.toolButtons.push(btnImportTemplate);
            break;
          case 'ImportFile':
            config.toolButtons.push(btnImportFile);
            break;
          case 'Save':
            config.toolButtons.push(btnSave);
            break;
          case 'Decorate':
            config.toolButtons.push(btnDecorate);
            break;
          case 'InsertBarcode':
            config.toolButtons.push(btnInsertBarcode);
            break;
          case 'Seal':
            config.toolButtons.push(btnSeal);
            break;
          case 'GeneratePdf':
            config.toolButtons.push(btnGeneratePdf);
            break;
          case 'ExportFile':
            config.toolButtons.push(btnExportFile);
            break;
          case 'PrintPreview':
            config.toolButtons.push(btnPrintPreview);
            break;
          case 'Print':
            config.toolButtons.push(btnPrint);
            break;
          case 'ToggleFullScreen':
            config.toolButtons.push(btnToggleFullScreen);
            break;
          case 'UnProtected':
            config.toolButtons.push(btnUnProtected);
            break;
          case 'Close':
            config.toolButtons.push(btnClose);
            break;
        }
      }
    }
  }
}

/**
 * 保存
 */
function commonSave(control, callback) {
  var parameters = {
    taskId: control.options.taskId,
    fileName: control.options.fileName
  };
  control.upLoadFile(control.options.uploadUrl, parameters, null, function (letterInfo) {
    control.options.id = letterInfo.Id;
    control.options.caption = letterInfo.FileName + letterInfo.Extension;
    control.options.fileName = letterInfo.FileName + letterInfo.Extension;
    if (callback) {
      callback();
    }
  });
}
/**
 * 公文文稿工具栏-保存
 */
function save(control) {
  commonSave(control, function () {
    Util.showNoticeDialog(control.docObj, '保存成功');
  });
}
/**
 * 公文文稿工具栏-生成PDF
 */
function generatePdfFromDocument(control) {
  control.unLockEdit();
  control.protectFile();
  control.save();

  var parameters = {
    taskId: control.options.taskId,
    fileName: control.options.fileName
  };
  control.upLoadFile(control.options.uploadUrl, parameters, null, function (letterInfo) {
    control.options.id = letterInfo.Id;
    control.options.caption = letterInfo.FileName + letterInfo.Extension;
    control.options.fileName = letterInfo.FileName + letterInfo.Extension;

    var filePath = control.saveAsPdf();
    var param = { taskId: control.options.taskId };
    control.upLoadFile(control.options.generatePdfUrl, param, filePath, function () {
      // 生成pdf后是否删除“正文”文件
      if (Util.getSystemProfileByCode(config.documentSettings, 'RmLetterAfterGenPdf')) {
        removeLetter(control);
      } else {
        Util.showNoticeDialog(control.docObj, '已将PDF导出到附件列表。');
      }
    });
  });
}

/**
 * 删除“正文”文件
 */
function removeLetter(control) {
  $.ajax({
    method: 'POST',
    url: Util.getOrigin() + Util.parsePath('/api/document/taskProcess/removeLetter', 0),
    data: JSON.stringify({
      taskId: control.options.taskId
    }),
    success: function (result) {
      control.setToolbarVisible(false);
      control.refreshOpenner();
      Util.showNoticeDialog(control.docObj, '已将PDF导出到附件列表。');
    }
  });
}

/**
 * 导入模板---草稿模板
 */
function importTemplate(control) {
  var isNowFullScreen = control.isFullScreen();
  if (isNowFullScreen) {
    control.toggleFullScreen();
  }

  if (control.options.template.length === 1) {
    importByTmp(control, control.options.template[0].FileId);
    if (isNowFullScreen) {
      control.toggleFullScreen();
    }
  } else {
    control.hide();
    var modal = new Modal();
    modal.open({
      content: createTemplatePicker(control.options.workflowTemplateId, control.options.template, 2),
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
    $(".modal-container .modal-mask .modal .modal-content .template-item").on("click", function () {
      modal.loading();
      importByTmp(control, $(this).attr("data-fileid"));
      if (isNowFullScreen) {
        control.toggleFullScreen();
      }
      modal.close();
      control.show();
    });
  }
}
/**
 * 套书签
 */
function getBookmarkData(control) {
  $.ajax({
    method: 'POST',
    url: Util.getOrigin() + Util.parsePath('/api/document/taskProcess/getBookmarkData', 0),
    data: JSON.stringify({
      taskId: control.options.taskId
    }),
    success: function (result) {
      for (var key in result.Data) {
        if (result.Data.hasOwnProperty(key)) {
          var value = result.Data[key];
          if (key != 'Letter') {
            control.setBookMarkValue(key, value);
          }
        }
      }
    }
  });
}
/**
 * 导入一个草稿模板
 */
function importByTmp(control, id) {
  control.closeFile();
  var parameters = { id: id };
  control.downLoadFile(Util.getOrigin() + Util.parsePath('/api/document/template/downloadTemplateFile', 0), parameters, 'temp_草稿模板.doc', 1, function (result) {
    if (result.isSuccess) {
      control.openFile(result.localFilePath);
      control.hideRevisions();
      getBookmarkData(control);
    }
  });
}

/**
 * 动态生成模板数组的HTML
 * @param {*} workflowTemplateId 流程实例模板id
 * @param {*} tpls 模板数组
 * @param {*} typeTml type=1正文模板 type=2草稿模板
 * @returns
 */
function createTemplatePicker(workflowTemplateId, tpls, typeTml) {
  if (tpls.length === 0) {
    $.ajax({
      method: 'POST',
      url: Util.getOrigin() + Util.parsePath('/api/document/template/getRelatedTplByWorkflowTplId', 0),
      data: JSON.stringify({
        id: workflowTemplateId,
        type: typeTml
      }),
      success: function (result) {
        tpls = result.Data;
        var html = "";
        for (var i = 0; i < tpls.length; i++) {
          html += '<div class="template-item" data-fileid="' + tpls[i].FileId + '">' + tpls[i].Name + '</div>';
        }
        return html;
      }
    });
  } else {
    var html = "";
    for (var i = 0; i < tpls.length; i++) {
      html += '<div class="template-item" data-fileid="' + tpls[i].FileId + '">' + tpls[i].Name + '</div>';
    }
    return html;
  }
}

/**
 * 套红 -导入正文模板
 */
function changeNormal(control) {
  // 1、获取书签键值对
  // 2、 this.downLoadFile('/api/document/taskProcess/downloadTemplate,parameters,'公文正文模板')
  // 3、copy当前文稿的正文内容
  // 4、打开公文正文模板，将正文内容paste到正文书签，替换其他书签值

  var isNowFullScreen = control.isFullScreen();

  var parameters = {
    taskId: control.options.taskId,
    fileName: control.options.fileName
  };
  control.upLoadFile(control.options.uploadUrl, parameters, null, function (letterInfo) {
    control.options.id = letterInfo.Id;
    control.options.caption = letterInfo.FileName + letterInfo.Extension;
    control.options.fileName = letterInfo.FileName + letterInfo.Extension;

    if (isNowFullScreen) {
      control.toggleFullScreen();
    }

    if (control.options.decorateTemplate.length === 1) {
      importDecorate(control, control.options.decorateTemplate[0].FileId);

      if (isNowFullScreen) {
        control.toggleFullScreen();
      }
    } else {
      control.hide();
      var modal = new Modal();
      modal.open({
        content: createTemplatePicker(control.options.workflowTemplateId, control.options.decorateTemplate, 1),
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
      $(".modal-container .modal-mask .modal .modal-content .template-item").on("click", function () {
        modal.loading();
        importDecorate(control, $(this).attr("data-fileid"));
        if (isNowFullScreen) {
          control.toggleFullScreen();
        }
        modal.close();
        control.show();
      });

    }
  });
}

/**
 * 套红--导入一个正文模板
 */
function importDecorate(control, id) {
  control.closeFile();
  var downloadDraftParameters = { taskId: control.options.taskId };
  control.downLoadFile(Util.getOrigin() + Util.parsePath('/api/document/taskProcess/downloadDraftLetter', 0), downloadDraftParameters, 'temp_套红草稿.doc', 1, function (downloadDraftResult) {
    if (downloadDraftResult.isSuccess) {
      var draftPath = downloadDraftResult.localFilePath;
      var downloadTemplateParameters = { id: id };
      control.downLoadFile(Util.getOrigin() + Util.parsePath('/api/document/template/downloadTemplateFile', 0), downloadTemplateParameters, 'temp_正文模板.doc', 1, function (templateResult) {
        if (templateResult.isSuccess) {
          control.openFile(draftPath);
          // 修订状态下，如果执行copy时，被copy的区域为删除状态时，会出错。所以这里先接受所有修订
          control.acceptAllRevisions();
          // 复制正文内容
          var draftLetterMark = control.isExistsBookMark('Letter') ? control.docObj.ActiveDocument.BookMarks('Letter').Range : null;
          if (draftLetterMark != null) {
            draftLetterMark.Copy();
          }
          control.openFile(templateResult.localFilePath);
          var letterMark = control.isExistsBookMark('Letter') ? control.docObj.ActiveDocument.BookMarks('Letter').Range : null;
          if (letterMark != null) {
            if (draftLetterMark != null) {
              letterMark.Select();
              letterMark.Paste();
            } else {
              control.docObj.ActiveDocument.BookMarks('Letter').Range.InsertFile(draftPath);
            }
          }

          // 套书签
          getBookmarkData(control);

          var saveFormalParameters = {
            taskId: control.options.taskId,
            fileName: control.options.fileName
          };
          control.upLoadFile(Util.getOrigin() + Util.parsePath('/api/document/taskProcess/changeNormal', 0), saveFormalParameters, templateResult.localFilePath, function (uploadResult) {
            control.options.id = uploadResult.Id;
            control.options.caption = uploadResult.FileName + uploadResult.Extension;
            control.options.fileName = uploadResult.FileName + uploadResult.Extension;
            control.hideRevisions();
            Util.showNoticeDialog(control.docObj, '套红成功!');
          });
        } else {
          Util.showNoticeDialog(control.docObj, '下载套红模板失败，请刷新页面重试');
        }
      });
    } else {
      Util.showNoticeDialog(control.docObj, '下载草稿模板错误，请刷新页面后重试');
    }
  });
}

/**
 * 插入条码
 */
function insertPdf417(control) {
  // this.insertImage('https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=515252619,840408453&fm=27&gp=0.jpg');
  control.insertImage(Util.getOrigin() + Util.parsePath('/api/Document/TaskProcess/GetPdf417Barcode', 0) + '?processId=' + control.options.taskId + '&access_token=' + control.token);
}

/**
 * 盖章
 */
function seal(control) {
  // this.insertImage('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1511516460&di=e6d23736f291bcebfcbfe035cd9400b1&imgtype=jpg&er=1&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F15%2F50%2F91%2F72J58PICbGD_1024.jpg');

  var isNowFullScreen = control.isFullScreen();

  if (isNowFullScreen) {
    control.toggleFullScreen();
  }
  control.hide();

  // 动态生成“印章”列表
  $.ajax({
    method: 'POST',
    url: Util.getOrigin() + Util.parsePath('/api/document/seal/getSealsByUserId', 0),
    success: function (result) {
      var imgs = result.Data;
      var content = "";
      for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
        img.Src = Util.getOrigin() + Util.parsePath('/api/attachment/file/imageByObjectId', 0) + '?objectId=' + img.Id + '&modCode=Doc$Seal&access_token=' + control.token;
        content += '<img src="' + img.Src + '" class="seal-item" data-imgid="' + img.Id + '" title="' + img.Name + '" width="160px" height="160px" />';
      }

      var other = '<div class="seal-password" style="display: none;">';
      other += '<label>印章密码:</label>';
      other += '<input class="password-input" name="password-input" type="password" placeholder="请输入" />';
      other += '</div>';

      var modal = new Modal();
      modal.open({
        content: content,
        other: other,
        footer: [
          {
            text: '确定',
            className: 'button primary-btn',
            callback: function () {
              confirmSeal(control, modal);
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

      // 分别绑定click事件
      $(".modal-container .modal-mask .modal .modal-content .seal-item").on("click", function () {
        // 显示密码输入框
        $('.modal-container .modal-mask .modal .modal-other .seal-password').css('display', 'block');
        // 清除所有类seal-active
        $(".modal-container .modal-mask .modal .modal-content img").removeClass("seal-active");
        // 将点击的img添加类seal-active
        $(this).addClass('seal-active');
      });
    }
  });
}
/**
 * 盖章-输入密码后点击确认
 */
function confirmSeal(control, modal) {
  $.ajax({
    method: 'POST',
    url: Util.getOrigin() + Util.parsePath('/api/document/seal/validatePassword', 0),
    data: JSON.stringify({
      id: $('.seal-active').attr("data-imgid"),
      password: $('.password-input').val()
    }),
    success: function (result) {
      if (result.Data) {
        // hack:这里先需要先调用show()让文档控件处于可见状态，否则insertImage()会报错
        control.show();
        control.insertImage($('.seal-active').attr("src"));
        var isNowFullScreen = control.isFullScreen();
        if (isNowFullScreen) {
          control.toggleFullScreen();
        }
        modal.close();
        control.show();
      } else {
        Util.showNoticeDialog(control.docObj, '密码错误');
        $('.password-input').val('');
      }
    }
  });
}
/**
 * 解除保护
 */
function unProtectFile(control) {
  control.unProtectFile();
  commonSave(control);
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
            commonSave(control, function () {
              if (control.locked) {
                control.unlockFile();
              }
              window.close();
            });
          }
        },
        {
          text: '不保存',
          className: 'button',
          callback: function () {
            if (control.locked) {
              control.unlockFile();
            }
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
