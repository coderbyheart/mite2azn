'use strict'

/* global window, document, FileReader, Blob */

const d3csv = require('d3-dsv')
const $ = require('jquery')
const convert = require('./module/convert')
const FileSaver = require('file-saver')

$(() => {
  const $file = $('#file')
  const fr = new FileReader()
  fr.onload = () => {
    const result = convert(fr.result)
    const blob = new Blob([result], {type: 'text/csvcharset=utf-8'})
    const semiCsv = d3csv.dsvFormat(';')
    const aznReport = semiCsv.parse(result)
    FileSaver.saveAs(blob, aznReport[0].date + '_' + aznReport[aznReport.length - 1].date + '-mite2azn.csv')
  }
  $file.change(ev => {
    const file = $file[0].files[0]
    fr.readAsText(file)
  })
})
