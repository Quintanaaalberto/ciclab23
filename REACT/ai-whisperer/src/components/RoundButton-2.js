import PropTypes from "prop-types";
import React, {useRef, useState} from "react";
import "./round-style.css";

export const AudioButton = () => {
    let [recordOption, setRecordOption] = useState("video");


    return (
        <div className="audio-recorder-wrapper">
            <img src={require("./211859_mic_icon-1.png")} alt="microphone icon"/>
            <div className="audio-recorder">
                <AudioRecorder />
            </div>
        </div>
    );
}



const AudioRecorder = () => {

    const mimeType = "audio/webm";

    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);

    const startRecording = async () => {

        console.log("event: start recording");

        setRecordingStatus("recording");
        //create new Media recorder instance using the stream
        const media = new MediaRecorder(stream, { type: mimeType });
        //set the MediaRecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();
        let localAudioChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
    };

    const stopRecording = () => {

        console.log("event: stop recording");

        setRecordingStatus("inactive");
        //stops the recording instance
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            //creates a blob file from the audiochunks data
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            //creates a playable URL from the blob file.
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudio(audioUrl);
            setAudioChunks([]);
        };
    };

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(streamData);
            } catch (err) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };
    return (
        <div>
            <main>
                <div className="audio-controls">
                    {!permission ? (
                        <button onClick={getMicrophonePermission} className="get-mic" type="button">
                            Get Microphone
                        </button>
                    ) : null}
                    {permission && recordingStatus === "inactive" ? (
                        <button onClick={startRecording} className="start-mic" type="button">
                            Start Recording
                        </button>
                    ) : null}
                    {recordingStatus === "recording" ? (
                        <button onClick={stopRecording} className="stop-mic" type="button">
                            Stop Recording
                        </button>
                    ) : null}
                    {audio ? (
                        <div className="audio-bubble-wrapper">
                            <audio className="audio-bubble" src={audio} controls></audio>
                            <div className="audio-object">
                                <a download href={audio}>Download Recording</a>
                            </div>
                        </div>
                    ) : null}
                </div>

            </main>
        </div>
    );
};

