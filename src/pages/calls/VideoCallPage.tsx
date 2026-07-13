import React, { useState, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Monitor } from 'lucide-react';

export const VideoCallPage = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsCalling(true);
    } catch (err) {
      alert("Could not access camera/mic: " + err);
    }
  };

  const endCall = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    setIsCalling(false);
    setIsScreenSharing(false);
  };

  const toggleVideo = () => {
    streamRef.current?.getVideoTracks().forEach(t => t.enabled = !isVideoOn);
    setIsVideoOn(!isVideoOn);
  };

  const toggleMic = () => {
    streamRef.current?.getAudioTracks().forEach(t => t.enabled = !isMicOn);
    setIsMicOn(!isMicOn);
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        
        // Replace current video track with screen track
        streamRef.current?.removeTrack(streamRef.current.getVideoTracks()[0]);
        streamRef.current?.addTrack(screenTrack);
        
        if (videoRef.current) videoRef.current.srcObject = streamRef.current;
        setIsScreenSharing(true);
      } else {
        // This is a simplified revert; in a real app, you'd store the original camera track
        alert("Screen share stopped. Please restart call to switch back to camera.");
        endCall();
      }
    } catch (err) {
      console.error("Screen share error:", err);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Video Call Chamber</h1>

      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl aspect-video flex items-center justify-center relative">
        {isCalling ? (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        ) : (
          <p className="text-gray-400">Click "Start Call" to begin.</p>
        )}
      </div>

      <div className="mt-6 flex justify-center gap-4">
        {!isCalling ? (
          <button onClick={startCall} className="bg-green-600 text-white px-8 py-3 rounded-full flex items-center gap-2">
            <Phone size={20} /> Start Call
          </button>
        ) : (
          <>
            <button onClick={toggleVideo} className={`p-4 rounded-full ${isVideoOn ? 'bg-gray-200' : 'bg-red-500 text-white'}`}>
              {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
            </button>
            <button onClick={toggleMic} className={`p-4 rounded-full ${isMicOn ? 'bg-gray-200' : 'bg-red-500 text-white'}`}>
              {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
            <button onClick={toggleScreenShare} className={`p-4 rounded-full ${isScreenSharing ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              <Monitor size={24} />
            </button>
            <button onClick={endCall} className="bg-red-600 text-white p-4 rounded-full">
              <PhoneOff size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};