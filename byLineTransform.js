const { Transform } = require('stream');

class ByLineTransform extends Transform {
  constructor(opts) {
    super(opts);
    this._brRe = /\r?\n/;
    this._buf = null;
    
  }
  _transform(chunk, encoding, cb) {
    let str;
    if (Buffer.isBuffer(chunk) || encoding === 'buffer') {
      str = chunk.toString('utf8');
    } else {
      str = chunk;
    }

    try {
      if (this._buf !== null) {
        this._buf += str;  
      } else {
        this._buf = str;  
      }
      const lines = this._buf.split(this._brRe);
      const lastIndex = lines.length - 1;
      for (let i = 0; i < lastIndex; i++) {
        this.push(lines[i]);
      }
      const lastLine = lines[lastIndex];
      if (lastLine.length) {
        this._buf = lastLine;
      } else {
        this._buf = null;
      }
      cb();
    } catch(err) {
      console.log('eror on stream')
      cb(err); // invalid data type;
    }
  }
  _flush(callback) {
    try {
      if(this._buf !== null) {
        this.push(this._buf);
        this._buf = null;
      }
      callback();
    } catch (err) {
      callback(err);
    }
  }
};

module.exports = ByLineTransform;