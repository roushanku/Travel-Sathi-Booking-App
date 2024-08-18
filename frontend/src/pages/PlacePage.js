import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import BookingWidget from "../BookingWidget";
export default function  PlacePage() {
    const {id} = useParams();
    const [place , setPlace] = useState(null);
    const [showAllPhotos ,setShowAllPhotos] = useState(false);
    useEffect(() => {
        if(!id) {
            return;
        }

        axios.get(`http://localhost:4000/places/${id}`).then(response => {
            setPlace(response.data);
        });
    } , [id]);
    if(!place) return "";

    if(showAllPhotos) {
        return ( 
            <div className="aboslute bg-white min-w-full min-h-screen">
                <h2 className="text-3xl">More photos of {place.title}    it is static photos , will fix soon...</h2>
                <br/>
                <button onClick={() => setShowAllPhotos(false)}className="fixed flex gap-1 py-2 px-4 rounded-2xl shadow-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>

                    Close photos

                    </button>
                {/* {place?.photos?.length > 0 && place.photos.map(photo => (
                    <div>
                        <img src={"htttp://localhost:4000/uploads/" + photo}></img>
                    </div>
                ))} */}

                <div className="grid grid-cols-2 gap-2">
                <img src="https://www.kayak.co.in/rimg/himg/45/8d/f7/leonardo-2781555-153182551-570377.jpg?width=968&height=607&crop=true" alt=""></img>
                <img src="https://www.kayak.co.in/rimg/himg/d8/84/04/expediav2-199526-60993c-398160.jpg?width=968&height=607&crop=true" alt=""></img>
                <img src="https://www.kayak.co.in/rimg/himg/38/2c/bb/expediav2-199526-bbc7c6-431613.jpg?width=968&height=607&crop=true" alt=""></img>
                <img src="https://www.kayak.co.in/rimg/himg/f0/f7/22/expediav2-199526-76e746-370632.jpg?width=968&height=607&crop=true" alt=""></img>
                </div>
            </div>
        ); 
    }
    return ( 
        <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
            <h1 className="tect-3xl">{place.title}</h1>
            <a className="flex gap-1 my-3  font-semibold underline" target="blank" href={'https://maps.google.com/?q=' + place.address}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {place.address}
                </a>
            <div className="grid gap-2 grid-cols-[2fr_1fr]">
                <div className="grid">
                    <img className="aspect-square object-cover "src="https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/495309476.jpg?k=78c036d9191c26b58bdc75880aca796994fc692c1402906986058d183ea22a7b&o=" alt=""></img>
                </div>
                <div className="grid">
                    <img className="aspect-square object-cover"src="https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/495324733.jpg?k=dea16d0a7e755d604654bd6df6824907ea2b57ec89a9f27205c57eb7bca63a34&o= " alt=""></img>
                    <img className="aspect-square object-cover"src="https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/495309457.jpg?k=c60159df4cded5c28ba77e9bac28a56f5953cc36462b54eb612aea224514c732&o=" alt=""></img>
                </div>
            </div>
            <button onClick={() => setShowAllPhotos(true)} className="flex gap-1 bottom-4 right-2 py-2 px-4 bg-white rounded-2xl shadow shadow-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                    Show more photos
            </button>
            

            <div className="mt-8 mb-8 grid gap-8 grid-cols-2 md:grid-cols-[2fr_1fr">
                <div>
                    <div className="my-4">
                        <h2 className="font-semibold text-2xl">description</h2>
                        {place.description}
                    </div>
                    <b>Check-in :</b> {place.checkIn}<br/>
                    <b>Check-out :</b> {place.checkIn}<br/>
                    <b>Max number of guests </b>: {place.maxGuests}<br/>
                </div>
                <div>
                    <BookingWidget place={place}/>
                </div>
            </div>
            <div>
            <div className="bg-white -mx-8 px-8 py-8 border-t">
                <h2 className="font-semibold text-2xl">Extra Info</h2>
                </div>
                <div className="mb-4 mt-2 text-sm text-gray-600 leading-8">
                    {place.extraInfo}
                </div>
            </div>
        </div>
    );
}  