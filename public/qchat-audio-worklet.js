// Browser audio capture only; no local model or speech recognition.
class QChatCapture extends AudioWorkletProcessor {
  constructor(){super();this.samples=[]}
  process(inputs){
    const input=inputs[0]?.[0];
    if(input)for(const sample of input){
      this.samples.push(Math.max(-1,Math.min(1,sample)));
      if(this.samples.length===1600){
        const buffer=new ArrayBuffer(3200);const view=new DataView(buffer);
        let energy=0;
        for(let i=0;i<1600;i++){const value=this.samples[i];energy+=value*value;view.setInt16(i*2,value<0?value*32768:value*32767,true)}
        this.port.postMessage({buffer,level:Math.sqrt(energy/1600)},[buffer]);this.samples=[];
      }
    }
    return true;
  }
}
registerProcessor("qchat-capture",QChatCapture);
