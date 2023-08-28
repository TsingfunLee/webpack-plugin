const path = require('path');
const fs = require('fs');

// 获取src下所有js文件
function getAllJsFilePaths(directoryPath) {
  const jsFilePaths = [];

  const items = fs.readdirSync(directoryPath);

  items.forEach(item => {
    const itemPath = path.join(directoryPath, item);
    const isFile = fs.statSync(itemPath).isFile();
    
    if (isFile && path.extname(itemPath) === '.js') {
      jsFilePaths.push(itemPath);
    } else if (!isFile) {
      const subJsFilePaths = getAllJsFilePaths(itemPath);
      jsFilePaths.push(...subJsFilePaths);
    }
  });

  return jsFilePaths;
}

class UnusedFilesWebpackPlugin {
  constructor(options = {}) {
    // 接收配置选项
    this.options = {
      ...options,
    };
  }

  apply(compiler) {
    const usedFiles = new Set();

    compiler.hooks.entryOption.tap('entryFile', (context, entry) => {
        usedFiles.add(...entry.main.import.map(item => path.resolve(context, item)))
    })

    compiler.hooks.afterEmit.tapAsync('UnsedPlugin', (compilation) => {
        // 收集所有已经被引用的文件
        compilation.modules.forEach(module => {
            if (module.resource) {
                usedFiles.add(module.resource);
            }
        });
        console.log('[usedFiles]', usedFiles)

        // 删除未使用的文件
        const srcDirectory = path.resolve(__dirname, '../src');
        const jsFilePaths = getAllJsFilePaths(srcDirectory);
        console.log('[all js files]', jsFilePaths)
        const unusedFiles = []
        jsFilePaths.forEach(item => {
          if(!usedFiles.has(item)){
            unusedFiles.push(item)
            // 删除文件
            fs.unlinkSync(item)
          }
        })
        fs.writeFile('./unused-files.txt', unusedFiles.join('\n'), ()=>{})
    });
  }
}





module.exports = UnusedFilesWebpackPlugin;
