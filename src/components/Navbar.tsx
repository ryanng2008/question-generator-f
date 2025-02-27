//import { AiOutlineMenu } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import Menu from '../assets/svgs/Menu.svg'
import { useAuth } from '../AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Navbar() {
  const { user } = useAuth();
  // function handleMenuClick() {
    
  // }

  const NavbarButton = ({ text }: {text: string}) => {
    return <div className={`rounded-full bg-lightgray hover:underline text-[#444341] py-2 md:w-40 w-[90px] mx-auto font-semibold tracking-wide text-center`}>
      {text}
      </div>
  }
  return (
    <>
    <div className='bg-[#444341] py-4 w-full'>
      <div className=" lg:px-12 md:px-8 px-0 mx-4 grid grid-cols-3 justify-between gap-4">
        <Link to='/'>
          <div className="flex items-center">
            <img className="h-16" src="https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/3945274.png" alt=""/>
            {/* <img className="h-16"src="https://b.fssta.com/uploads/application/soccer/headshots/40670.vresize.350.350.medium.91.png" alt="" /> */}
          </div>
        </Link>

        {/* <div className=" items-center md:flex hidden"> */}
          <ul className='flex justify-between space-x-4 items-center'>
            <li><Link to='/library'><NavbarButton text='library'/></Link></li>
            <li><Link to='/create'><NavbarButton text='create'/></Link></li>
          </ul>
          <div className='flex items-center justify-end'>
          <Link to='/account' className='my-auto'>
            {
              (user) 
              ?
              <img className='max-w-[48px] hover:scale-105 duration-300 fill-mywhite' src={Menu} alt="Menu" /> 
              :
              (user === '') 
              ?
              // <div className='bg-lightgray rounded-full py-2 px-6 hover:scale-105 duration-300 text-darkgray font-semibold'>Log in</div>
              <AccountCircleIcon sx={{color: "#CBD0D2", fontSize: 50 }} className='hover:scale-105 duration-300'/>
              :
              <div />
            }
          </Link>
          </div>
          {/* <Link to='/account'>
          <button className='' onClick={() => {}}>
            
            <img className='max-w/-[48px] fill-mywhite' src={Menu} alt="Menu" />
          </button>
          </Link> */}
        </div>
      </div>
    {/* </div> */}
    </>
  )
}


export default Navbar