function Modal() {
  this.option = {
    title: null,
    content: '',
    other: null,
    loadingText: '正在处理中...',
    footer: [
      {
        text: '确定',
        className: 'button primary-btn',
        callback: function () {
          $(".modal-container").remove();
        }
      },
      {
        text: '取消',
        className: 'button',
        callback: function () {
          $(".modal-container").remove();
        }
      }
    ],
    close: function () {
      $(".modal-container").remove();
    }
  };

  this.open = function (option) {
    option = Object.assign({}, this.option, option);
    var html = '<div class="modal-container">';
    html += '<div class="modal-mask">';
    html += '<div class="modal">';
    if (option.title) {
      html += '<div class="modal-close-btn">X</div>';
      html += '<div class="modal-header">' + option.title + '</div>';
    } else {
      html += '<div class="modal-close-btn" style="width: 36px; height: 36px; line-height: 36px;">X</div>';
    }
    html += '<div class="modal-content">' + option.content + '</div>';
    if (option.other) {
      html += '<div class="modal-other">' + option.other + '</div>';
    }
    html += '<div class="modal-footer"></div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    $('body').append(html);

    if (option.footer.length > 0) {
      for (var i = 0; i < option.footer.length; i++) {
        var btn = option.footer[i];
        var button = document.createElement("BUTTON");
        button.innerHTML = btn.text;
        button.className = btn.className;
        button.onclick = btn.callback;
        $(".modal-footer").append(button);
      }
    }


    $(".modal-close-btn").click(option.close);
  }

  this.loading = function (option) {
    // 先移除modal
    $(".modal-container").remove();
    // 再创建loading-modal
    option = Object.assign({}, this.option, option);
    var html = '<div class="modal-container">';
    html += '<div class="modal-mask">';
    html += '<div class="modal">';
    html += '<div class="modal-loading">' + option.loadingText + '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    $('body').append(html);
  }

  this.close = function () {
    $(".modal-container").remove();
  }
}

// var modal = new Modal();
// modal.open({
//   title: '标题',
//   content: '是否保存更改？',
//   footer: [
//     {
//       text: '确定',
//       className: 'button primary-btn',
//       callback: function () {
//         $(".modal-container").remove();
//       }
//     },
//     {
//       text: '取消',
//       className: 'button',
//       callback: function () {
//         $(".modal-container").remove();
//       }
//     }
//   ]
// });
// modal.loading();
// modal.close();
