import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const PLAN_URLS: Record<string,string> = {
  starter: 'https://pay.cakto.com.br/8euvzxd',
  pro: 'https://pay.cakto.com.br/37beu86',
  enterprise: 'https://pay.cakto.com.br/izhvx9t',
      {selectedVideo && <VideoPlayerModal video={selectedVideo} onClose={()=>setSelectedVideo(null)}/>}
    </>
  )
}

function VideoGrid({videos, onSelect}) {
  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"14px"}}>
      {(videos||[]).filter(v=>v&&v.id).map(v=>(
        <div key={v.id} onClick={()=>onSelect(v)}
          style={{background:"#0e1219",border:"1px solid #1e2840",borderRadius:"12px",overflow:"hidden",cursor:"pointer",transition:"all .2s"}}
          onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor="#ff3c5c";el.style.transform="translateY(-2px)"}}
          onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor="#1e2840";el.style.transform="translateY(0)"}}>
          <div style={{height:"120px",background:"linear-gradient(135deg,#0d0d1a,#1a0820)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
            {v.images&&v.images[0]
              ?<img src={v.images[0]} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:0.55}}/>
              :<div style={{position:"absolute",inset:0,background:"radial-gradient(circle,rgba(255,60,92,.1),transparent 70%)"}}/>
            }
            <div style={{position:"relative",zIndex:1,width:"44px",height:"44px",background:"linear-gradient(135deg,#ff3c5c,#ff6b35)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"18px",boxShadow:"0 4px 20px rgba(255,60,92,.5)"}}>&#9654;</div>
            <div style={{position:"absolute",top:"8px",left:"8px",display:"flex",gap:"4px",zIndex:2}}>
              {(Array.isArray(v.platforms)?v.platforms:[]).slice(0,2).map(p=>(
                <span key={p} style={{fontSize:"9px",padding:"2px 6px",borderRadius:"4px",background:p==="youtube"?"rgba(255,0,0,.9)":p==="tiktok"?"rgba(0,0,0,.9)":"rgba(188,24,136,.9)",color:"#fff",fontWeight:700}}>
                  {p==="youtube"?"YT":p==="tiktok"?"TT":"IG"}
                </span>
              ))}
            </div>
            <div style={{position:"absolute",bottom:"8px",right:"8px",zIndex:2,display:"flex",gap:"4px"}}>
              {v.hasAudio&&<span style={{fontSize:"9px",padding:"2px 5px",borderRadius:"3px",background:"rgba(0,208,132,.9)",color:"#fff",fontWeight:700}}>VOZ</span>}
              {v.hasImages&&<span style={{fontSize:"9px",padding:"2px 5px",borderRadius:"3px",background:"rgba(124,58,237,.9)",color:"#fff",fontWeight:700}}>IMG</span>}
            </div>
          </div>
          <div style={{padding:"10px 12px"}}>
            <div style={{fontSize:"12px",fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",color:"#f0f2f8",marginBottom:"4px"}}>{v.title||"Sem titulo"}</div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"10px",color:"#4a5568"}}>
              <span>{v.duration==="short"?"30-60s":v.duration==="long"?"15-30min":"5-10min"}</span>
              <span style={{color:"#ff3c5c",fontWeight:600}}>Assistir</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function VideoPlayerModal({video, onClose}) {
  const canvasRef = React.useRef(null)
  const audioRef = React.useRef(null)
  const rafRef = React.useRef(null)
  const [tab, setTab] = React.useState("player")
  const [playing, setPlaying] = React.useState(false)
  const [scene, setScene] = React.useState(0)
  const [imgs, setImgs] = React.useState([])
  const [ready, setReady] = React.useState(false)
  const [dl, setDl] = React.useState(false)
  const [dlPct, setDlPct] = React.useState(0)
  const [dlMsg, setDlMsg] = React.useState("")

  const images = video.images || []
  const scenes = video.scenes || []
  const N = Math.max(images.length, scenes.length, 1)
  const sps = video.duration==="short" ? 3 : video.duration==="long" ? 7 : 5

  React.useEffect(()=>{
    if(images.length===0){setReady(true);return}
    let done=0
    const loaded=[]
    images.forEach((url,i)=>{
      const img=new Image();img.crossOrigin="anonymous"
      img.onload=()=>{loaded[i]=img;done++;if(done===images.length){setImgs(loaded);setReady(true)}}
      img.onerror=()=>{loaded[i]=null;done++;if(done===images.length){setImgs(loaded);setReady(true)}}
      img.src=url
    })
  },[])

  const drawFrame = React.useCallback((ctx, sc, pct)=>{
    const W=1280,H=720
    ctx.clearRect(0,0,W,H)
    const img=imgs[sc]||imgs[0]||null
    if(img){
      const s=1+pct*0.04
      ctx.save();ctx.filter="brightness(0.5) saturate(0.7)"
      ctx.drawImage(img,(W-W*s)/2,(H-H*s)/2,W*s,H*s)
      ctx.restore()
    } else {
      const g=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,600)
      g.addColorStop(0,"#1a0820");g.addColorStop(1,"#000")
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H)
    }
    const ov=ctx.createLinearGradient(0,H*.4,0,H)
    ov.addColorStop(0,"rgba(0,0,0,0)");ov.addColorStop(1,"rgba(0,0,0,.9)")
    ctx.fillStyle=ov;ctx.fillRect(0,0,W,H)
    const txt=scenes[sc]?scenes[sc].text||(video.script||"").substring(sc*90,(sc+1)*90):(video.script||"").substring(sc*90,(sc+1)*90)
    if(txt){
      ctx.save()
      ctx.fillStyle="rgba(0,0,0,.6)";ctx.fillRect(60,H-136,W-120,116)
      ctx.fillStyle="#fff";ctx.font="bold 28px Arial";ctx.textAlign="center"
      ctx.shadowColor="rgba(0,0,0,.95)";ctx.shadowBlur=8
      const words=txt.split(" ");let line="";let y=H-94
      for(const w of words){const t=line?line+" "+w:w;if(ctx.measureText(t).width>W-140&&line){ctx.fillText(line,W/2,y);line=w;y+=36}else line=t}
      if(line)ctx.fillText(line,W/2,y)
      ctx.restore()
    }
    ctx.fillStyle="rgba(0,0,0,.7)";ctx.fillRect(18,18,162,36)
    ctx.fillStyle="#ff3c5c";ctx.font="bold 14px Arial";ctx.textAlign="left";ctx.shadowBlur=0
    ctx.fillText("NOCTURN.AI",30,42)
    ctx.fillStyle="rgba(255,60,92,.85)";ctx.fillRect(W-72,18,54,30)
    ctx.fillStyle="#fff";ctx.font="bold 12px Arial";ctx.textAlign="center"
    ctx.fillText((sc+1)+"/"+N,W-45,37)
    const prog=(sc+pct)/N
    ctx.fillStyle="rgba(255,60,92,.9)";ctx.fillRect(0,H-4,W*prog,4)
  },[imgs,scenes,video.script,N])

  React.useEffect(()=>{
    if(ready&&canvasRef.current){
      const ctx=canvasRef.current.getContext("2d")
      drawFrame(ctx,0,0)
    }
  },[ready,drawFrame])

  const startPlay=()=>{
    if(!ready||!canvasRef.current)return
    setPlaying(true);setScene(0)
    if(audioRef.current&&video.audioBase64){audioRef.current.currentTime=0;audioRef.current.play().catch(()=>{})}
    let sc=0,t0=performance.now()
    const loop=()=>{
      const pct=Math.min((performance.now()-t0)/1000/sps,1)
      drawFrame(canvasRef.current.getContext("2d"),sc,pct)
      if(pct>=1){sc++;t0=performance.now();setScene(sc)
        if(sc>=N){drawFrame(canvasRef.current.getContext("2d"),N-1,1);setPlaying(false);setScene(0);if(audioRef.current){audioRef.current.pause();audioRef.current.currentTime=0}return}
      }
      rafRef.current=requestAnimationFrame(loop)
    }
    rafRef.current=requestAnimationFrame(loop)
  }

  const stopPlay=()=>{
    setPlaying(false);setScene(0)
    if(rafRef.current)cancelAnimationFrame(rafRef.current)
    if(audioRef.current){audioRef.current.pause();audioRef.current.currentTime=0}
    if(canvasRef.current&&ready)drawFrame(canvasRef.current.getContext("2d"),0,0)
  }

  React.useEffect(()=>()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current)},[])

  const download=async()=>{
    if(!images.length){alert("Gere um novo video para ter imagens.");return}
    setDl(true);setDlPct(0);setDlMsg("Preparando...")
    try{
      const off=document.createElement("canvas")
      off.width=1280;off.height=720
      const ctx=off.getContext("2d")
      const stream=off.captureStream(30)
      if(video.audioBase64){
        try{
          const ac=new AudioContext()
          const buf=await(await fetch(video.audioBase64)).arrayBuffer()
          const dec=await ac.decodeAudioData(buf)
          const dest=ac.createMediaStreamDestination()
          const src=ac.createBufferSource()
          src.buffer=dec;src.connect(dest);src.start()
          dest.stream.getAudioTracks().forEach(t=>stream.addTrack(t))
        }catch(e){console.log("audio",e)}
      }
      const chunks=[]
      const mime=MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")?"video/webm;codecs=vp9,opus":"video/webm"
      const rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:3000000})
      rec.ondataavailable=e=>{if(e.data.size>0)chunks.push(e.data)}
      rec.start(100)
      const FPS=30,total=N*sps*FPS
      for(let f=0;f<total;f++){
        const sc=Math.min(Math.floor(f/(sps*FPS)),N-1)
        const pct=(f%(sps*FPS))/(sps*FPS)
        drawFrame(ctx,sc,pct)
        if(f%FPS===0){setDlPct(Math.round(f/total*90));setDlMsg("Cena "+(sc+1)+" de "+N+"...");await new Promise(r=>setTimeout(r,0))}
      }
      setDlMsg("Finalizando...");rec.stop()
      await new Promise(res=>{rec.onstop=res})
      setDlPct(97)
      const blob=new Blob(chunks,{type:mime})
      const url=URL.createObjectURL(blob)
      const a=document.createElement("a")
      a.href=url;a.download=(video.title||"video").replace(/[^a-zA-Z0-9]/g,"_").substring(0,50)+".webm"
      document.body.appendChild(a);a.click();document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setDlPct(100);setDlMsg("Baixado!")
      setTimeout(()=>{setDl(false);setDlPct(0)},2500)
    }catch(e){console.error(e);alert("Erro: "+e.message);setDl(false);setDlPct(0)}
  }

  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.93)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"16px",backdropFilter:"blur(6px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#080b10",border:"1px solid #1e2840",borderRadius:"18px",width:"100%",maxWidth:"800px",maxHeight:"94vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 32px 100px rgba(0,0,0,.95)"}}>

        <div style={{padding:"12px 16px",borderBottom:"1px solid #1e2840",display:"flex",alignItems:"center",gap:"10px",flexShrink:0}}>
          <div style={{flex:1,overflow:"hidden"}}>
            <div style={{fontSize:"14px",fontWeight:800,color:"#f0f2f8",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{video.title||"Video"}</div>
            <div style={{display:"flex",gap:"4px",marginTop:"3px",flexWrap:"wrap"}}>
              {(video.platforms||[]).map(p=><span key={p} style={{fontSize:"9px",padding:"1px 6px",borderRadius:"3px",background:p==="youtube"?"rgba(255,0,0,.2)":"rgba(255,255,255,.08)",color:p==="youtube"?"#ff5555":"#aaa",fontWeight:700}}>{p}</span>)}
              {video.hasAudio&&<span style={{fontSize:"9px",padding:"1px 6px",borderRadius:"3px",background:"rgba(0,208,132,.15)",color:"#00d084",fontWeight:700}}>ElevenLabs</span>}
              {images.length>0&&<span style={{fontSize:"9px",padding:"1px 6px",borderRadius:"3px",background:"rgba(124,58,237,.15)",color:"#a78bfa",fontWeight:700}}>{images.length} cenas</span>}
            </div>
          </div>
          <div style={{display:"flex",gap:"3px",background:"#0e1219",borderRadius:"7px",padding:"2px"}}>
            {["player","roteiro","tags"].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{background:tab===t?"linear-gradient(135deg,#ff3c5c,#ff6b35)":"transparent",color:tab===t?"#fff":"#8892a4",border:"none",borderRadius:"5px",padding:"5px 10px",fontSize:"11px",fontWeight:700,cursor:"pointer"}}>
                {t==="player"?"Player":t==="roteiro"?"Roteiro":"Tags"}
              </button>
            ))}
          </div>
          <button onClick={()=>{stopPlay();onClose()}} style={{background:"rgba(255,255,255,.06)",border:"1px solid #1e2840",color:"#8892a4",fontSize:"14px",cursor:"pointer",width:"28px",height:"28px",borderRadius:"7px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>x</button>
        </div>

        <div style={{flex:1,overflow:"auto"}}>
          {tab==="player"&&<div>

            <div style={{position:"relative",background:"#000",lineHeight:0}}>
              <canvas ref={canvasRef} width={1280} height={720} style={{width:"100%",display:"block",maxHeight:"400px"}}/>
              {!playing&&ready&&images.length>0&&(
                <div onClick={startPlay} style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:"rgba(0,0,0,.1)"}}>
                  <div style={{width:"72px",height:"72px",background:"linear-gradient(135deg,#ff3c5c,#ff6b35)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"28px",color:"#fff",boxShadow:"0 8px 40px rgba(255,60,92,.7)"}}>&#9654;</div>
                </div>
              )}
              {!ready&&(
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#000"}}>
                  <div style={{color:"#8892a4",fontSize:"13px",textAlign:"center"}}>
                    <div style={{fontSize:"28px",marginBottom:"8px",opacity:0.4}}>&#9654;</div>
                    Carregando...
                  </div>
                </div>
              )}
              {images.length===0&&ready&&(
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0d0820,#000)",gap:"12px"}}>
                  <div style={{fontSize:"36px",opacity:0.4}}>&#127916;</div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:"13px",fontWeight:700,color:"#f0f2f8",marginBottom:"5px"}}>Video sem imagens</div>
                    <div style={{fontSize:"11px",color:"#4a5568"}}>Gere um novo video para ver o player completo</div>
                  </div>
                </div>
              )}
            </div>

            {video.audioBase64&&<audio ref={audioRef} src={video.audioBase64} style={{display:"none"}}/>}

            <div style={{padding:"12px 16px",borderBottom:"1px solid #1e2840",display:"flex",gap:"8px",alignItems:"center",flexWrap:"wrap"}}>
              {ready&&(!playing
                ?<button onClick={startPlay} style={{background:"linear-gradient(135deg,#ff3c5c,#ff6b35)",color:"#fff",border:"none",borderRadius:"8px",padding:"9px 20px",fontSize:"13px",fontWeight:700,cursor:"pointer"}}>
                  &#9654; Reproduzir{video.hasAudio?" com narracao":""}
                </button>
                :<button onClick={stopPlay} style={{background:"#1e2840",color:"#f0f2f8",border:"none",borderRadius:"8px",padding:"9px 18px",fontSize:"13px",fontWeight:700,cursor:"pointer"}}>&#9632; Parar</button>
              )}
              {images.length>0&&(
                <button onClick={download} disabled={dl}
                  style={{background:dl?"#1e2840":"linear-gradient(135deg,#6d28d9,#a855f7)",color:"#fff",border:"none",borderRadius:"8px",padding:"9px 18px",fontSize:"13px",fontWeight:700,cursor:dl?"not-allowed":"pointer",opacity:dl?0.8:1}}>
                  {dl?"Gerando...":"&#11123; Baixar .webm"}
                </button>
              )}
              {video.hasAudio&&<span style={{fontSize:"11px",color:"#00d084",fontWeight:600}}>Narracao ElevenLabs</span>}
            </div>

            {dl&&(
              <div style={{padding:"8px 16px",borderBottom:"1px solid #1e2840"}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"10px",color:"#4a5568",marginBottom:"4px"}}>
                  <span>{dlMsg}</span><span>{dlPct}%</span>
                </div>
                <div style={{height:"4px",background:"#1e2840",borderRadius:"2px",overflow:"hidden"}}>
                  <div style={{height:"100%",width:dlPct+"%",background:"linear-gradient(90deg,#6d28d9,#a855f7)",borderRadius:"2px",transition:"width .3s"}}/>
                </div>
              </div>
            )}

            {images.length>0&&(
              <div style={{padding:"10px 16px"}}>
                <div style={{fontSize:"10px",color:"#4a5568",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:"7px",fontFamily:"monospace"}}>{N} cenas — clique para navegar</div>
                <div style={{display:"flex",gap:"6px",overflowX:"auto",paddingBottom:"4px"}}>
                  {images.map((img,i)=>(
                    <div key={i} onClick={()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current);setPlaying(false);setScene(i);if(canvasRef.current&&ready){drawFrame(canvasRef.current.getContext("2d"),i,0)}}}
                      style={{flexShrink:0,borderRadius:"6px",overflow:"hidden",cursor:"pointer",border:scene===i&&!playing?"2px solid #ff3c5c":"2px solid transparent",width:"90px",height:"56px",position:"relative"}}>
                      <img src={img} alt="" style={{width:"90px",height:"56px",objectFit:"cover",filter:"brightness(0.6)"}}/>
                      <div style={{position:"absolute",bottom:"2px",left:"3px",fontSize:"8px",color:"#fff",fontWeight:700}}>C{i+1}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>}

          {tab==="roteiro"&&<div style={{padding:"16px"}}>
            <div style={{background:"#0a0d13",border:"1px solid #1a2235",borderRadius:"10px",padding:"14px",marginBottom:"12px",maxHeight:"280px",overflowY:"auto"}}>
              <pre style={{fontSize:"13px",color:"#d0d8e8",lineHeight:1.9,whiteSpace:"pre-wrap",margin:0,fontFamily:"inherit"}}>{video.script||"Roteiro nao disponivel."}</pre>
            </div>
            {video.description&&<div style={{background:"rgba(124,58,237,.08)",border:"1px solid rgba(124,58,237,.2)",borderRadius:"8px",padding:"11px",marginBottom:"12px"}}>
              <p style={{fontSize:"12px",color:"#8892a4",lineHeight:1.7,margin:0}}>{video.description}</p>
            </div>}
            <div style={{display:"flex",gap:"8px"}}>
              <button onClick={()=>navigator.clipboard&&navigator.clipboard.writeText(video.script||"").catch(()=>{})} style={{background:"linear-gradient(135deg,#ff3c5c,#ff6b35)",color:"#fff",border:"none",borderRadius:"7px",padding:"8px 14px",fontSize:"12px",fontWeight:700,cursor:"pointer"}}>
                Copiar roteiro
              </button>
              {video.description&&<button onClick={()=>navigator.clipboard&&navigator.clipboard.writeText(video.description||"").catch(()=>{})} style={{background:"transparent",border:"1px solid #7c3aed",color:"#a78bfa",borderRadius:"7px",padding:"8px 14px",fontSize:"12px",fontWeight:700,cursor:"pointer"}}>
                Copiar descricao
              </button>}
            </div>
          </div>}

          {tab==="tags"&&<div style={{padding:"16px"}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"7px",marginBottom:"14px"}}>
              {(video.tags||[]).map((tag,i)=>(
                <span key={i} style={{background:"rgba(0,208,132,.08)",border:"1px solid rgba(0,208,132,.2)",color:"#00d084",padding:"5px 12px",borderRadius:"14px",fontSize:"12px"}}>#{tag}</span>
              ))}
            </div>
            {(video.tags||[]).length>0&&<button onClick={()=>navigator.clipboard&&navigator.clipboard.writeText((video.tags||[]).map(t=>"#"+t).join(" ")).catch(()=>{})} style={{background:"transparent",border:"1px solid #1e2840",color:"#8892a4",borderRadius:"7px",padding:"7px 14px",fontSize:"12px",cursor:"pointer"}}>
              Copiar todas as tags
            </button>}
          </div>}
        </div>
      </div>
    </div>
  )
}
