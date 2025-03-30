import { Fragment, useEffect, useState } from 'react'
import {  fetchCategoryDetails, searchCategory } from '../../../lib/api/categoryDetailsApi'
import { useDebouncedCallback } from 'use-debounce';
import { Category } from '../../../lib/interfaces';
import { Menu, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { useAuth } from '../../../AuthContext';


// How do I construct this
// - Menu that can open and close absolutely
// - When u edit query it opens the menu
// - Map list of autocomplete results to show in the menu --> on click, set query to the result 
// - When u press enter the menu closes 

export default function ComboSelectCategory({ categoryId, onChange }: { categoryId: string, onChange: (newId: string) => void }) {
    const { user } = useAuth();
    // const [category, setCategory] = useState<Category | null>(null);
    const [query, setQuery] = useState(''); // the search value
    // const [selectedName, setSelectedName] = useState('');
    // console.log(categoryId)
    // console.log(category)

    // useEffect(() => {
    //   if (category && category.title) {
    //       setQuery(category?.title || '');
    //   }
    // }, [category]);
    const [open, setOpen] = useState(false);
    const [results, setResults] = useState<Category[]>([]); // the autocomplete results
    const resultItems = results.map((cat, i) => {
      return (
        <div className="group hover:bg-darkgray flex cursor-default items-center gap-2 rounded-lg py-2 px-3 pr-4 select-none" onClick={() => handleSelect(cat._id, cat.title)} key={i}>
            <CheckIcon height={16} className={`${(categoryId === cat._id) ? 'visible' : 'invisible'} fill-darkgray stroke-darkgray group-hover:fill-lightgray`} />
            <h1 className=' text-darkgray group-hover:text-lightgray text-sm/6'>{cat.title}</h1>
        </div>
      )
    })
    const handleSelect = (cid: string, name: string) => {
      if(cid !== categoryId) {
        onChange(cid)
        // setSelectedName(name);
        setQuery(name || '')
        setOpen(!open);
      } else {
        onChange('')
        setQuery('')
        setOpen(!open);
      }
    }
    const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      debouncedSearch(e.target.value);
    }
    
    
    const debouncedSearch = useDebouncedCallback((value) => {
        searchCategory(value, user)
        .then(data => setResults(data))
        .catch(error => console.error(error))
    }, 300);
    useEffect(() => {
      if(categoryId !== '-1') {
        fetchCategoryDetails(categoryId)
        .then(data => {
          // setCategory(data)
          setQuery(data.title)
        })
        .catch(error => console.error(error))
      }
    }, [categoryId])
    return (
      <Menu as="div" className="text-left max-w-56">
        <button onClick={() => setOpen(!open)} className='inline-block bg-darkgray px-4 py-2 rounded-lg hover:ring-2  ring-midgray'>
          <div className='flex gap-2'>
            <input className='outline-none bg-transparent text-sm text-white placeholder:opacity-50 placeholder:text-white' placeholder='Select a category...' value={query} onChange={handleQuery} />
            <ChevronDownIcon height={16} className='my-auto ' fill='#ffffff' />
          </div>
        </button>
        <Transition
        show={open}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-[70%]"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-[70%]" 
        >
        <div onClick={e => e.stopPropagation()} className="font-medium p-1 z-[9999] absolute origin-top-right rounded-lg shadow-lg shadow-black/50 bg-lightgray gap-2">
          {results.length < 1 
          ? 
          <div className="group flex cursor-default items-center gap-2 rounded-lg py-2 px-3 pr-4 select-none md:min-w-[150px]">
            <h1 className=' text-darkgray text-sm/6 mx-auto'>Loading...</h1>
          </div>
          : 
          resultItems}
        </div>
        </Transition>
      </Menu>
    )
}

// if (!results.some(cat => cat._id === categoryId) && selectedName) {
    //   resultItems.unshift(
    //     <div className="group hover:bg-darkgray flex cursor-default items-center gap-2 rounded-lg py-2 px-3 pr-4 select-none" onClick={() => handleSelect('', '')} key={-1}>
    //       <CheckIcon height={16} className={`fill-darkgray stroke-darkgray group-hover:fill-lightgray`} />
    //       <h1 className=' text-darkgray group-hover:text-lightgray text-sm/6'>{selectedName}</h1>
    //     </div>
    //   );
    // } 