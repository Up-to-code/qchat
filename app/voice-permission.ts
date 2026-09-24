/** Request browser permission from a user gesture, releasing the probe immediately. */
export async function requestMicrophonePermission(devices:Pick<MediaDevices,"getUserMedia">|undefined):Promise<void>{
  if(!devices?.getUserMedia)throw new Error("Microphone access is unavailable in this browser. Open this page in Chrome or Safari on localhost or HTTPS.");
  const stream=await devices.getUserMedia({audio:true});
  for(const track of stream.getTracks())track.stop();
}
export function voiceFailureMessage(error:unknown):string{
  const code=typeof error==="object"&&error!==null?("error" in error?String(error.error):"name" in error?String(error.name):""):"";
  if(code==="NotAllowedError"||code==="not-allowed"||code==="service-not-allowed")return "Microphone permission was denied. Allow microphone access in this site's browser settings, then try again.";
  if(code==="NotFoundError"||code==="audio-capture")return "No microphone is available. Connect or enable a microphone, then try again.";
  if(code==="network")return "The browser's speech recognition service could not connect. Check your connection or configure a transcription provider.";
  if(code==="no-speech")return "No speech was detected. Try speaking again.";
  return error instanceof Error?error.message:"Speech recognition could not start. Try again or use another browser.";
}
