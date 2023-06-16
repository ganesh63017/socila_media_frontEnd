import React from "react";
import SimpleImageSlider from "react-simple-image-slider";
const SlideShowPreview = ({ slideImages, size }) => {
  return (
    <div>
      <SimpleImageSlider
        width={size ? 410 : 608}
        height={size ? 500 : 400}
        images={slideImages}
        showBullets={true}
        showNavs={true}
        navSize={60}
        startIndex={slideImages.length - 1}
        navStyle={2}
      />
    </div>
  );
};
export default SlideShowPreview;
