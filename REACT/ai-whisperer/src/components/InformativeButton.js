import PropTypes from "prop-types";
import React from "react";
import "./informative-style.css";

export const InformativeButton = ({ text = "Browse File", tagText = "UPLOAD", hover }) => {
    return (
        <div className="informative-button">
            <div className={ `button hover-${hover}` }>
                <button onClick={uploadFile} className="tag">
                    <div className="tag-text">{tagText}</div>
                </button>
                <div className="side-text">{text}</div>
            </div>
        </div>
    );
}

InformativeButton.propTypes = {
    text: PropTypes.string,
    tagText: PropTypes.string,
    hover: PropTypes.bool,
};

function uploadFile() {
    console.log("upload file button pressed!")
}