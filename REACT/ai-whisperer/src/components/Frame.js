import React from "react";
import { InformativeButton } from "./InformativeButton"
import { AudioButton } from "./RoundButton-2";
import { TranscribeButton } from "./TranscribeButton"
import { ButtonComponent } from "./ButtonMenu"
import "./style.css"

function traducir() {
    console.log("Traducir el texto generado")
}

function resumir() {
    console.log("Resumir el texto generado")
}

function corregir() {
    console.log("Corregir el texto generado")
}


export const Frame = () => {
    return (
        <div className="frame">
            <div className="overlap-group-wrapper">
                <div className="overlap-group">
                    <div className="overlap">
                        <div className="rectangle" />
                        <div className="transcribe-button-2">
                            <img src="text-format.png" />
                            <TranscribeButton hover text="Transcribe" />
                            {/*<TranscribeButton hover text="Transcribe"/>*/}
                            <div className="options-button-2">
                                <button onClick={traducir}>Traducir</button>
                                <button onClick={resumir}>Resumir</button>
                                <button onClick={corregir}>Corregir</button>
                                {/*<ButtonComponent hover text="Resumir"/>*/}
                            </div>
                        </div>
                    </div>

                    <div className="overlap-2">
                        <div className="rectangle-2" />
                        <div className="informative-button-2">
                            <InformativeButton hover={false} tagText="BROWSE" text={upload_text} />
                            {/*<InformativeButton hover tagText="UPLOAD" text="Browse File"/>*/}
                        </div>
                    </div>
                    <div className="round-button-2">
                        <AudioButton />
                        {/*<RoundButton hover/>*/}
                    </div>
                </div>
            </div>
        </div>
    )
}

let upload_text = "Upload an audio file from your computer";