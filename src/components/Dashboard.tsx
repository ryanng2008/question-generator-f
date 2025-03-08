import { Link } from 'react-router-dom'
// import Tree from '../assets/svgs/Tree.svg'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import Art from './generic-comps/ui/Art';

function Dashboard() {
    const hasProfile = false;
    const StatsContainer = () => {
        return (
            <div className='CONTENT CONTAINER flex flex-col mx-2'>
                <div className="HEADING my-4 pt-8 font-bold font-serif md:text-6xl text-5xl text-[#444341]">
                    <h1>Welcome back, user!</h1>
                </div>
                <div className="HEADING text-[#444341] text-2xl py-4 ml-2"> {/* w-1/2 */}
                    <h1>Here are your weekly study stats:</h1>
                </div>w
                <div className=' STATS GRID sm:grid sm:grid-cols-2 flex flex-col pt-4 w-full lg:w-[90%] mx-auto'>
                    <Statistic number="3" caption="Day Streak" /> 
                    <Statistic number="120" caption="Questions" /> 
                    <Statistic number="7" caption="Hours Spent" /> 
                    <Statistic number="4" caption="Topics Studied" /> 
                </div>
            </div>
        )
    }

    const MinimalContainer = () => {
        return(
        <div className='CONTENT CONTAINER flex flex-col md:justify-center'>
            <div className="HEADING my-4 font-semibold md:text-6xl text-5xl text-[#444341]">
                <h1>Study faster & better</h1>
            </div>
            <div className='ml-1 my-2'>
                <Link to="./library">
                <div className='py-2 px-4 rounded-lg text-lg font-medium text-mywhite bg-darkgray inline-block hover:scale-105 duration-500'>
                    <div className='flex flex-row gap-3'>
                        <p className=''>Find resources</p>
                        <ArrowRightIcon className='h-6 my-auto'/>
                    </div>
                </div>
                </Link>
            </div>
        </div>)
    }
    const Statistic = ({ number, caption }: {number: string, caption: string}) => {
        return (
        <div className='ONE GRID'>
        <div className=' bg-[#CBD0D2] outline outline-[#B5BFC3] outline-4 rounded-3xl my-2 mt-2 md:mx-auto mx-2 md:max-w-[75%] max-w-full md:h-48 sm:h-32'>
            <div className='flex flex-col py-8'>
                <div className='mx-auto font-bold'>
                    <p className={`lg:text-7xl text-5xl text-[#444341]`}>{number}</p>
                </div>
                <div className='mx-auto text-center pt-4'>
                    <p className='text-xl'>{caption}</p>
                </div>
            </div>  
        </div>
        </div>)}
    return (
        <div className="grow lg:px-12 md:px-8 px-0 mx-8 flex flex-col justify-center h-full">
            <div className="CONTENT md:grid flex grid-cols-5 gap-8 md:justify-center items-center"> 
                <div className='col-span-3'>
                {hasProfile ? <StatsContainer /> : <MinimalContainer />}
                </div>
                
                <div className='md:flex hidden col-span-2 items-center justify-center '>
                    <Art />
                </div>
            </div>
        </div>
    )
}

// https://www.vecteezy.com/free-png/plant-render

export default Dashboard