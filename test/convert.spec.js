'use strict'

/* global describe, it, after */

const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')
const expect = require('chai').expect
const convert = require('../convert')

describe('convert()', () => {
  it('should convert the input to correct output', () => Promise
    .join(
      fs.readFileAsync(path.join(__dirname, './data/time-entries.csv'), 'utf8'),
      fs.readFileAsync(path.join(__dirname, './data/2016-10-04_2016-10-21-mite2azn.csv'), 'utf8')
    )
    .spread((input, expectedOutput) => {
      expect(convert(input)).to.equal(expectedOutput)
    })
  )
})
