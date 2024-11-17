import { useState, useEffect } from 'react'
import GalleryItem from './generic-comps/ui/GalleryItem'
import { fetchCategoryList } from '../lib/api/categoryListApi'
import { Category } from '../lib/interfaces';
import Search from '../assets/svgs/Search.svg'
import FiltersDropdown from './generic-comps/ui/FiltersDropdown';

const GalleryTab = ({ text=' ', onClick, active }: { text: string, onClick: any, active: string}) => {
  return <div className="mx-2">
      <button className={`text-[#444341] tracking-normal hover:underline duration-500 ${active == text ? 'font-semibold' : 'font-normal'} text-xl`} onClick={() => onClick(text)}>{text}</button>
      </div>
}


function Gallery() {
  const [activeTab, setActiveTab] = useState('library')
  function handleSwitchTab(tab: string) {
    setActiveTab(tab)
  }
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    fetchCategoryList()
    .then(data => setCategories(data))
    .catch(error => console.error(error))
  }, [])
  //const galleryItems = categories.map((category: any) => (<li key={category.id}><GalleryItem title={category.title} tags={category.tags} description={category.description} image={category.imageLink} id={category.id} /></li>));
  const [tags, setTags] = useState<string[]>([]);
  const filteredGallery = (tags.length == 0) 
    ? categories 
    : categories.filter((category) => 
      category.tags.some((tag: string) => 
        tags.some((selectedTag: string) => 
          tag.toLowerCase() === selectedTag.toLowerCase()
        )
      )
    );
  const filteredLibrary: any[] = [];
  const filteredItems = categoriesToItems((activeTab == "explore") ? filteredGallery : filteredLibrary);

  function categoriesToItems(categoryList: any[]) {
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
  
  function getContent() {
    if(filteredItems.length > 0) return (
      <ul className='grid grid-cols-2 gap-4'>{filteredItems}</ul>
    )
    switch(activeTab) {
      case 'library': 
        return (
        <div className='items-center h-[70vh] flex flex-row justify-center gap-4'>
          <p className='text-xl'>Looks like nothing's saved yet...</p>
          <button className='text-lg bg-darkgray text-mywhite py-2 px-4 rounded-lg font-medium hover:scale-105 duration-500' onClick={() => setActiveTab('explore')}>Explore</button>
         </div>)
      case 'explore':
        return (
        <div className='items-center h-[70vh] flex flex-row justify-center gap-4'>
          <p className='text-xl'>Nothing's here yet. Come back later!</p>
        </div>
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
      <div>
          <div className="mx-4 lg:px-12 md:px-8 px-0 flex flex-col">
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
                      <div className="flex flex-row items-center">
                          <div className="mx-4"><img className="h-12" src={Search} alt="" /></div>
                          <div className='w-px h-1/2 mx-1 bg-gray-600' />
                          <div className='mx-4'><FiltersDropdown onInput={handleAddTag} onDelete={handleDeleteTag} tags={tags}/></div>
                          
                      </div>
                  </div>
              </div>
                <div className="ITEMS CONTAINER h-screen">
                    {getContent()}
                </div>
              </div>
              
          </div>
  )
}

export default Gallery


//<div className='mx-4 rounded-lg py-2 bg-[#CBD0D2] px-8 flex flex-row justify-around'>
//                              <div><h1>filters</h1></div>
//                              <div className="ml-8">
//                              <p>^</p>
//                              </div>
//                          </div>