"use client";

import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import moment from "moment";
import { saveAs } from "file-saver";
import xssFilters from "xss-filters";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const VideoCallPage = () => {
  const [room, setRoom] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [messages, setMessages] = useState<{ sender: string; msg: string }[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<{ id: string; stream: MediaStream }[]>([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    let roomParam = queryParams.get("room");
    const usernameParam = sessionStorage.getItem("username") || "User" + Math.floor(Math.random() * 1000);

    if (!roomParam) {
      roomParam = uuidv4();
      window.history.replaceState(null, "", `?room=${roomParam}`);
    }

    setRoom(roomParam);
    setUsername(usernameParam);
    sessionStorage.setItem("username", usernameParam);

    socketRef.current = io("http://localhost:8000", {
      reconnection: false,
      query: { room: roomParam },
    });

    socketRef.current.on("connect", () => {
      console.log(`Connected with socket ID: ${socketRef.current?.id}`);
      socketRef.current?.emit("subscribe", {
        room: roomParam,
        socketId: socketRef.current.id,
      });
    });

    socketRef.current.on("new user", (data: { socketId: string }) => {
      if (data.socketId !== socketRef.current?.id) {
        console.log(`New user detected: ${data.socketId}`);
        createPeerConnection(data.socketId, true);
      }
    });

    socketRef.current.on("sdp", handleSdp);
    socketRef.current.on("ice candidates", handleIceCandidate);
    socketRef.current.on("chat", (data: { sender: string; msg: string }) => {
      setMessages((prev) => [...prev, data]);
    });

    startInitialMedia();

    return () => {
      socketRef.current?.disconnect();
      stopMedia();
    };
  }, []);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const startInitialMedia = async () => {
    try {
      const stream = new MediaStream();
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      if (isMicOn) {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStream.getAudioTracks().forEach((track) => stream.addTrack(track));
        updatePeerConnections();
      }
    } catch (error) {
      console.error("Error initializing media:", error);
    }
  };

  const stopMedia = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    }
  };

  const toggleMic = async () => {
    if (!localStream) return;

    setIsMicOn((prev) => !prev);
    if (!isMicOn) {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioTrack = audioStream.getAudioTracks()[0];
        localStream.addTrack(audioTrack);
        updatePeerConnections();
      } catch (error) {
        console.error("Error turning on microphone:", error);
        setIsMicOn(false);
      }
    } else {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.stop();
        localStream.removeTrack(audioTrack);
        updatePeerConnections();
      }
    }
  };

  const toggleCamera = async () => {
    if (!localStream) return;

    setIsCameraOn((prev) => !prev);
    if (!isCameraOn) {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoTrack = videoStream.getVideoTracks()[0];
        localStream.addTrack(videoTrack);
        updatePeerConnections();
      } catch (error) {
        console.error("Error turning on camera:", error);
        setIsCameraOn(false);
      }
    } else {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.stop();
        localStream.removeTrack(videoTrack);
        updatePeerConnections();
      }
    }
  };

  const createPeerConnection = (partnerId: string, isOffer: boolean) => {
    if (peerConnections.current[partnerId]) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnections.current[partnerId] = pc;

    if (localStream) {
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("ice candidates", {
          candidate: event.candidate,
          to: partnerId,
          sender: socketRef.current.id,
        });
      }
    };

    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      setRemoteStreams((prev) => {
        if (!prev.some((stream) => stream.id === partnerId)) {
          console.log(`Adding remote stream from ${partnerId}`);
          return [...prev, { id: partnerId, stream: remoteStream }];
        }
        return prev;
      });
    };

    if (isOffer && localStream && localStream.getTracks().length > 0) {
      negotiateOffer(pc, partnerId);
    }

    return pc;
  };

  const negotiateOffer = async (pc: RTCPeerConnection, partnerId: string) => {
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current?.emit("sdp", {
        description: pc.localDescription,
        to: partnerId,
        sender: socketRef.current.id,
      });
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };

  const handleSdp = async (data: { description: RTCSessionDescriptionInit; sender: string }) => {
    const pc = peerConnections.current[data.sender] || createPeerConnection(data.sender, false);
    try {
      if (data.description.type === "offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data.description));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socketRef.current?.emit("sdp", {
          description: pc.localDescription,
          to: data.sender,
          sender: socketRef.current.id,
        });
      } else if (data.description.type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data.description));
      }
    } catch (error) {
      console.error("Error handling SDP:", error);
    }
  };

  const handleIceCandidate = async (data: { candidate: RTCIceCandidateInit; sender: string }) => {
    const pc = peerConnections.current[data.sender];
    if (pc && data.candidate) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    }
  };

  const updatePeerConnections = () => {
    if (!localStream) return;

    Object.entries(peerConnections.current).forEach(([partnerId, pc]) => {
      pc.getSenders().forEach((sender) => pc.removeTrack(sender));
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
      negotiateOffer(pc, partnerId);
    });
  };

  const sendMessage = (msg: string) => {
    if (msg.trim()) {
      const data = { room, msg, sender: username };
      socketRef.current?.emit("chat", data);
      setMessages((prev) => [...prev, data]);
    }
  };

  const startRecording = () => {
    recordedChunksRef.current = [];
    const stream = localVideoRef.current?.srcObject as MediaStream;
    if (stream && stream.getTracks().length > 0) {
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "video/webm" });
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        saveAs(blob, `recording-${moment().format("YYYY-MM-DD-HH-mm-ss")}.webm`);
      };
      mediaRecorderRef.current.start();
    } else {
      console.warn("No tracks available for recording");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Video Call - Room: {room}</h1>
        <div className="text-center mb-4">
          <p>Share this room ID with others: <strong>{room}</strong></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-full aspect-video rounded-lg shadow-lg border border-gray-700 bg-black"
            />
            <div className="absolute bottom-2 left-2 bg-gray-800 px-2 py-1 rounded text-sm">
              {username} (You)
            </div>
          </div>
          {remoteStreams.map((remote) => (
            <div key={remote.id} className="relative">
              <video
                ref={(el) => {
                  if (el) el.srcObject = remote.stream;
                }}
                autoPlay
                className="w-full aspect-video rounded-lg shadow-lg border border-gray-700 bg-black"
              />
              <div className="absolute bottom-2 left-2 bg-gray-800 px-2 py-1 rounded text-sm">
                User {remote.id.slice(0, 4)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={toggleMic}
            className={`p-3 rounded-full ${
              isMicOn ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"
            } transition`}
            title={isMicOn ? "Turn off Microphone" : "Turn on Microphone"}
          >
            {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>
          <button
            onClick={toggleCamera}
            className={`p-3 rounded-full ${
              isCameraOn ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"
            } transition`}
            title={isCameraOn ? "Turn off Camera" : "Turn on Camera"}
          >
            {isCameraOn ? <Video size={24} /> : <VideoOff size={24} />}
          </button>
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
          >
            Start Recording
          </button>
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            Stop Recording
          </button>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-2xl mx-auto">
          <div
            ref={messageContainerRef}
            className="h-64 overflow-y-auto mb-4 border-b border-gray-700 p-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  msg.sender === username ? "bg-blue-600 ml-auto" : "bg-gray-700"
                } max-w-[70%]`}
              >
                <div className="text-xs opacity-75">{msg.sender}</div>
                <div>{xssFilters.inHTMLData(msg.msg)}</div>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = "";
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoCallPage;