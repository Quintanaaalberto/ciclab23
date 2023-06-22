import PropTypes from "prop-types";
import React, {useState}from "react";
import "./round-style.css";

export const RoundButton = ({ imageSrc }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={toggleAudio}
            className={`round-button ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img src={imageSrc} alt="button icon" />
        </button>
    );
}

RoundButton.propTypes = {
    imageSrc: PropTypes.string.isRequired,
    // hover: PropTypes.bool,
};

function toggleAudio() {
    console.log("toggle audio recording pressed!");
}