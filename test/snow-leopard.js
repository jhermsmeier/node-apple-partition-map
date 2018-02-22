var path = require( 'path' )
var fs = require( 'fs' )
var assert = require( 'assert' )
var APM = require( '..' )
var inspect = require( './inspect' )

describe( 'Mac OS X Snow Leopard', function() {

  var imageFile = path.join( __dirname, 'data', 'mac-osx-snow-leopard.bin' )
  var buffer = null
  var apm = null

  before( 'read', function() {
    buffer = fs.readFileSync( imageFile )
  })

  describe( 'APM', function() {

    specify( '.parse()', function() {

      apm = APM.parse( buffer )

      // console.log( inspect( apm ) )

      assert.ok( apm.driverMap, 'Missing DDM' )
      assert.equal( apm.driverMap.blockSize, 2048, 'Unexpected block size' )
      assert.equal( apm.blockSize, 2048, 'Unexpected block size' )

      assert.equal( apm.partitions.length, 4, 'Unexpected partition count' )
      apm.partitions.forEach( ( partition ) => {
        assert.equal( apm.partitions.length, partition.mapEntries, 'Unexpected partition count' )
      })

    })

    specify( '.write()', function() {
      var result = apm.write()
      var start = 0
      var end = result.length
      assert.ok( buffer.slice( start, end ).equals( result ), 'Buffers mismatch' )
    })

    describe( 'Partition', function() {

      specify( '.write()', function() {
        apm.partitions.forEach( ( partition, i ) => {
          var start = ( i + 1 ) * apm.blockSize
          var end = start + APM.Partition.size
          assert.ok( buffer.slice( start, end ).equals( partition.write() ), 'Buffers mismatch' )
        })
      })

    })

  })

  after(function() {
    buffer = null
  })

})
