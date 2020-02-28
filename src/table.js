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
const pageTemplatePath = resolve(__dirname, '../templates/page.tsx')
const entitiesTemplatePath = resolve(__dirname,'../templates/entities.ts')
const serviceTemplatePath = resolve(__dirname, '../templates/service.ts')
const pageDirPath = resolve(process.cwd(), 'src/pages/AntProTablePage')

module.exports = function(url) {

  axios
    .get(url)
    .then(res => {
      const { data: { data: { resultList}} } = res
      const keys = Object.keys(resultList[0])
      const columns = keys.map(key => ({
        title: key,
        dataIndex: key,
      }))
      // 生成模板
      const page = template(pageTemplatePath, { keys })
      const entities = template(entitiesTemplatePath, { listTs: `${JsonToTS(resultList)}` })
      const service = template(serviceTemplatePath, { url: res.request.path })
      // 插入文件
      writeFile(pageDirPath, 'index.tsx', page)
      writeFile(pageDirPath, 'entities.ts', entities)
      writeFile(pageDirPath, 'service.ts', service)
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


async function writeFile(path,fileName,  content) {
  await dirExists(path);
  fs.writeFile(`${path}/${fileName}`, content, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log(successs(`写入${fileName}文件成功`));
  });
}


