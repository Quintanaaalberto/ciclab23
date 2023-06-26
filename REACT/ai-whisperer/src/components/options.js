import PropTypes from "prop-types";
// import React, { Component } from "react";
// import "./option-style.css";

// class Form extends Component {
//     constructor(props) {
//         super(props)

//         this.state = {
//             do: 'Summarize'

//         }

//     }
//     handleDoChange = event => {
//         this.setState({
//             Do: event.target.value
//         })
//     }


//     /* export const OptionsButton = () => { */

//     render() {

//         return (
//             <div>
//                 <label>Do</label>
//                 <select value={this.state.do} onChange={this.handleDoChange}>
//                     <option value="Summarize">Summarize</option>
//                     <option value="Transalate to English">Translate to English</option>
//                     <option value="Paraphrase">Paraphrase</option>
//                 </select>
//             </div>

//             // <button onClick={clickTranscribe} className={`transcribe-button hover-${hover}`}>
//             //     <div className="button">
//             //         <div className="prompt">{text}</div>
//             //     </div>
//             // </button>
//         );
//     };
// };

// export default Form

import React, { useState } from 'react';

function OptionsButton() {
    const [opcionSeleccionada, setOpcionSeleccionada] = useState('');

    const handleChange = (event) => {
        setOpcionSeleccionada(event.target.value);
    };

    return (
        <select value={opcionSeleccionada} onChange={handleChange}>
            <option value="">Selecciona una opción</option>
            <option value="opcion1">Opción 1</option>
            <option value="opcion2">Opción 2</option>
            <option value="opcion3">Opción 3</option>
        </select>
    );
}

export default OptionsButton;

// TranscribeButton.propTypes = {
//     text: PropTypes.string,
//     hover: PropTypes.bool,
// };

// export function clickTranscribe() {
//     console.log("click to transcribe button pressed!");
// }

// export function MoveButton() {
//     const styleBoton = {
//         position: 'absolute',
//         top: '100px',
//         left: '100px',
//     }
// };
