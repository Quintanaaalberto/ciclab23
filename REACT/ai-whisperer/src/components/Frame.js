import React from "react";
import { InformativeButton } from "./InformativeButton"
import { RoundButton } from "./RoundButton";
import { TranscribeButton} from "./TranscribeButton"
import "./style.css"

export const Frame = () => {
    return(
        <div className="frame">
            <div className="overlap-group-wrapper">
                <div className="overlap-group">
                    <div className="overlap">
                        <div className="rectangle"/>
                        <div className="transcribe-button-2">
                            <TranscribeButton hover text="Transcribe"/>
                            {/*<TranscribeButton hover text="Transcribe"/>*/}
                        </div>
                    </div>
                    <div className="overlap-2">
                        <div className="rectangle-2"/>
                        <div className="informative-button-2">
                            <InformativeButton hover={false} tagText="BROWSE" text={upload_text}/>
                            {/*<InformativeButton hover tagText="UPLOAD" text="Browse File"/>*/}
                        </div>
                    </div>
                    <div className="round-button-2">
                        <RoundButton hover="false" imageSrc="./211859_mic_icon-1.png"/>
                        {/*<RoundButton hover/>*/}
                    </div>
                </div>
            </div>
        </div>
    )
}

let upload_text = "Upload an audio file from your computer";