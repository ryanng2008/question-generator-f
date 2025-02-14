import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
// import { categories } from '../../api/old/categories';
import { fetchCategoryDetails } from '../../lib/api/categoryDetailsApi';
import { Category } from '../../lib/interfaces';

//{ categoryName, categoryId }: CategoryMenuProps
function CategoryMenu() {
  const categoryId = useParams().categoryId!;
  //const category = categories.find((category) => category.id == parseInt(categoryId))

  const [category, setCategory] = useState<Category>();
  //console.log(category)
  useEffect(() => {
    fetchCategoryDetails(categoryId)
    .then(data => setCategory(data))
    .catch(error => console.error(error))
  }, [categoryId])

  return (
    <div className='w-full px-4'>
      <div className='max-w-[1120px] mx-auto py-8'>
        <h1 className='mx-4 font-semibold text-5xl py-4'>{category ? category.title : 'Untitled Category'}</h1>
        <div className='flex flex-col gap-[1px] my-4 mx-4'>
          <MenuButton text='Questions' linkedPage='questions' />
          <MenuButton text='Spaced Repetition' linkedPage='questions' />
          {/* <MenuButton text='Spaced Repetition' linkedPage='questions' />
          <MenuButton text='Create' linkedPage='main'/> */}
      </div>
      </div>
    </div>
  )
}

interface CMBProps {
  text: string;
  linkedPage: string;
}
const MenuButton = ({ text = 'hi', linkedPage = 'main' }: CMBProps) => {
  return (
    <Link to={linkedPage}>
    <div className='bg-lightgray text-darkgray my-2 text-2xl font-medium py-4 rounded-2xl hover:scale-[101%] duration-300 cursor-pointer
    flex px-4' > 
      <p className=''>{text}</p>
    </div>
    </Link>
    );
}


// LANDFILL --–––––––

// const menus = ['main', 'questions', 'test']
// const [currentMenu, setCurrentMenu] = useState('main');
//function goTo(menu: string) {
//  setCurrentMenu(menu);
//}

//const MainPage =  () => {
//  return(
//    <div className='grid grid-cols-2 gap-8 my-8 mx-4'>
//    <Link to='questions'><MenuButton text='Questions' linkedPage='questions' /></Link>
//    <MenuButton text='Test' linkedPage='test' />
//    <MenuButton text='Questions 2' linkedPage='questions' />
//    <MenuButton text='Option 4' linkedPage='main'/>
//    </div>);
//}

export default CategoryMenu
