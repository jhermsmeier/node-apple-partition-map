/**
 * Apple Partition Map (APM)
 * @constructor
 * @returns {APM}
 */
function APM() {

  if( !(this instanceof APM) )
    return new APM()

  this.driverMap = new APM.DriverDescriptorMap()
  this.partitions = []

}

/**
 * APM size in bytes
 * 64 sectors (64 × 512 = 32 KB)
 * @type {Number}
 */
APM.size = 64 * 512

/** @constructor DriverDescriptorMap */
APM.DriverDescriptorMap = require( './driver-descriptor-map' )
/** @constructor Partition */
APM.Partition = require( './partition' )

/**
 * Parse an Apple Partition Map from a buffer
 * @param {Buffer} buffer
 * @param {Number} [offset=0]
 * @returns {APM}
 */
APM.parse = function( buffer, offset ) {
  return new APM().parse( buffer, offset )
}

/**
 * APM prototype
 * @type {Object}
 * @ignore
 */
APM.prototype = {

  constructor: APM,

  /**
   * Parse an Apple Partition Map from a buffer
   * @param {Buffer} buffer
   * @param {Number} [offset=0]
   * @returns {APM}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    // TODO: Support APMs without a DDM, and "OldSchool" format
    // See https://opensource.apple.com/source/IOStorageFamily/IOStorageFamily-116/IOApplePartitionScheme.cpp.auto.html

    this.driverMap.parse( buffer, offset )
    this.partitions = []

    var length = buffer.length - offset - this.driverMap.blockSize
    var count = length / this.driverMap.blockSize
    var partition = null

    for( var i = 0; i < count; i++ ) {
      offset += this.driverMap.blockSize
      partition = APM.Partition.parse( buffer, offset )
      if( partition.signature ) this.partitions.push( partition )
    }

    return this

  },

}

// Exports
module.exports = APM
