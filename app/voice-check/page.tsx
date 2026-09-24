"use client";
import {useState} from "react";
import {showcaseVoice} from "../showcase-voice";
export default function VoiceCheck(){
  const [status,setStatus]=useState("Ready");const [busy,setBusy]=useState(false);
  async function run(arabic:boolean){setBusy(true);const controller=new AbortController();try{const audio=await fetch(arabic?"/voice-fixture-ar.wav":"/voice-fixture.wav").then(r=>r.blob());const text=await showcaseVoice.transcribe!(audio,arabic?"ar-EG":"en-US",controller.signal,setStatus);setStatus(`Transcript: ${text}`)}catch(error){setStatus(error instanceof Error?error.message:"Failed")}finally{setBusy(false)}}
  return <main style={{padding:32}}><h1>Gemini voice check</h1><p>Synthetic recordings: “Hello, this is a voice test.” / “مرحباً، أريد حذاءً أزرق.” Synthetic test audio is transcribed by Gemini through LangGraph.</p><div style={{display:"flex",gap:24}}><button disabled={busy} onClick={()=>void run(false)}>Test English transcription</button><button disabled={busy} onClick={()=>void run(true)}>Test Arabic transcription</button></div><p role="status">{status}</p></main>
}
