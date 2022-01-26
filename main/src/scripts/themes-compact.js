const path = require('path');
const exec = require('child_process').exec;
const fs = require('fs');

// 主题路径
const themesRoot = path.resolve(__dirname, '../styles/themes-compact');

// 主题输出路径
const outDir = 'wwwroot/assets/css/themes/';

// 主题
const themes = {
  black: '#001529',
  blue: '#1890ff',
  geekblue: '#2f54eb',
  lycheered: '#9b0a4b',
  magenta: '#eb2f96',
  purple: '#722ed1',
  seagreen: '#3CB371',
  skyblue: '#438eb9',
};

// for (let theme in themes) {
//   exec('lessc --js --clean-css=advanced --modify-var="primary-color='+ themes[theme] + '" src/styles/themes-compact/compiler.less'+ ' '+ themesRoot + '/themes/theme-'+ theme + '.less', function (error, stdout, stderr) {
//       error && console.error(error);
//     }

//   )
// }

// //判断目录是否存在
// fs.exists(themesRoot, function (exists) {

//     //路径存在
//     if (exists) {
//       //获取当前路径下的所有文件和路径名
//       var childArray=fs.readdirSync(themesRoot);

//       if (childArray.length) {
//         childArray.forEach(filename=> {
//             if (filename.indexOf('theme-')===0 && path.extname(filename)==='.less') {
//               exec('lessc --js --clean-css=advanced src/styles/themes-compact/'+ filename + ' '+ outDir + path.parse(filename).name + '.css', function (error, stdout, stderr) {
//                   error && console.error(error);
//                 }

//               );
//             }
//           }

//         );
//       }
//     }

//     else {
//       console.error('文件路径不存在!');
//     }
//   }

// );
exec('lessc --js --clean-css=advanced src/styles/themes-compact/compiler.less' + ' ' + outDir + 'compact.css', function(error, stdout, stderr) {
  error && console.error(error);
});
