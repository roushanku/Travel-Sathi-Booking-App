import { useState } from "react";
import axios from "axios";
// import { image } from "image-downloader";

export default function PhotosUploader() {
    const [photoLink, setPhotoLink] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([""]);
    async function addPhotoByLink(ev) {
        ev.preventDefault();
        const { data: filename } = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/upload-by-link`,
          { link: photoLink }
        );
        // console.log(res);
        setAddedPhotos((prev) => {
          return [...prev, filename];
        });
        setPhotoLink("");
        // const {data : filename} = await axios.post("${process.env.REACT_APP_BACKEND_URL}/upload-by-link" , {link : photoLink});
        // setAddedPhotos(prev => {
        //   return [...prev , filename];
        // });
        // setPhotoLink('');
      }
    
      function uploadPhoto(ev) {
        const files = ev.target.files;
        const data = new FormData();
        for(let i = 0 ; i < files.length ; i++) {
          data.set('photos' , files[i]);
        }
        
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload` , data , {
          headers : {'Content-type':'multipart/form-data'}
        }).then(response => {
          const {data:filenames} = response;
          setAddedPhotos((prev) => {
            return [...prev, ...filenames];
          });
        })
      }

    return (
        <>
            <div className="flex gap-2">
              <input
                value={photoLink}
                onChange={(ev) => setPhotoLink(ev.target.value)}
                type="text"
                placeholder={"Add using link...jpg"}
              />
              <button
                onClick={addPhotoByLink}
                className="bg-gray-200 px-4 rounded-2xl"
              >
                Add&nbsp; Photos
              </button>
            </div>
            <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">

            {/* {addedPhotos.length > 0 &&
              addedPhotos.map((link, index) => (
                <div className="h-32 flex" key={link}>
                  <img key={index} src={'${process.env.REACT_APP_BACKEND_URL}/uploads/' + link} alt="" />
                </div>
              ))} */}

              {addedPhotos.length > 0 && addedPhotos.map(link => (
                <div>
                  <img src = {'${process.env.REACT_APP_BACKEND_URL}/uploads' + link}></img>
                </div>
              ))}
  
                {/* {
                    addedPhotos.map((image,index)=>{
                        return (<img className="rounded-2xl"key={index} src={`https://images.pexels.com/photos/6040182/pexels-photo-6040182.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`}/>)
                    })
                } */}

              <label className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
              <input type="file" multiple className="hidden" onChange={uploadPhoto}/>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                  />
                </svg>
                Upload
              </label>
            </div>
        </>
    )
}