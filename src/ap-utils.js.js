'use strict';


const args = process.argv.slice(2);
const argv = require('minimist')(args);
const createTable = require('./table')

const apUtils = () => {
  const { table } = argv
  if (table) {
    createTable(table)
  }
    
}
module.exports = {
  apUtils,
}