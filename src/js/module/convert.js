'use strict'

const d3csv = require('d3-dsv')
const _filter = require('lodash/filter')
const _forEach = require('lodash/forEach')
const _forIn = require('lodash/forIn')
const _sortBy = require('lodash/sortBy')

const parseHours = (value) => {
  return parseFloat(value.replace(',', '.'))
}

const formatHours = (value) => {
  let result = (+value).toFixed(2).replace(/\./, ',')
  result = result.replace(/0+$/, '')
  result = result.replace(/,$/, '')
  return result
}

const AZNRow = function (date, element, hours, comment) {
  this.date = date
  this.element = element
  this.hours = parseHours(hours)
  this.comment = comment
}

AZNRow.prototype.export = function () {
  let comment = this.comment.replace(';', ',').replace('\r', ' ').replace('\n', ' ').replace(/ {2,}/, ' ')
  if (comment.length > 80) {
    comment = comment.substr(0, 77) + '...'
  }
  return {
    date: this.date,
    element: this.element,
    hours: formatHours(this.hours),
    comment,
    zmtCode: ''
  }
}

/**
 * @param {AZNRow} row
 */
AZNRow.prototype.merge = function (row) {
  this.comment = this.comment + ', ' + row.comment
  this.hours += row.hours
}

/**
 * Converts mite csv to AZN csv
 *
 * @param {string} miteCSV
 * @returns {String}
 */
const convert = (miteCSV) => {
  const semiCsv = d3csv.dsvFormat(';')
  const filtered = _filter(semiCsv.parse(miteCSV), miteEntry => miteEntry.Kunde.length)
  const sortedByDate = _sortBy(filtered, ['Datum', 'Kunde'])
  const entriesPerDayAndCustomer = {}
  _forEach(sortedByDate, miteRow => {
    const key = miteRow.Datum + '.' + miteRow.Kunde
    if (!entriesPerDayAndCustomer[key]) {
      entriesPerDayAndCustomer[key] = new AZNRow(miteRow.Datum, miteRow.Kunde, miteRow.Stunden, miteRow.Bemerkung)
    } else {
      entriesPerDayAndCustomer[key].merge(new AZNRow(miteRow.Datum, miteRow.Kunde, miteRow.Stunden, miteRow.Bemerkung))
    }
  })
  const result = []
  _forIn(entriesPerDayAndCustomer, entry => {
    result.push(entry.export())
  })

  return semiCsv.format(result) + '\n'
}

module.exports = convert
