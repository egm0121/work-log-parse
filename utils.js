function pipeWithErrors(src, dest) {
	src.once('error', function(err) {
		dest.emit('error', err);
  });
  return src.pipe(dest);
}

function toSortedArray(input, sortKey = 'time') {
  if(typeof input !== 'object') {
    console.error('not an object!')
    return input;
  }
  const sorted = Object.keys(input).map(key => input[key]).sort((a,b) => {
    if( b[sortKey] === a[sortKey]) return 0;
    return a[sortKey] > b[sortKey] ? 1 : -1;
  });
  return sorted;
}

function printKeysAsTables(data, keyName = 'PID', keysArr){
  (keysArr || Object.keys(data)).forEach(pid => {
    console.log(` ${keyName}: ${pid}`);
    console.table(toSortedArray(data[pid]));
  });
}

function pipeAll(inputStream, pipeline) {
  return pipeline.reduce((acc,currStream) => acc.pipe(currStream),inputStream);
}
module.exports = {
  pipeWithErrors,
  toSortedArray,
  printKeysAsTables,
  pipeAll,
};