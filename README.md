# Apple Partion Map (APM)
[![npm](https://img.shields.io/npm/v/apple-partition-map.svg?style=flat-square)](https://npmjs.com/package/apple-partition-map)
[![npm license](https://img.shields.io/npm/l/apple-partition-map.svg?style=flat-square)](https://npmjs.com/package/apple-partition-map)
[![npm downloads](https://img.shields.io/npm/dm/apple-partition-map.svg?style=flat-square)](https://npmjs.com/package/apple-partition-map)
[![build status](https://img.shields.io/travis/jhermsmeier/node-apple-partition-map.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-apple-partition-map)

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save apple-partition-map
```

## Index
<!-- MarkdownTOC -->

- [Related Modules](#related-modules)
- [Usage](#usage)
- [References](#references)

<!-- /MarkdownTOC -->

## Related Modules

- [mbr](https://github.com/jhermsmeier/node-mbr) – Parse / construct Master Boot Records
- [gpt](https://github.com/jhermsmeier/node-gpt) – Parse / construct GUID partition tables
- [disk](https://github.com/jhermsmeier/node-disk) – ...
- [blockdevice](https://github.com/jhermsmeier/node-blockdevice) – Read from / write to block devices
- [udif](https://github.com/jhermsmeier/node-udif) – Apple Universal Disk Image Format (UDIF/DMG)

## Usage

```js
var APM = require( 'apple-partition-map' )
```

```js
var apm = APM.parse( buffer )
```

```js
APM {
  driverMap: DriverDescriptorMap {
    signature: 17746,
    blockSize: 512,
    blockCount: 62333952,
    deviceType: 0,
    deviceId: 0,
    driverData: 0,
    driverCount: 0,
    drivers: [
      { block: 0, size: 0, type: 0 },
      { block: 0, size: 0, type: 0 },
      { block: 0, size: 0, type: 0 },
      { block: 0, size: 0, type: 0 },
      { block: 0, size: 0, type: 0 },
      { block: 0, size: 0, type: 0 },
      { block: 0, size: 0, type: 0 },
      { block: 0, size: 0, type: 0 }
    ],
    reserved: <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00...>
  },
  partitions: [
    Partition {
      signature: 20557,
      reserved1: 0,
      mapEntries: 6,
      pBlockStart: 1,
      pBlockCount: 63,
      name: 'Apple',
      type: 'Apple_partition_map',
      lBlockStart: 0,
      lBlockCount: 63,
      flags: 3,
      bootBlock: 0,
      bootBytes: 0,
      loadAddress: 0,
      loadAddress2: 0,
      gotoAddress: 0,
      gotoAddress2: 0,
      checksum: 0,
      cpuId: 0,
      reserved2: null,
      reserved3: null
    },
    Partition {
      signature: 20557,
      reserved1: 0,
      mapEntries: 6,
      pBlockStart: 64,
      pBlockCount: 262144,
      name: '',
      type: 'Apple_Free',
      lBlockStart: 0,
      lBlockCount: 0,
      flags: 0,
      bootBlock: 0,
      bootBytes: 0,
      loadAddress: 0,
      loadAddress2: 0,
      gotoAddress: 0,
      gotoAddress2: 0,
      checksum: 0,
      cpuId: 0,
      reserved2: null,
      reserved3: null
    },
    Partition {
      signature: 20557,
      reserved1: 0,
      mapEntries: 6,
      pBlockStart: 262208,
      pBlockCount: 19550904,
      name: '',
      type: 'Apple_HFS',
      lBlockStart: 0,
      lBlockCount: 19550904,
      flags: 1073741875,
      bootBlock: 0,
      bootBytes: 0,
      loadAddress: 0,
      loadAddress2: 0,
      gotoAddress: 0,
      gotoAddress2: 0,
      checksum: 0,
      cpuId: 0,
      reserved2: null,
      reserved3: null
    },
    Partition {
      signature: 20557,
      reserved1: 0,
      mapEntries: 6,
      pBlockStart: 19813112,
      pBlockCount: 32745368,
      name: '',
      type: 'Apple_HFSX',
      lBlockStart: 0,
      lBlockCount: 32745368,
      flags: 1073741875,
      bootBlock: 0,
      bootBytes: 0,
      loadAddress: 0,
      loadAddress2: 0,
      gotoAddress: 0,
      gotoAddress2: 0,
      checksum: 0,
      cpuId: 0,
      reserved2: null,
      reserved3: null
    },
    Partition {
      signature: 20557,
      reserved1: 0,
      mapEntries: 6,
      pBlockStart: 52558480,
      pBlockCount: 262144,
      name: 'Booter',
      type: 'DOS_FAT_32',
      lBlockStart: 0,
      lBlockCount: 262144,
      flags: 3221225523,
      bootBlock: 0,
      bootBytes: 0,
      loadAddress: 0,
      loadAddress2: 0,
      gotoAddress: 0,
      gotoAddress2: 0,
      checksum: 1131887160,
      cpuId: 0,
      reserved2: null,
      reserved3: null
    },
    Partition {
      signature: 20557,
      reserved1: 0,
      mapEntries: 6,
      pBlockStart: 52820624,
      pBlockCount: 9513328,
      name: '',
      type: 'Windows_NTFS',
      lBlockStart: 0,
      lBlockCount: 9513328,
      flags: 1073741875,
      bootBlock: 0,
      bootBytes: 0,
      loadAddress: 0,
      loadAddress2: 0,
      gotoAddress: 0,
      gotoAddress2: 0,
      checksum: 0,
      cpuId: 0,
      reserved2: null,
      reserved3: null
    }
  ]
}
```

## References

- [IOApplePartitionScheme.h](https://opensource.apple.com/source/IOStorageFamily/IOStorageFamily-116/IOApplePartitionScheme.h.auto.html)
- [IOApplePartitionScheme.cpp](https://opensource.apple.com/source/IOStorageFamily/IOStorageFamily-116/IOApplePartitionScheme.cpp.auto.html)
- [File System Forensic Analysis: PC-based Partitions](http://www.informit.com/articles/article.aspx?p=376123&seqNum=3)
- [Wikipedia / Apple Partition Map](https://en.wikipedia.org/wiki/Apple_Partition_Map)
