import React from "react";

const PhotoGallery = ({ hotel }) => {
  console.log("THis is hotel photot");
  console.log(hotel.hotel.photos);
  let photos = [
    {
      url: hotel.hotel.photos[0],
    },
    {
      url: hotel.hotel.photos[0],
    },
    {
      url: hotel.hotel.photos[0],
    },
    {
      url: hotel.hotel.photos[0],
    },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 my-10 ">
      {photos.map((photo, index) => (
        <div key={index} className="relative group">
          <img
            src={photo.url}
            alt={photo.description || "Hotel Photo"}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-lg">
              {photo.description || "Photo description"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGallery;
