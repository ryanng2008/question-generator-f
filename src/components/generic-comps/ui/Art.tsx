import { useEffect, useState } from 'react';

export default function Art() {
    const [image, setImage] = useState('');
    useEffect(() => {
        setImage(`https://sjfmocwyjyxaksooryeg.supabase.co/storage/v1/object/public/art/${images[Math.floor(Math.random() * images.length)]}`)
    }, [])
    return (
        <div className="ART mx-auto h-[550px]">
            <img 
            className="max-h-[550px] w-auto rounded-[30px] shadow-2xl border-2 border-darkgray"
            src={image}
            alt=''
            />
        </div>
    )
}

const images = ['1', '2', '3', '4', '5', '6', '7', '8']

// https://i.pinimg.com/736x/3d/20/82/3d20826ac2a3272ebdcf7a03113f2814.jpg

//https://[project_id].supabase.co/storage/v1/object/public/[bucket]/[asset-name]

