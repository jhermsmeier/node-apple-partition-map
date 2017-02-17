/**
 * Driver Descriptor Map (DDM)
 * @constructor
 * @memberOf APM
 * @returns {DriverDescriptorMap}
 */
function DriverDescriptorMap() {

  if( !(this instanceof DriverDescriptorMap) )
    return new DriverDescriptorMap()

  /** @type {Number} Driver Descriptor Map magic number */
  this.signature = 0x4552
  /** @type {Number} Block size for this device */
  this.blockSize = 512
  /** @type {Number} Block count for this device */
  this.blockCount = 0x00000000
  /** @type {Number} Device type */
  this.deviceType = 0x0000
  /** @type {Number} Device id */
  this.deviceId = 0x0000
  /** @type {Number} Driver data */
  this.driverData = 0x00000000
  /** @type {Number} Driver descriptor count */
  this.driverCount = 0x0000
  /** @type {Array<Object>} Driver descriptor table */
  this.drivers = []
  /** @type {Buffer} Reserved for future use */
  this.reserved = new Buffer( 430 )
  this.reserved.fill(0)

}

/**
 * Driver Descriptor Map signature;
 * 'ER' in ASCII
 * @type {Number}
 */
DriverDescriptorMap.signature = 0x4552

/**
 * Driver Descriptor Map size in bytes
 * @type {Number}
 */
DriverDescriptorMap.size = 512

/**
 * Parse a DDM from a buffer
 * @param {Buffer} buffer
 * @returns {DriverDescriptorMap}
 */
DriverDescriptorMap.parse = function( buffer ) {
  return new DriverDescriptorMap().parse( buffer )
}

/**
 * DriverDescriptorMap prototype
 * @type {Object}
 * @ignore
 */
DriverDescriptorMap.prototype = {

  constructor: DriverDescriptorMap,

  /**
   * Parse a DDM from a buffer
   * @param {Buffer} buffer
   * @param {Number} [offset=0]
   * @returns {DriverDescriptorMap}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.signature = buffer.readUInt16BE( offset + 0 )
    this.blockSize = buffer.readUInt16BE( offset + 2 )
    this.blockCount = buffer.readUInt32BE( offset + 4 )
    this.deviceType = buffer.readUInt16BE( offset + 8 )
    this.deviceId = buffer.readUInt16BE( offset + 10 )
    this.driverData = buffer.readUInt32BE( offset + 12 )
    this.driverCount = buffer.readUInt16BE( offset + 16 )
    this.drivers = []

    // TODO: Only parse `this.driverCount` driver map entries (?)
    for( var i = 0; i < 8; i++ ) {
      this.drivers.push({
        block: buffer.readUInt32BE( offset + 18 + i * 8 ),
        size: buffer.readUInt16BE( offset + 22 + i * 8 ),
        type: buffer.readUInt16BE( offset + 24 + i * 8 ),
      })
    }

    buffer.copy( this.reserved, 0, offset + 82, offset + 512 )

    return this

  },

}

// Exports
module.exports = DriverDescriptorMap
