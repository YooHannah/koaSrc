const http = require('http')
const response = require('./response');
const context = require('./context');
const request = require('./request');
const { type } = require('os');
const Emitter = require('events')
class Application extends Emitter{
  constructor(){
    super()
    this.middleares = []
    this.context = Object.create(context)
    this.request = Object.create(request)
    this.response = Object.create(response)
  }
  listen(...args){
    let server = http.createServer(this.callback());
    server.listen(...args)
  }
  //收集中间件
  use(fn){
    this.middleares.push(fn)
  }
  compose(){
    return async ctx =>{
      let len = this.middleares.length
      let next = async ()=>Promise.resolve()
      for(let i=len-1;i>=0;i--){
        let currentMiddleware = this.middleares[i]
        next = createNext(currentMiddleware,next)
      }
      await next()
      function createNext(middleares,oldNext){
        return async ()=>await middleares(ctx,oldNext)
      }
    }
  }
  callback(){
    if (!this.listenerCount('error')) this.on('error', this.onerror);
    return (req,res)=>{
      let ctx = this.createContext(req,res)
      let fn = this.compose()
      let onerror = (err)=>ctx.onerror(err)
      let respond = ()=>this.responseBody(ctx)
      return fn(ctx).then(respond).catch(onerror)
    }
  }
  //构造ctx 对象
  //req,res 为http.createServer返回的原生参数
  createContext(req,res){
    let ctx = Object.create(this.context)
    ctx.request = Object.create(this.request)
    ctx.response = Object.create(this.response)
    ctx.app = ctx.request.app = ctx.response.app = this
    ctx.req = ctx.request.req = req
    ctx.res = ctx.response.res = res
    return ctx
  }
  responseBody(ctx){
    let content = ctx.body
    if(typeof content === 'string'){
      ctx.res.end(content)
    }else if(typeof content === 'object'){
      ctx.res.end(JSON.stringify(content))
    }
  }
  onerror(err){
    let msg = err.stack || err.toString()
    console.error(`框架级错误响应：\n${msg.replace(/^/gm, '  ')}\n`);
  }
}
module.exports = Application;