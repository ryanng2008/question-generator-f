//import { AiOutlineMenu } from 'react-icons/ai'
import { Link } from 'react-router-dom'

import Menu from '../assets/svgs/Menu.svg'

function Navbar() {

  function handleMenuClick() {
    
  }

  const NavbarButton = ({ text }: {text: string}) => {
    return <div className={`rounded-full bg-lightgray hover:underline text-[#444341] py-2 w-40 mx-auto font-semibold tracking-wide text-center`}>
      {text}
      </div>
  }
  return (
    <>
    <div className='bg-[#444341] py-4 font-inter w-full'>
      <div className="px-8 lg:px-12 md:px-8 sm:px-0 mx-4 flex items-center justify-between gap-4">
        <Link to='/'>
          <div className="flex items-center">
            <img className="h-16"src="https://b.fssta.com/uploads/application/soccer/headshots/40670.vresize.350.350.medium.91.png" alt="" />
          </div>
        </Link>
        <div className="flex items-center space-x-24">
          <ul className='flex justify-apart space-x-16'>
            <li><Link to='/'><NavbarButton text='dashboard'/></Link></li>
            <li><Link to='/library'><NavbarButton text='library'/></Link></li>
          </ul>
          <button className='' onClick={handleMenuClick}>
            <img className='max-w-[48px] fill-mywhite' src={Menu} alt="Menu" />
          </button>
        </div>
      </div>
    </div>
    </>
  )
}


export default Navbar