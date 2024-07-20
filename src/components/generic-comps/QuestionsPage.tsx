import { fetchQuestionList } from '../../lib/api/questionListApi';
import { useParams } from 'react-router-dom'
import 'katex/dist/katex.min.css';
import QuestionItem from './ui/QuestionItem'
import { useState, useEffect } from 'react'
import { fetchCategoryDetails } from '../../lib/api/categoryDetailsApi';
import { Category, Question } from '../../lib/interfaces';
import Refresh from '../../assets/svgs/Refresh.svg'
import Save from '../../assets/svgs/Save.svg'
import Dropdown from './ui/Dropdown';
import ComboSlider from './ui/ComboSlider';


function QuestionsPage() {
  const categoryId = useParams().categoryId!;
  const [category, setCategory] = useState<Category>({
    id: '',
    title: '',
    description: '',
    imageLink: '',
    tags: [],
    author: '',
    questions: [],
  });
  
  const [questionObjs, setQuestionObjs] = useState<Question[]>([]); // useState getQuestionList(categoryId) // <Question[]>
  const [refresh, setRefresh] = useState(false);
  const [sort, setSort] = useState<string>('Number');
  const [count, setCount] = useState(-1);
  const questionsCount = count == -1 ? questionObjs.length : count;

  useEffect(() => {
    fetchQuestionList(categoryId, count)
    .then(data => {
      //console.log("Question List:")
      //console.log(data)
      setQuestionObjs(data)
    })
    .catch(error => console.error(error))
  }, [refresh, questionsCount])

  useEffect(() => {
    fetchCategoryDetails(categoryId)
    .then(data => {
      //console.log("Category Details:")
      //console.log(data)
      setCategory(data)
    })
    .catch(error => console.error(error))
  }, [])

  const questionTags = questionObjs && questionObjs.map((questionObj: Question, index: number) => {
    return <li key={index}><QuestionItem questionObject={questionObj} index={index+1} key={index} /></li>
  })

  return (
    <div className="mx-4 lg:px-12 md:px-8 px-0 flex flex-col gap-4 font-inter">
        <div className="TITLE pt-12 pb-4 px-16">
            <h1 className="font-semibold text-5xl text-[#444341]">{category.title}</h1>
        </div>
        <div className="ActionBar flex px-8 mx-8 py-4 gap-4">
            <div className="px-4 flex flex-row items-center gap-8">
                <div>
                    <button onClick={() => setRefresh(!refresh)}>
                      <img className='max-h-8 hover:scale-110 duration-300' src={Refresh} alt="" />
                    </button>
                </div>
                <div>
                    <button><img className='h-8 hover:scale-110 duration-300' src={Save} alt="" /></button>
                </div>
                <div className='font-inter'>
                  <Dropdown 
                  title='sort by'
                  selected={sort}
                  options={['Number', 'Difficulty']}
                  onSelect={(option: string) => setSort(option)}
                  />
                </div>
            </div>
            <div className="col-span-2 flex flex-row gap-4">
                <div className="mx-1 w-px bg-gray-600" />
                <div>
                    <ComboSlider defaultValue={questionsCount} onSlide={(e: any) => setCount((e.target.value < 100 && e.target.value) || count)} count={questionsCount} />
                </div>
                <div className=' tracking-normal  my-auto flex items-center'>
                    <h1 className=' text-[#444341] text-xl font-medium tracking-normal'>questions shown</h1>
                </div>
            </div>
        </div>
        <ul className='Questions py-4 flex flex-col gap-4'>
          {questionTags}
        </ul>
    </div>
  )
}

export default QuestionsPage
