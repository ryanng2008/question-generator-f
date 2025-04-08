import { useEffect, useState } from 'react';
import { fetchRandomArt } from '../../../lib/api/artApi';

export default function Art() {
    const [image, setImage] = useState('');
    useEffect(() => {
        // const imageName = images[Math.floor(Math.random() * images.length)]
        fetchRandomArt()
        .then(data => setImage(data))
        // setImage(`https://sjfmocwyjyxaksooryeg.supabase.co/storage/v1/object/public/art/${imageName}`)
    }, [])
    // 550px
    return (
        <div className="ART mx-auto min-h-[550px]">
            {image 
            ? <img 
            className="max-h-[550px] w-auto mx-auto rounded-[30px] shadow-2xl border-2 border-darkgray"
            src={image}
            alt='Something motivational'
            /> 
            : <div className='h-[550px] rounded-[30px] border-darkgray w-[300px]'></div>
        }
        </div>
    )
}

// a
// https://i.pinimg.com/736x/3d/20/82/3d20826ac2a3272ebdcf7a03113f2814.jpg

//https://[project_id].supabase.co/storage/v1/object/public/[bucket]/[asset-name]

