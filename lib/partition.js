/**
 * Partition Map Entry
 * @constructor
 * @memberOf APM
 * @returns {Partition}
 */
function Partition() {

  if( !(this instanceof Partition) )
    return new Partition()

  /** @type {Number} Partition entry magic number */
  this.signature = 0x504D
  /** @type {Number} Reserved for future use */
  this.reserved1 = 0x0000
  /** @type {Number} Number of partition entries */
  this.mapEntries = 0x00000000
  /** @type {Number} Physical block start of partition */
  this.pBlockStart = 0x00000000
  /** @type {Number} Physical block count of partition */
  this.pBlockCount = 0x00000000
  /** @type {String} Name of partition */
  this.name = ''
  /** @type {String} Type of partition, i.e. 'Apple_HFS' */
  this.type = ''
  /** @type {Number} Logical block start of partition */
  this.lBlockStart = 0x00000000
  /** @type {Number} Logical block count of partition */
  this.lBlockCount = 0x00000000
  /** @type {Number} Partition flags */
  this.flags = 0x00000000
  /** @type {Number} Logical block start of boot code */
  this.bootBlock = 0x00000000
  /** @type {Number} Byte count of boot code */
  this.bootBytes = 0x00000000
  /** @type {Number} Load address in memory of boot code */
  this.loadAddress = 0x00000000
  /** @type {Number} Reserved for future use */
  this.loadAddress2 = 0x00000000
  /** @type {Number} Jump address in memory of boot code */
  this.gotoAddress = 0x00000000
  /** @type {Number} Reserved for future use */
  this.gotoAddress2 = 0x00000000
  /** @type {Number} Checksum of boot code */
  this.checksum = 0x00000000
  /** @type {Number} Processor type */
  this.cpuId = 0x00
  /** @type {null} Reserved for future use */
  this.reserved2 = null
  /** @type {null} Reserved for future use */
  this.reserved3 = null

}

/**
 * Parition Map Entry signature;
 * 'PM' in ASCII
 * @type {Number}
 */
Partition.signature = 0x504D

/**
 * Partition Entry size in bytes
 * @type {Number}
 */
Partition.size = 512

Partition.VALID = 0x00000001 // bit 0
Partition.ALLOCATED = 0x00000002 // bit 1
Partition.IN_USE = 0x00000004 // bit 2
Partition.BOOTABLE = 0x00000008 // bit 3
Partition.READABLE = 0x00000010 // bit 4
Partition.WRITABLE = 0x00000020 // bit 5
Partition.OS_PIC_CODE = 0x00000040 // bit 6
Partition.OS_SPECIFIC_2 = 0x00000080 // bit 7
Partition.OS_SPECIFIC_1 = 0x00000100 // bit 8
Partition.RESERVED_2 = 0xFFFFFE00 // bit 9..31

/**
 * Parse an APM partition entry from a buffer
 * @param {Buffer} buffer
 * @param {Number} [offset=0]
 * @returns {Partition}
 */
Partition.parse = function( buffer, offset ) {
  return new Partition().parse( buffer, offset )
}

/**
 * Partition prototype
 * @type {Object}
 * @ignore
 */
Partition.prototype = {

  constructor: Partition,

  /**
   * Determine whether given flag is set
   * @param {Number} mask
   * @returns {Boolean}
   */
  hasFlag: function( mask ) {
    return this.flags & mask === mask
  },

  /**
   * Set given flag to a given value
   * @param {Number} mask
   * @param {Boolean} value
   * @returns {Number} flags
   */
  setFlag: function( mask, value ) {
    if( !value && (this.flags & mask) )
      this.flags = this.flags ^ mask
    if( value && !(this.flags & mask) )
      this.flags = this.flags | mask
    return this.flags
  },

  /**
   * Parse an APM partition entry from a buffer
   * @param {Buffer} buffer
   * @param {Number} [offset=0]
   * @returns {Partition}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.signature = buffer.readUInt16BE( offset + 0 )
    this.reserved1 = buffer.readUInt16BE( offset + 2 )
    this.mapEntries = buffer.readUInt32BE( offset + 4 )
    this.pBlockStart = buffer.readUInt32BE( offset + 8 )
    this.pBlockCount = buffer.readUInt32BE( offset + 12 )
    this.name = buffer.toString( 'utf8', offset + 16, offset + 16 + 32 ).replace( /\u0000/g, '' )
    this.type = buffer.toString( 'utf8', offset + 48, offset + 48 + 32 ).replace( /\u0000/g, '' )
    this.lBlockStart = buffer.readUInt32BE( offset + 80 )
    this.lBlockCount = buffer.readUInt32BE( offset + 84 )
    this.flags = buffer.readUInt32BE( offset + 88 )
    this.bootBlock = buffer.readUInt32BE( offset + 92 )
    this.bootBytes = buffer.readUInt32BE( offset + 96 )
    this.loadAddress = buffer.readUInt32BE( offset + 100 )
    this.loadAddress2 = buffer.readUInt32BE( offset + 104 )
    this.gotoAddress = buffer.readUInt32BE( offset + 108 )
    this.gotoAddress2 = buffer.readUInt32BE( offset + 112 )
    this.checksum = buffer.readUInt32BE( offset + 116 )
    this.cpuId = buffer.readUInt8( offset + 120 )
    // this.reserved2 =
    // this.reserved3 =

    return this

  },

}

// Exports
module.exports = Partition
