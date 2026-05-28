export const createStreamResponse = (res)=>{
  
  // 这个响应头是必要的，用于启用服务器发送事件（SSE）功能
  res.setHeader("Content-Type", "text/event-stream");
  // 这两个响应头是必要的，用于确保浏览器不会缓存响应
  // 且保持连接打开，直到客户端关闭连接
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  return{
    send:(data)=>{
      try{
        res.write(data);
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