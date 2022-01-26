function WebOfficeConfig() {
  /**
   * 文档关联的ObjectId
   */
  this.objectId = '',
    /**
     * 文档所属模块编码
     */
    this.moduleCode = '',
    /**
     * 文档id
     */
    this.id = '',
    /**
     * 文件Hash
     */
    this.hash = '',
    /**
     * 文档标题
     */
    this.caption = '',
    /**
     * 文档名称
     */
    this.fileName = 'temp.doc',
    /**
     * 文档后缀
     */
    this.fileExtension = '.doc',
    /**
     * 是否显示菜单栏
     */
    this.showMenuBar = false,
    /**
     * 是否显示标题栏
     */
    this.showTitleBar = false,
    /**
     * 是否显示标题栏
     */
    this.showStatusBar = true,
    /**
     * 显示“修订痕迹”按钮
     */
    this.enableReview = false,
    /**
     * 文档下载地址
     */
    this.downloadUrl = Util.getOrigin() + Util.parsePath("/api/attachment/File/Preview", 0),
    /**
     * 文档上传地址
     */
    this.uploadUrl = Util.getOrigin() + Util.parsePath("/api/attachment/File/save", 0),
    /**
     * 文档lock地址
     */
    this.lockUrl = Util.getOrigin() + Util.parsePath("/api/Attachment/File/Lock", 0),
    /**
     * 文档unLock地址
     */
    this.unlockUrl = Util.getOrigin() + Util.parsePath("/api/Attachment/File/Unlock", 0),
    /**
     * 生成PDF地址
     */
    this.generatePdfUrl = Util.getOrigin() + Util.parsePath("/api/Attachment/File/generatePdf", 0),
    /**
     * 锁定文档使用的秘钥
     */
    this.protectSecret = '',
    /**
     * 文档当前操作人id
     */
    this.userId = '',
    /**
     * 文档当前操作人名称
     */
    this.userName = '',
    /**
     * 当未安装文档控件时 文档的预览地址 目前使用office onlinde server
     */
    this.previewUrl = '',
    /**
     * 虚拟域名
     */
    this.virtualDomain = '',
    /**
    * 文档类型 参见consts.docType
    */
    this.docType = 0,
    /**
     * 工具栏按钮
     */
    this.toolButtons = [],
    /**
     * 文档编辑模式
     */
    this.editMode = 0,
    /**
     * 当使用KGBrowser打开时，需要传递该参数，用于向父窗口传递消息
     */
    this.openerId = '',
    /**
     * 流程详情
     */
    this.processDetail;
  /**
   * 流程实例id
   */
  this.taskId = '';
  /**
  * 流程实例模板id
  */
  this.workflowTemplateId = '';
  /**
   * 草稿模板
   */
  this.template = [];
  /**
   * 正文模板
   */
  this.decorateTemplate = [];
  /**
   * 公文设置项
   */
  this.documentSettings = [];
  /**
   * 初始化控件后的回调处理
   */
  this.afterInitCallback = function (weboffice) { };
}
