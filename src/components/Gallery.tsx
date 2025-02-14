import { useState, useEffect } from 'react'
import GalleryItem from './generic-comps/ui/GalleryItem'
import { fetchCategoryList } from '../lib/api/categoryListApi'
import { Category } from '../lib/interfaces';
import FiltersDropdown from './generic-comps/ui/FiltersDropdown';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useDebouncedCallback } from 'use-debounce';


const GalleryTab = ({ text=' ', onClick, active }: { text: string, onClick: any, active: string}) => {
  return <div className="mx-2">
      <button className={`text-[#444341] tracking-normal hover:underline duration-500 ${active == text ? 'font-semibold' : 'font-normal'} text-xl`} onClick={() => onClick(text)}>{text}</button>
      </div>
}


function Gallery() {
  const [activeTab, setActiveTab] = useState('explore')
  function handleSwitchTab(tab: string) {
    setActiveTab(tab)
  }
  const [categories, setCategories] = useState<Category[]>([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    fetchCategoryList()
    .then(data => setCategories(data))
    .catch(error => console.error(error))
  }, [])
  const [tags, setTags] = useState<string[]>([]);
  // const [loading, setLoading] = useState(false);
  const fetchCategories = useDebouncedCallback((searchQuery: string, tags: string[]) => {
    console.log('fetching')
    // setLoading(true)
    fetchCategoryList(searchQuery, tags)
    .then(data => setCategories(data))
    // .then(() => setLoading(false))
  }, 1000)
  useEffect(() => {
    fetchCategories(searchQuery, tags);
  }, [searchQuery, tags])
  // const filteredGallery = (tags.length == 0) 
  //   ? categories 
  //   : categories.filter((category) => 
  //     category.tags.some((tag: string) => 
  //       tags.some((selectedTag: string) => 
  //         tag.toLowerCase() === selectedTag.toLowerCase()
  //       )
  //     )
  //   );
  // const libraryCategories: Category[] = [];
  const exploreItems = categoriesToItems(categories);

  function categoriesToItems(categoryList: Category[]) {
    return categoryList.map((category: any, i) => (
      <li key={i}>
      <GalleryItem
      title={category.title}
      tags={category.tags}
      description={category.description}
      image={category.imageLink}
      id={category._id} />
      </li>
    ))
  }

  function handleAddTag(tag: string) {
    if(tags.includes(tag)) {
      return 0
    }
    setTags([
      ...tags,
      tag
    ]);
  }

  function handleDeleteTag(tag: string) {
    setTags(tags.filter(t => t != tag))
  }
  
  function Content() {
    switch(activeTab) {
      case 'library': 
        return (
        <div className='items-center h-full flex flex-row justify-center gap-4 my-auto'>
          <p className='text-xl'>Looks like nothing's saved yet...</p>
          <button className='text-lg bg-darkgray text-mywhite py-2 px-4 rounded-lg font-medium hover:scale-105 duration-500' onClick={() => setActiveTab('explore')}>Explore</button>
         </div>
         
        )
      case 'explore':
        return (
          (exploreItems.length < 1) ?
          <ContentSkeleton /> :
          <ul className='grid grid-cols-2 gap-4'>{exploreItems}</ul>
        )
      default:
        return (
          <div className='items-center h-[70vh] flex flex-row justify-center gap-4'>
          <p className='text-xl'>Content not found. Try refreshing!</p>
          </div>
        )
    }

  }

  return (
      <>
          <div className="mx-4 lg:px-12 md:px-8 px-0 flex flex-col grow mb-12">
              <div className="MENUBAR CONTAINER">
                  <div className={`MENUBAR my-4 mx-24 flex flex-row justify-between rounded-lg md:px-12 px-4 py-4`}>
                      <div className="flex flex-row items-center">
                          <div className=" tracking-wider">
                            <GalleryTab text='library' onClick={handleSwitchTab} active={activeTab}/>
                          </div>
                          <div className='w-px h-1/2 mx-1 bg-gray-600' />
                          <div className=" tracking-wider">
                            <GalleryTab text='explore' onClick={handleSwitchTab} active={activeTab} />
                          </div>
                      </div>
                      <div className="flex flex-row">
                          <input 
                          type="text" 
                          className='placeholder-darkgray/30 mt-auto mb-1 outline-none bg-transparent border-b-2 border-b-darkgray pb-1 md:w-[180px] md:hover:w-[250px] duration-300' 
                          placeholder="I'm looking for..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}/>
                          <div onClick={() => setShowSearchBar(!showSearchBar)} className="cursor-pointer mx-4 my-auto hover:scale-105 duration-150">
                            <MagnifyingGlassIcon height={36} className='' />
                          </div>
                          <div className='w-px h-1/2 mx-1 my-auto bg-gray-600' />
                          <div className='mx-4 my-auto'><FiltersDropdown onInput={handleAddTag} onDelete={handleDeleteTag} tags={tags}/></div>
                          
                      </div>
                  </div>
              </div>
                <div className="ITEMS CONTAINER flex flex-col grow">
                    {<Content />}
                </div>
              </div>
              
          </>
  )
}

function ContentSkeleton() {
  return (
    <ul className='grid grid-cols-2 gap-4'>
      <div className="bg-[#CBD0D2] border-2 border-gray-300 rounded-3xl h-[150px] hover:shadow-md hover:border-gray-400 duration-300" /> 
      <div className="bg-[#CBD0D2] border-2 border-gray-300 rounded-3xl h-[150px] hover:shadow-md hover:border-gray-400 duration-300" /> 
      <div className="bg-[#CBD0D2] border-2 border-gray-300 rounded-3xl h-[150px] hover:shadow-md hover:border-gray-400 duration-300" /> 
      <div className="bg-[#CBD0D2] border-2 border-gray-300 rounded-3xl h-[150px] hover:shadow-md hover:border-gray-400 duration-300" /> 
      <div className="bg-[#CBD0D2] border-2 border-gray-300 rounded-3xl h-[150px] hover:shadow-md hover:border-gray-400 duration-300" /> 
      <div className="bg-[#CBD0D2] border-2 border-gray-300 rounded-3xl h-[150px] hover:shadow-md hover:border-gray-400 duration-300" /> 
    </ul>
  )
}

export default Gallery


//<div className='mx-4 rounded-lg py-2 bg-[#CBD0D2] px-8 flex flex-row justify-around'>
//                              <div><h1>filters</h1></div>
//                              <div className="ml-8">
//                              <p>^</p>
//                              </div>
//                          </div>