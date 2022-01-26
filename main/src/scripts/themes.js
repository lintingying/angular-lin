const path = require('path');
const exec = require('child_process').exec;
const fs = require('fs');

// 主题路径
const themesRoot = path.resolve(__dirname, '../styles/themes');

// 主题输出路径
const outDir = 'src/assets/css/themes/';

//判断目录是否存在
fs.exists(themesRoot, function(exists) {
  //路径存在
  if (exists) {
    //获取当前路径下的所有文件和路径名
    var childArray = fs.readdirSync(themesRoot);
    if (childArray.length) {
      childArray.forEach(filename => {
        if (filename.indexOf('theme-') === 0 && path.extname(filename) === '.less') {
          exec('lessc --js --clean-css=advanced src/styles/themes/' + filename + ' ' + outDir + path.parse(filename).name + '.css', function(error, stdout, stderr) {
            error && console.error(error);
          });
        }
      });
    }
  } else {
    console.error('文件路径不存在!');
  }
});


/**
 * 使用yarn themes:build  把less的样式文件生成css
 */
