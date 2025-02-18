import { useState, Fragment } from 'react'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { Transition } from '@headlessui/react'
import Enter from '../../../assets/svgs/Enter.svg'
function FiltersDropdown({ onInput, onDelete, tags }: { onInput: any, onDelete: any, tags: string[]}) {
    const [shown, setShown] = useState(false);
    const [input, setInput] = useState('');

    const CategoryTag = ({ text }: { text: string }) => {
      return(
          <div className="bg-[#444341] rounded-lg py-[0.25rem] flex pl-3 pr-2 justify-between gap-3">
            <p className="text-white text-sm font-normal">{(text.length < 16) ? text : text.slice(0, 15) + "..."}</p>
            <button onClick={() => onDelete(text)} className='text-white'>
              <XMarkIcon className='w-3'/>
            </button>
          </div>
      )
    }

    const tagItems = tags.map((tag, index) => {
      return(<li key={index}>
            <CategoryTag key={index} text={tag}/>
          </li>) 

    })
    function handleAddInput() {
      if(input.trim() == '') return
      setInput('')
      onInput(input.trim())
    }
    // console.log(tags.length)

    return (
        <div className="text-left">
          <div>
            <button 
              onClick={() => setShown(!shown)}
              className="flex gap-4 outline-none justify-left rounded-md bg-darkgray hover:drop-shadow-lg hXXXover:shadow-black/50 duration-300 text-white px-4 py-2 text-lg font-normal">
              tags
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
            <div className="gap-4 flex flex-col font-medium py-4 pr-4 pl-5 z-[9999] absolute origin-top-right rounded-md bg-lightgray shadow-lg shadow-black/50">
              <div className='flex flex-row gap-4'>
                <input 
                type="text" 
                value={input || ''} 
                onChange={e => setInput(e.target.value)} className='text-left w-[128px] font-normal outline-none rounded-lg px-2'
                onKeyDown={e => { if(e.key === 'Enter') handleAddInput() }}  />
                <button onClick={handleAddInput}>
                  <img className='w-8' src={Enter} alt="" />
                </button>
              </div>
              <ul className='flex flex-wrap gap-2'>
                {tagItems}
              </ul>
            </div>
          </Transition>
        </div>
    )
}

export default FiltersDropdown