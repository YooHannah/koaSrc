let proto = {
  onerror(err){
    console.log('中间件层捕获函数')
    this.app.emit('error',err)
    //中间件捕获异常后，需要响应
    this.status = 500
    let msg = '中间件级错响应：服务器内部错误'
    this.res.setHeader('Content-Type','text/plain;charset=utf-8')
    this.res.setHeader('Content-Length',Buffer.byteLength(msg))
    this.res.end(msg)
  }
}
function delegateSet(property,name){
  proto.__defineSetter__(name,function(val){
    this[property][name] = val;
  })
}
function delegateGet(property,name){
  proto.__defineGetter__(name,function(val){
    return this[property][name];
  })
}
let requestSet = []
let requestGet = ['query']

let responseSet = ['body','status']
let responseGet = responseSet
requestGet.forEach(ele=>delegateGet('request',ele))
requestSet.forEach(ele=>delegateGet('request',ele))
responseGet.forEach(ele=>delegateGet('response',ele))
responseSet.forEach(ele=>delegateSet('response',ele))
module.exports = proto