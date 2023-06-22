import PropTypes from "prop-types";
import React from "react";
import "./transcribe-style.css";

export const TranscribeButton = ({ text = "Transcribe", hover }) => {
    return (
        <button onClick={clickTranscribe} className={`transcribe-button hover-${hover}`}>
            <div className="button">
                <div className="prompt">{text}</div>
            </div>
        </button>
    );
};

TranscribeButton.propTypes = {
    text: PropTypes.string,
    hover: PropTypes.bool,
};

export function clickTranscribe() {
    console.log("click to transcribe button pressed!");
}