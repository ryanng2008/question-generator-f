import { Link } from 'react-router-dom'

interface GIProps {
  title: string;
  tags: string[];
  description: string;
  image: string;
  id: string;
}


const CategoryTag = ({ text }: { text: string }) => {
  return(
      <div className="bg-[#444341] rounded-xl px-4 py-1"><p className="text-white text-sm font-medium">{text}</p></div>
  )
}
function GalleryItem ({ 
  title='',
  tags = ['Aura'],
  description = 'Wow',
  image='No Image',
  id = '0'
  }: GIProps) {
    return (
    <div>
      <Link to={id}>
        <div className="bg-[#CBD0D2] border-2 border-gray-300 rounded-3xl grid grid-cols-3 py-5 px-8 hover:shadow-md hover:border-gray-400 duration-300">
            <div className="col-span-3 flex flex-col gap-3 ">
                <div className="TITLE text-3xl font-semibold"><h1>{title}</h1></div>
                {tags.length > 0 && <ul className={`TAGS flex flex-wrap justify-start px-0 gap-x-4 gap-y-2 drop-shadow-md`}>
                    {tags.map((tag, i) => {
                      return <li key={i}><CategoryTag text={tag} /></li>
                    })}
                </ul>}
                <div className="BLURB text-sm">
                    <p>{description.length > 200 ? description.substring(0, 200) : description}</p>
                </div>
            </div>
            {/* below is flex*/}
            <div className="hidden col-span-1 pl-6 items-center">
                <img 
                className=''
                src={image} alt={image.toString()} />
            </div>
        </div>
        </Link>
    </div>)
}

export default GalleryItem