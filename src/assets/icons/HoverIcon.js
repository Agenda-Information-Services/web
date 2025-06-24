import React, { useState } from "react";

const HoverIcon = ({ staticSrc, hoverSrc }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <img
            src={isHovered ? hoverSrc : staticSrc}
            alt="icon"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                width: 70,
                height: 70,
                marginBottom: 6,
                transition: "opacity 0.2s ease",
            }}
        />
    );
};

export default HoverIcon;