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
      <div className="bg-[#444341] rounded-2xl px-4 py-1"><p className="text-white text-sm font-semibold">{text}</p></div>
  )
}
function GalleryItem ({ 
  title='I am the sigma with aura',
  tags = ['Aura', 'Extreme Sigma', '#1 Alpha', 'Wong', 'Thing'],
  description = 'Sigmas live a difficult life facing alphas such as Oscar "Not Sigma" So. We do our best to ensure customer satisfaction when dealing with robots or iron-based individuals.',
  image='No Image',
  id = '0'
  }: GIProps) {
    return (
    <div>
      <Link to={id}>
        <div className="bg-[#CBD0D2] rounded-3xl grid grid-cols-3 py-6 px-8 hover:drop-shadow-2xl duration-500">
            <div className="col-span-2 flex flex-col ">
                <div className="TITLE text-3xl font-bold"><h1>{title}</h1></div>
                <ul className="TAGS py-3 flex flex-wrap justify-start px-0 gap-x-4 gap-y-2 drop-shadow-md">
                    {tags.map((tag, i) => {
                      return <li key={i}><CategoryTag text={tag} /></li>
                    })}
                </ul>
                <div className="BLURB text-sm pr-4 max-h-[60px] ">
                    <p>{description}</p>
                </div>
            </div>
            <div className="col-span-1 px-6 flex items-center">
                <img 
                className='max-h-[200px]'
                src={image} alt={image.toString()} />
            </div>
        </div>
        </Link>
    </div>)
}

export default GalleryItem