should       = require 'should'
url          = require 'url'
patchedParse = require '../'

describe 'urlParsePatched', ->

  testUrl = 'http://host.com/path'
  it "parses #{testUrl}",->
    patchedParse(testUrl).should.deepEqual url.parse testUrl

  testUrl = 'http://username:password@host.com/path'
  it "parses #{testUrl}",->
    patchedParse(testUrl).should.deepEqual url.parse testUrl


describe 'original url.parse', ->
  it 'throws upon http://username:pass%word@host.com/path',->
    should.throws ->
      url.parse 'http://username:pass%word@host.com/path'

  it 'works after installing the patch',->
    patchedParse.installPatch()
    should.doesNotThrow ->
      url.parse 'http://username:pass%word@host.com/path'
