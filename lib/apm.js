/**
 * Apple Partition Map (APM)
 * @constructor
 * @return {APM}
 */
function APM() {

  if( !(this instanceof APM) )
    return new APM()

}

/**
 * APM prototype
 * @type {Object}
 * @ignore
 */
APM.prototype = {

  constructor: APM,

}

// Exports
module.exports = APM
