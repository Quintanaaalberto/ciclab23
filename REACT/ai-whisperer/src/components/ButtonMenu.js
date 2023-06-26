import PropTypes from "prop-types";
import React from "react";
import "./button-style.css";

// export const ButtonComponent = () => {
//     const handleButtonClick = (buttonNumber) => {
//         console.log(`Se pulsó el botón ${buttonNumber}`);
//         // Aquí se añaden las acciones de los botones

//         return (
//             <div>
//                 <button className="button" onClick={() => handleButtonClick(1)}>Resumir</button>
//                 <button className="button" onClick={() => handleButtonClick(2)}>Traducir</button>
//                 <button className="button" onClick={() => handleButtonClick(3)}>Corregir</button>
//             </div>
//         );
//     };
// };
export const ButtonComponent = ({ text = "Summarize", hover }) => {
    return (
        <button onClick={clickResume} className={`resume-button hover-${hover}`}>
            <div className="button">
                <div className="prompt">{text}</div>
            </div>
        </button>
    );
};

ButtonComponent.propTypes = {
    text: PropTypes.string,
    hover: PropTypes.bool,
};

export function clickResume() {
    console.log("click to summarize button pressed!");
}