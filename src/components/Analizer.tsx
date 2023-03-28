import { useCallback, useEffect, useRef } from "react";
import { analyser, audioContext } from "../utils/filter";

const data = new Uint8Array(analyser.frequencyBinCount);

function Analizer() {
  const analyserCanvas = useRef<HTMLCanvasElement>(null);
   const loopingFunction = useCallback(() => {
    const ctx = analyserCanvas.current?.getContext('2d');
     if (!ctx || !analyserCanvas.current) {
       return;
     }
    requestAnimationFrame(loopingFunction);
    analyser.getByteFrequencyData(data);
    ctx.fillStyle = 'white';          
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#d5d4d5';
    const space = analyserCanvas.current.width / data.length;
    ctx.clearRect(0, 0, analyserCanvas.current.width, analyserCanvas.current.height)
    data.forEach((value, idx) => {
        ctx.beginPath();
        ctx.moveTo(space * idx, analyserCanvas.current!.height); 
        ctx.lineTo(space * idx, analyserCanvas.current!.height - value); 
        ctx.stroke();
    });
    ctx.strokeStyle = 'black';
    ctx.font = "48px serif";
    ctx.textAlign = 'center'
    const lineHeight = 10
    for (let i = 0.1; i < 0.9; i+=0.1) { 
      ctx.beginPath();
      ctx.moveTo(analyserCanvas.current.width*i, analyserCanvas.current!.height); 
      ctx.lineTo(analyserCanvas.current.width*i, analyserCanvas.current!.height - lineHeight); 
      ctx.stroke();
      ctx.strokeText(`${Math.floor(i*audioContext.sampleRate/2)}`, analyserCanvas.current.width*i, analyserCanvas.current!.height - lineHeight)
    }
    console.log(data.reduce((a, b) => Math.max(a, b)))
  }, []);
  
  useEffect(() => {
    requestAnimationFrame(loopingFunction)
  }, [loopingFunction])

  return (
      <canvas width={document.body.clientWidth} height={document.body.scrollHeight} ref={analyserCanvas} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}></canvas>
  );
}

export default Analizer;
