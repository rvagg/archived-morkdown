module.exports.cumulativeDelayed = function () {
  var args = Array.prototype.slice.call(arguments)
    , func = args.shift()
    , timeout = args.shift() * 1000
    , __delayedId = null

  return function() {
    var _args = args.concat(Array.prototype.slice.call(arguments))
      , f = function() {
          return func.apply(f, _args)
        }
    if (__delayedId !== null)
      clearTimeout(__delayedId)
    return __delayedId = setTimeout(f, timeout)
  }
}