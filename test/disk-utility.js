var path = require( 'path' )
var fs = require( 'fs' )
var assert = require( 'assert' )
var APM = require( '..' )
var inspect = require( './inspect' )

describe( 'Disk Utility (macOS Sierra)', function() {

  var imageFile = path.join( __dirname, 'data', 'mac-os-disk-utility.bin' )
  var buffer = null

  before( 'read', function() {
    buffer = fs.readFileSync( imageFile )
  })

  specify( 'APM.parse()', function() {

    var apm = APM.parse( buffer )

    // console.log( inspect( apm ) )

    assert.ok( apm.driverMap, 'Missing DDM' )
    assert.equal( apm.driverMap.blockSize, 512, 'Unexpected block size' )
    assert.equal( apm.blockSize, 512, 'Unexpected block size' )

    assert.equal( apm.partitions.length, 6, 'Unexpected partition count' )
    apm.partitions.forEach( ( partition ) => {
      assert.equal( apm.partitions.length, partition.mapEntries, 'Unexpected partition count' )
    })

  })

  after(function() {
    buffer = null
  })

})
