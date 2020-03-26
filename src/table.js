const axios = require('axios')
const nodePlop = require('node-plop');
const { exec } = require('child_process');
const chalk = require('chalk');
const { resolve } = require('path')
const template = require('art-template');
const fs = require('fs');
const JsonToTS = require('json-to-ts')

const { dirExists } = require('./fileUtils')

const error = chalk.bold.red;
const successs = chalk.bold.green;
const pageTemplatePath = resolve(__dirname, '../templates/TableListPage/page.tsx')
const entitiesTemplatePath = resolve(__dirname,'../templates/TableListPage/entities.ts')
const serviceTemplatePath = resolve(__dirname, '../templates/TableListPage/service.ts')
const createNewComponentTemplatePath = resolve(__dirname, '../templates/TableListPage/components/CreateForm.tsx')
const pageDirPath = resolve(process.cwd(), 'src/pages/AntProTablePage')
const componentDirPath = resolve(process.cwd(), 'src/pages/AntProTablePage/components')

module.exports = function(url) {

  axios
    .get(url)
    .then(res => {
      const { data: { data: { resultList}} } = res
      const keys = Object.keys(resultList[0])


      // 生成模板
      const page = template(pageTemplatePath, { keys })
      const entities = template(entitiesTemplatePath, { listTs: `${JsonToTS(resultList)}` })
      const service = template(serviceTemplatePath, { url: res.request.path })
      const createNewComponent = template(createNewComponentTemplatePath, {})
      
      // 插入文件
      writeFile(componentDirPath, 'CreateForm.tsx', createNewComponent, () => {
        writeFile(pageDirPath, 'index.tsx', page)
        writeFile(pageDirPath, 'entities.ts', entities)
        writeFile(pageDirPath, 'service.ts', service)
      }) // 先插入组件 因为需要创建目录
    })
    .catch(e => {
      console.log(e);
      exec('say 傻B，你地址配错了', (err, stdout, stderr) => {
        if (err) {
          console.log(error('你地址配错了'))
          return;
        }
      })
    })
}


async function writeFile(path,fileName,  content, callback) {
  await dirExists(path);
  fs.writeFile(`${path}/${fileName}`, content, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log(successs(`写入${fileName}文件成功`));
    if (callback) {
      callback()
    }
  });
}


