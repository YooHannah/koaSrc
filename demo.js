const Koa = require('./lib/application')
const app = new Koa()

app.use(async (ctx,next)=>{
  // ctx.res.writeHeader(200)
  // ctx.res.end('Hello Simple Koa')
  console.log(1)
  await next()
  console.log(4)
})
app.use(async (ctx,next)=>{
  // ctx.res.writeHeader(200)
  // ctx.res.end('Hello Simple Koa')
  console.log(2)
  // await next()
  // throw new Error('test error')
  console.log(3)
})
app.use((ctx)=>{
  // ctx.res.writeHeader(200)
  // ctx.res.end('Hello Simple Koa')\
  console.log('xxx')
  ctx.response.status = 404
  ctx.body = 'hello Koa'
})

app.listen(3000,()=>{
  console.log('服务启动成功')
})