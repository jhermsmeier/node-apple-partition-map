/**
 * Partition Map Entry (DPME, or Disk Partition Map Entry)
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
  this.firstLBA = 0x00000000
  /** @type {Number} Physical block count of partition */
  this.sectors = 0x00000000
  /** @type {String} Name of partition */
  this.name = ''
  /** @type {String} Type of partition, i.e. 'Apple_HFS' */
  this.type = ''
  /** @type {Number} Logical (local?) block start of partition */
  this.lBlockStart = 0x00000000
  /** @type {Number} Logical (local?) block count of partition */
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
  this.cpuId = Buffer.alloc( 16 )
  /** @type {null} Reserved for future use */
  this.reserved2 = Buffer.alloc( 128 ) // 4 * uint32
  /** @type {null} Reserved for future use */
  this.reserved3 = Buffer.alloc( 248 ) // 62 * uint32

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

// TODO: Impl additional flags listed on Wikipedia;
// see https://en.wikipedia.org/wiki/Apple_Partition_Map#Partition_status
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

  /** @type {Boolean} valid */
  get valid() { return this.hasFlag( Partition.VALID ) },
  set valid( value ) { this.setFlag( Partition.VALID, !!value ) },

  /** @type {Boolean} allocated */
  get allocated() { return this.hasFlag( Partition.ALLOCATED ) },
  set allocated( value ) { this.setFlag( Partition.ALLOCATED, !!value ) },

  /** @type {Boolean} inUse */
  get inUse() { return this.hasFlag( Partition.IN_USE ) },
  set inUse( value ) { this.setFlag( Partition.IN_USE, !!value ) },

  /** @type {Boolean} bootable */
  get bootable() { return this.hasFlag( Partition.BOOTABLE ) },
  set bootable( value ) { this.setFlag( Partition.BOOTABLE, !!value ) },

  /** @type {Boolean} readable */
  get readable() { return this.hasFlag( Partition.READABLE ) },
  set readable( value ) { this.setFlag( Partition.READABLE, !!value ) },

  /** @type {Boolean} writable */
  get writable() { return this.hasFlag( Partition.WRITABLE ) },
  set writable( value ) { this.setFlag( Partition.WRITABLE, !!value ) },

  /** @type {Boolean} osPicCode */
  get osPicCode() { return this.hasFlag( Partition.OS_PIC_CODE ) },
  set osPicCode( value ) { this.setFlag( Partition.OS_PIC_CODE, !!value ) },

  /** @type {Number} lastLBA */
  get lastLBA() { return this.firstLBA + this.sectors },
  set lastLBA( value ) { this.sectors = value - this.firstLBA },

  /**
   * Determine whether given flag is set
   * @param {Number} mask
   * @returns {Boolean}
   */
  hasFlag( mask ) {
    return this.flags & mask === mask
  },

  /**
   * Set given flag to a given value
   * @param {Number} mask
   * @param {Boolean} value
   * @returns {Number} flags
   */
  setFlag( mask, value ) {
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
  parse( buffer, offset ) {

    offset = offset || 0

    this.signature = buffer.readUInt16BE( offset + 0 )

    if( this.signature !== Partition.signature ) {
      throw new Error( `Invalid partition signature: Expected 0x504D, saw 0x${this.signature.toString(16).toUpperCase()}` )
    }

    this.reserved1 = buffer.readUInt16BE( offset + 2 )
    this.mapEntries = buffer.readUInt32BE( offset + 4 )
    this.firstLBA = buffer.readUInt32BE( offset + 8 )
    this.sectors = buffer.readUInt32BE( offset + 12 )
    this.name = buffer.toString( 'utf8', offset + 16, offset + 48 ).replace( /\u0000/g, '' )
    this.type = buffer.toString( 'utf8', offset + 48, offset + 80 ).replace( /\u0000/g, '' )
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

    buffer.copy( this.cpuId, 0, offset + 120, offset + 136 )
    buffer.copy( this.reserved2, 0, offset + 136, offset + 264 )
    buffer.copy( this.reserved3, 0, offset + 264, offset + 512 )

    return this

  },

  /**
   * Write the partition entry to a buffer
   * @param {Buffer} [buffer]
   * @param {Number} [offset=0]
   * @returns {Buffer}
   */
  toBuffer( buffer, offset ) {

    buffer = buffer || Buffer.alloc( Partition.size )
    offset = offset || 0

    buffer.fill( 0, offset, offset + Partition.size )

    buffer.writeUInt16BE( this.signature, offset + 0 )
    buffer.writeUInt16BE( this.reserved1, offset + 2 )
    buffer.writeUInt32BE( this.mapEntries, offset + 4 )
    buffer.writeUInt32BE( this.firstLBA, offset + 8 )
    buffer.writeUInt32BE( this.sectors, offset + 12 )
    buffer.write( this.name, offset + 16, 32, 'utf8' )
    buffer.write( this.type, offset + 48, 32, 'utf8' )
    buffer.writeUInt32BE( this.lBlockStart, offset + 80 )
    buffer.writeUInt32BE( this.lBlockCount, offset + 84 )
    buffer.writeUInt32BE( this.flags, offset + 88 )
    buffer.writeUInt32BE( this.bootBlock, offset + 92 )
    buffer.writeUInt32BE( this.bootBytes, offset + 96 )
    buffer.writeUInt32BE( this.loadAddress, offset + 100 )
    buffer.writeUInt32BE( this.loadAddress2, offset + 104 )
    buffer.writeUInt32BE( this.gotoAddress, offset + 108 )
    buffer.writeUInt32BE( this.gotoAddress2, offset + 112 )
    buffer.writeUInt32BE( this.checksum, offset + 116 )

    this.cpuId.copy( buffer, offset + 120, 0 )
    this.reserved2.copy( buffer, offset + 136, 0 )
    this.reserved3.copy( buffer, offset + 264, 0 )

    return buffer

  },

  toJSON() {

    var data = Object.assign( {}, this )

    data.cpuId = data.cpuId.toString( 'hex' )
    data.reserved2 = data.reserved2.toString( 'hex' )
    data.reserved3 = data.reserved3.toString( 'hex' )

    return data

  },

}

// Exports
module.exports = Partition
