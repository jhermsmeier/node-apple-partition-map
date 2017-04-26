/**
 * Apple Partition Map (APM)
 * @constructor
 * @returns {APM}
 */
function APM() {

  if( !(this instanceof APM) )
    return new APM()

  /** @type {APM.DriverDescriptorMap} Driver descriptor map */
  this.driverMap = new APM.DriverDescriptorMap()
  /** @type {Array} Partitions */
  this.partitions = []

}

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
   * APM size in bytes; max 64 sectors
   * (i.e. 64 × 512 = 32 KB)
   * TODO: Do the 64 sectors include the DDM?
   * @type {Number}
   */
  get length() {
    return ( this.driverMap ? 1 : 0 ) +
      ( this.partitions.length * this.blockSize )
  },

  /** @type {Number} Block size in bytes */
  get blockSize() {
    // For devices without a DDM, default to 512 bytes
    return this.driverMap ? this.driverMap.blockSize : 512
  },

  /**
   * Parse an Apple Partition Map from a buffer
   * @param {Buffer} buffer
   * @param {Number} [offset=0]
   * @returns {APM}
   */
  parse( buffer, offset ) {

    offset = offset || 0

    // TODO: Support APMs without a DDM, and "OldSchool" format
    // See https://opensource.apple.com/source/IOStorageFamily/IOStorageFamily-116/IOApplePartitionScheme.cpp.auto.html
    if( buffer.readUInt16BE( offset + 0 ) === APM.DriverDescriptorMap.signature ) {
      this.driverMap = APM.DriverDescriptorMap.parse( buffer, offset )
    } else {
      this.driverMap = null
    }

    // Clear partitions array
    this.partitions = []

    // Calculate inital entry count by length & block size,
    // to be updated by the first read partition entry's values
    var length = buffer.length - offset - this.blockSize
    var entryCount = length / this.blockSize
    var partition = null
    var i = 1

    // Read the first partition entry
    offset += this.blockSize
    partition = APM.Partition.parse( buffer, offset )
    this.partitions.push( partition )

    // Update partition entry count
    entryCount = partition.mapEntries

    // Read rest of partition entries
    for( ; i < entryCount; i++ ) {
      offset += this.blockSize
      partition = APM.Partition.parse( buffer, offset )
      this.partitions.push( partition )
    }

    return this

  },

}

// Exports
module.exports = APM
