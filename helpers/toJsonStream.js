const { Transform } = require('stream');

class ToJsonStream extends Transform {
  constructor(opts = {objectMode: true}) {
    super(opts);  
  }
  _transform(chunk, encoding, cb) {
    let str;
    try {
      if (Buffer.isBuffer(chunk) || encoding === 'buffer') {
        str = chunk.toString('utf8');
      } else {
        str = chunk;
      }
      let parsed = JSON.parse(str)
      this.push(parsed);
      cb();
    } catch(err) {
      const didTruncate = str.length > 100 && '...';
      console.warn('FAILED PARSE LINE:', err.message , 'INPUT', `${str.slice(0,100)}${didTruncate}`);
      cb();
    }
  }
  
};

module.exports = ToJsonStream;