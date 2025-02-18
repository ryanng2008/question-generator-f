import { fetchQuestionList } from '../../lib/api/questionListApi';
import { Link, useParams } from 'react-router-dom'
import 'katex/dist/katex.min.css';
import QuestionItem from './ui/QuestionItem'
import { useState, useEffect } from 'react'
import { fetchCategoryDetails } from '../../lib/api/categoryDetailsApi';
import { Category, Question } from '../../lib/interfaces';
import Refresh from '../../assets/svgs/Refresh.svg'
import Save from '../../assets/svgs/Save.svg'
import Dropdown from './ui/Dropdown';
import ComboSlider from './ui/ComboSlider';
// import { PlusCircleIcon } from '@heroicons/react/20/solid';
import Create from '../../assets/svgs/Create.svg'
import { useDebouncedCallback } from 'use-debounce';
import { useAuth } from '../../AuthContext';


function QuestionsPage() {
  const { user } = useAuth();
  const categoryId = useParams().categoryId || '';
  const [category, setCategory] = useState<Category>({
    _id: '',
    title: '',
    description: '',
    imageLink: '',
    tags: [],
    author: '',
    questions: [],
  });
  
  const [questionObjs, setQuestionObjs] = useState<Question[]>([]); // useState getQuestionList(categoryId) // <Question[]>
  //const [refresh, setRefresh] = useState(false);
  const [sort, setSort] = useState<string>('Number');
  const [count, setCount] = useState(-1);
  // questionsCount = count;
  const questionsCount = count === -1 ? questionObjs.length : count;
  // const countUI = questionsCount === -1 ? questionObjs.length : questionsCount
  // const [fetching, setFetching] = useState<boolean>(false);
  // async function fetfchData() {
  //   if(!fetching) {
  //     setFetching(true)
  //     fetchQuestionList(categoryId, count)
  //     .then(data => setQuestionObjs(data))
  //     .then(() => setTimeout(() => {
  //       setFetching(false);
  //     }, 1000))
  //     .catch(error => console.error(error))
  //   }
  // }
  const fetchData = useDebouncedCallback(() => {
    fetchQuestionList(categoryId, count)
    .then(data => setQuestionObjs(data))
    .catch(_error => {})
  }, 1000)
  useEffect(() => {
    fetchData();
  }, [count])

  useEffect(() => {
    fetchCategoryDetails(categoryId)
    .then(data => setCategory(data))
    .catch(error => console.error(error))
  }, [])
  useEffect(() => {
    document.title = category?.title + ' - Orchard';
  }, [category.title])

  const questionTags = questionObjs && questionObjs.map((questionObj: Question, index: number) => {
    return <li key={index}><QuestionItem questionObject={questionObj} index={index+1} key={index} categoryId={categoryId} /></li>
  })
  const [dropdownShown, setDropdownShown] = useState(false);
  return (
    <div className="mx-4 lg:px-12 md:px-8 px-0 flex flex-col gap-4" onClick={() => setDropdownShown(false)}>
        <div className="TITLE pt-12 pb-4 px-16">
            <h1 className="font-semibold text-5xl text-[#444341]">{category.title}</h1>
        </div>
        <div className="ActionBar flex px-8 mx-8 py-4 items-start gap-4">
            <div className="px-0 flex flex-row items-center gap-8">
                <div>
                    <button onClick={fetchData}>
                      <img className='max-h-8 hover:scale-110 duration-300' src={Refresh} alt="" />
                    </button>
                </div>
                <div>
                    <button><img className='h-8 hover:scale-110 duration-300' src={Save} alt="" /></button>
                </div>
                <div className=''>
                  <Dropdown 
                  title='sort by'
                  selected={sort}
                  options={['Number', 'Difficulty']}
                  onSelect={(option: string) => setSort(option)}
                  />
                </div>
            </div>
            <div className="flex flex-row gap-4">
                <div className="mx-1 w-px bg-gray-600 max-h-[48px]" />
                <div className='my-auto'>
                    <ComboSlider shown={dropdownShown} setShown={setDropdownShown} defaultValue={questionsCount} onSlide={(e: any) => setCount((e.target.value < 100 && e.target.value) || count)} count={questionsCount} />
                </div>
                <div className=' tracking-normal flex'>
                    <h1 className=' text-[#444341] text-xl font-medium tracking-normal my-auto'>questions shown</h1>
                </div>
            </div>
            {(category.author === 'public' || user === category.author) && <Link className='ml-auto mr-4 flex items-center' to={`/create/question/${categoryId}`}>
              {/* <PlusCircleIcon height={48}/> */}
              <img src={Create} className='max-h-12'/>
            </Link>}
        </div>
        <ul className='Questions py-4 flex flex-col gap-4'>
          {questionTags}
        </ul>
    </div>
  )
}

export default QuestionsPage
