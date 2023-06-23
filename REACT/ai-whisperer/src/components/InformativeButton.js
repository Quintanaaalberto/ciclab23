import PropTypes from "prop-types";
// import React, { useRef } from "react";
import "./informative-style.css";

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


// Versión 2.0 

// import PropTypes from "prop-types";
// import React, { useRef } from "react";
// import "./informative-style.css";

// export const InformativeButton = ({ text = "Browse File", tagText = "UPLOAD", hover }) => {
//     const fileInputRef = useRef(null);

//     const handleClick = () => {
//         fileInputRef.current.click();
//     };

//     const handleFileChange = (event) => {
//         const selectedFile = event.target.files[0];
//         // Aquí puedes realizar acciones con el archivo seleccionado, como enviarlo al servidor o procesarlo localmente.
//     };

//     return (
//         <div>
//             <button onClick={handleClick}>Browse</button>
//             <input
//                 ref={fileInputRef}
//                 type="file"
//                 style={{ display: 'none' }}
//                 onChange={handleFileChange}
//             />
//         </div>
//     );
// };

// Versión 3.0

import React, { useRef, useState } from 'react';

export const InformativeButton = ({ text = "Browse File", tagText = "UPLOAD", hover }) => {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = () => {
            const fileContent = reader.result;
            // Aquí puedes hacer algo con el contenido del archivo, como mostrarlo en la interfaz de usuario.
            console.log(fileContent);
        };
        reader.readAsText(file);
    };

    return (
        <div className="informative-button">
            <div className={`button hover-${hover}`}>
                <button onClick={handleClick} className="tag">
                    <div className="tag-text">{tagText}</div>
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                {selectedFile && (
                    <div>
                        <h2>Archivo seleccionado:</h2>
                        <p>Nombre: {selectedFile.name}</p>
                        {/* <p>Tipo: {selectedFile.type}</p>
                    <p>Tamaño: {selectedFile.size} bytes</p> */}
                    </div>
                )}
            </div>
        </div>
    );
};

InformativeButton.propTypes = {
    text: PropTypes.string,
    tagText: PropTypes.string,
    hover: PropTypes.bool,
};

// versión 4.0

// import React, { useRef, useState } from 'react';

// const FileExplorerButton = () => {
//   const fileInputRef = useRef(null);
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedFile(file);

//     // Realiza otras acciones con el archivo seleccionado si es necesario
//   };

//   return (
//     <div>
//       <div>
//         <button onClick={handleClick}>Explorar</button>
//       </div>
//       <div>
//         <input
//           ref={fileInputRef}
//           type="file"
//           style={{ display: 'none' }}
//           onChange={handleFileChange}
//         />
//       </div>
//       <div>
//         {selectedFile ? (
//           <div>
//             <h2>Archivo seleccionado:</h2>
//             <p>Nombre: {selectedFile.name}</p>
//             <p>Tipo: {selectedFile.type}</p>
//             <p>Tamaño: {selectedFile.size} bytes</p>
//           </div>
//         ) : (
//           <p>No se ha seleccionado ningún archivo.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FileExplorerButton;
