const { Transform } = require('stream');

class ToJsonStream extends Transform {
  constructor(opts = {objectMode: true}) {
    super(opts);  
  }
  _transform(chunk, encoding, cb) {
    try {
      let str;
      if (Buffer.isBuffer(chunk) || encoding === 'buffer') {
        str = chunk.toString('utf8');
      } else {
        str = chunk;
      }
      let parsed = JSON.parse(str)
      this.push(parsed);
      cb();
    } catch(err) {
      console.warn('failed to parse logLine', err)
      cb();
    }
  }
  
};

module.exports = ToJsonStream;