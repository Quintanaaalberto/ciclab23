// import PropTypes from "prop-types";
// import React, { useRef } from "react";
// import "./informative-style.css";

// export const InformativeButton = ({ text = "Browse File", tagText = "UPLOAD", hover }) => {
//     return (
//         <div className="informative-button">
//             <div className={`button hover-${hover}`}>
//                 <button onClick={uploadFile} className="tag">
//                     <div className="tag-text">{tagText}</div>
//                 </button>
//                 <div className="side-text">{text}</div>
//             </div>
//         </div>
//     );
// }

// InformativeButton.propTypes = {
//     text: PropTypes.string,
//     tagText: PropTypes.string,
//     hover: PropTypes.bool,
// };

// function uploadFile() {
//     console.log("upload file button pressed!")
// }

import PropTypes from "prop-types";
import React, { useRef } from "react";
import "./informative-style.css";

export const InformativeButton = ({ text = "Browse File", tagText = "UPLOAD", hover }) => {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        // Aquí puedes realizar acciones con el archivo seleccionado, como enviarlo al servidor o procesarlo localmente.
    };

    return (
        <div>
            <button onClick={handleClick}>Browse</button>
            <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
};

