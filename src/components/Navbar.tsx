//import { AiOutlineMenu } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import Menu from '../assets/svgs/Menu.svg'
import { useAuth } from '../AuthContext';
import Logo from '../assets/Logo.png'
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Navbar() {
  const { user } = useAuth();
  // function handleMenuClick() {
    
  // }

  const NavbarButton = ({ text }: {text: string}) => {
    return <div className={`rounded-full bg-lightgray hover:underline text-[#444341] py-2 md:px-12 px-4 mx-auto font-semibold tracking-wide md:text-md text-sm text-center`}>
      {text}
      </div>
  }
  return (
    <>
    <div className='bg-[#444341] md:py-2 py-4 w-full'>
      <div className=" lg:px-12 md:px-8 px-0 mx-4 md:grid grid-cols-3 flex justify-between md:gap-4 gap-2">
          <div className="flex items-center">
          <Link to='/' className='flex flex-row gap-4 items-center'>

            <img className="md:h-16 h-10" src={Logo} alt=""/>
            <h1 className='md:block hidden font-poppins font-medium text-3xl text-mywhite'>Orchard</h1>
            {/* <img className="h-16"src="https://b.fssta.com/uploads/application/soccer/headshots/40670.vresize.350.350.medium.91.png" alt="" /> */}
          </Link>
          </div>

        {/* <div className=" items-center md:flex hidden"> */}
          <ul className='flex justify-between space-x-6 items-center'>
            <li><Link to='/library'><NavbarButton text='library'/></Link></li>
            <li><Link to='/create'><NavbarButton text='create'/></Link></li>
          </ul>
          <div className='flex items-center justify-end'>
          <Link to='/account' className='my-auto'>
            {
              (user) 
              ?
              <img className='w-12 md:transform-none transform scale-75 md:scale-100 md:font-normal md:hover:scale-105 hover:scale-[85%] duration-300 fill-mywhite' src={Menu} alt="Menu" /> 
              :
              (user === '') 
              ?
              <div className='text-darkgray bg-mywhite rounded-xl py-2 px-6 hover:scale-105 md:text-md text-sm duration-300 font-semibold hover:underline'>Log in</div>
              // <AccountCircleIcon sx={{color: "#CBD0D2", fontSize: 50 }} className=' hover:scale-105 duration-300'/>
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