export const createStreamResponse = (res)=>{
  
  // 这个响应头是必要的，用于启用服务器发送事件（SSE）功能
  res.setHeader("Content-Type", "text/event-stream");
  // 这两个响应头是必要的，用于确保浏览器不会缓存响应
  // 且保持连接打开，直到客户端关闭连接
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  // 关键优化：禁用 Nagle 算法，减少小数据包延迟
  res.setHeader("X-Accel-Buffering", "no");
  // 立即发送响应头，让前端尽快建立连接
  res.flushHeaders();
  
  return{
    send:(data)=>{
      try{
        res.write(`data: ${data}\n\n`);
        // 强制刷新缓冲区，立即发送到客户端
        if (typeof res.flush === 'function') {
          res.flush();
        }
      }catch(err){
        console.error("写入响应数据失败:", err);
      }
    },
    end:()=>{
      try{
        res.write("data: end\n\n");
        res.end();
      }catch(err){
        console.error("结束响应失败:", err);
      }
    },
    error:(err)=>{
      try{
        res.write(`data: error ${err.message}\n\n`);
      }catch(err){
        console.error("写入错误响应失败:", err);
      }
    }
  }
};