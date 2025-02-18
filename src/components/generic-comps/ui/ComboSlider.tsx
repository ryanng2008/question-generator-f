import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'


// I gotta redo this 

// make a separate slider

function ComboSlider({ count, defaultValue, onSlide, shown, setShown }: { count: number, defaultValue: number, onSlide: any, shown: boolean, setShown: (shown: boolean) => void }) {
  // const [shown, setShown] = useState(false);
  //const Slider = () => {<div className='rounded-lg py-2 px-2'><div className='h-px bg-darkgray'></div></div>}
  
  return (
    <Menu as='div' className="text-left max-w-56">
      <div>
        <button 
          onClick={e => {
            e.stopPropagation();
            setShown(!shown)
          }}
          className="flex gap-4 justify-left rounded-md bg-darkgray hover:drop-shadow-lg hXXXover:shadow-black/50 duration-300 text-white px-4 py-2 text-lg font-medium">
          {count}
          <ChevronDownIcon
            className="-mr-1 ml-2 my-auto h-5 w-5 text-white "
            aria-hidden="true"
          />
        </button>
      </div>
      <Transition
        show={shown}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-[70%]"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-[70%]" 
      >
        <div onClick={e => e.stopPropagation()} className="font-medium py-2 px-4 z-[9999] absolute origin-top-right divide-y divide-darkgray rounded-md bg-lightgray shadow-lg shadow-black/50">
          <input type="number" value={defaultValue} onChange={onSlide} className='text-center max-w-[64px]' />
        </div>
      </Transition>
    </Menu>
  )
}

// export function NewComboSlider({ count, defaultValue, onSlide }: { count: number, defaultValue: number, onSlide: any }) {
//   // const [shown, setShown] = useState(false);
//   //const Slider = () => {<div className='rounded-lg py-2 px-2'><div className='h-px bg-darkgray'></div></div>}
  
//   return (
//     <Menu as="div" className="text-left max-w-56">
//       <div>
//         <MenuButton 
//           // onClick={() => setShown(!shown)}
//           className="flex gap-4 justify-left rounded-md bg-darkgray hover:drop-shadow-lg duration-300 text-white px-4 py-2 text-lg font-medium">
//           {count}
//           <ChevronDownIcon
//             className="-mr-1 ml-2 my-auto h-5 w-5 text-white "
//             aria-hidden="true"
//           />
//         </MenuButton>
//       </div>
//       <Transition
//         // show={shown}
//         as={Fragment}
//         enter="transition ease-out duration-200"
//         enterFrom="transform opacity-0 scale-[70%]"
//         enterTo="transform opacity-100 scale-100"
//         leave="transition ease-in duration-200"
//         leaveFrom="transform opacity-100 scale-100"
//         leaveTo="transform opacity-0 scale-[70%]" 
//       >
//         <MenuItem>
//           {({ open }) => (
//             <div onClick={open} className=" font-medium py-2 px-4 z-[9999] absolute origin-top-right divide-y divide-darkgray rounded-md bg-lightgray shadow-lg shadow-black/50">
//             <input type="number" value={defaultValue} onChange={onSlide} className='text-center max-w-[64px]' />
//             </div>
//   )}
//         </MenuItem>
//       </Transition>
//     </Menu>
//   )
// }

//const SliderTest = () => {
//  return (
//    <div className='rounded-lg py-2 px-2'>
//      <div className='h-px w-[64px] sm:w-[128px] bg-darkgray'>
//      </div>
//    </div>
//  )
//}

export default ComboSlider