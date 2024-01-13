import React, { useState, createContext } from 'react';

export const ImageContext = createContext();

export const ImageProvider = (props) => {
    const [imageData, setImageData] = useState([]);

    return (
        <ImageContext.Provider value={[imageData, setImageData]}>
            {props.children}
        </ImageContext.Provider>
    );
};

