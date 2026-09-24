/** Bounded voice turn: finish after speech followed by silence, or after 30 seconds. */
export function watchVoiceTurn(stream:MediaStream,finish:()=>void,onLevel?:(level:number,elapsedMs:number)=>void):()=>void{
  const context=new AudioContext();
  const source=context.createMediaStreamSource(stream);
  const analyser=context.createAnalyser();analyser.fftSize=1024;source.connect(analyser);
  const samples=new Float32Array(analyser.fftSize);const started=Date.now();let lastSpeech=started;let heardSpeech=false;
  const timer=setInterval(()=>{
    analyser.getFloatTimeDomainData(samples);
    const rms=Math.sqrt(samples.reduce((sum,value)=>sum+value*value,0)/samples.length);
    onLevel?.(Math.min(1,rms*12),Date.now()-started);
    if(rms>.015){heardSpeech=true;lastSpeech=Date.now()}
    if((heardSpeech&&Date.now()-lastSpeech>1600)||(!heardSpeech&&Date.now()-started>10000)||Date.now()-started>30000)finish();
  },150);
  return ()=>{clearInterval(timer);source.disconnect();void context.close()};
}
