var path = require( 'path' )
var fs = require( 'fs' )
var bench = require( 'nanobench' )
var APM = require( '..' )

var filename = path.join( __dirname, '..', 'test', 'data', 'mac-osx-snow-leopard.bin' )
var buffer = fs.readFileSync( filename )

const ITERATIONS = 1000

bench( `APM.parse() ⨉ ${ITERATIONS}`, function( run ) {

  var apm = null

  run.start()
  for( var i = 0; i < ITERATIONS; i++ ) {
    apm = APM.parse( buffer )
  }
  run.end()

})

bench( `apm.parse() ⨉ ${ITERATIONS}`, function( run ) {

  var apm = new APM()

  run.start()
  for( var i = 0; i < ITERATIONS; i++ ) {
    apm.parse( buffer )
  }
  run.end()

})

bench( `apm.write() ⨉ ${ITERATIONS}`, function( run ) {

  var apm = APM.parse( buffer )
  var output = null

  run.start()
  for( var i = 0; i < ITERATIONS; i++ ) {
    output = apm.write()
  }
  run.end()

})
