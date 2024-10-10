import React from "react";

const Layout = ({ children, backgroundImage, backgroundColor = 'bg-primary', centerContent = false }) => {
  const backgroundStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};


  const verticalCenterClasses = centerContent ? "flex items-center" : "";

  return (
    <div className={`min-h-screen flex justify-center bg-primary`}>
      {/* Conditionally apply styles for background image or color */}
      <div className={`w-full max-w-xl  ${backgroundImage ? '' : backgroundColor}`} style={backgroundStyle}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
