import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchQuestionDetails } from "../../lib/api/questionDetailsApi";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { Info } from "./ui/Info";
import Latex from "react-latex-next";
import DOMPurify from "dompurify";
import { PVClient, RVClient } from "../../lib/interfaces";
import { PVParent, RVParent } from "./CreateQuestion";
import { useAuth } from "../../AuthContext";
import { handleEditQuestion } from "../../lib/api/createApi";

export default function EditQuestion() {
    const categoryId = useParams().categoryId!;
    const questionId = useParams().questionId!;
    // const [originalQuestion, setOriginalQuestion] = useState({});
    const navigate = useNavigate();
    const { user } = useAuth(); 
    const [loaded, setLoaded] = useState(false);
    const [questionInput, setQuestionInput] = useState('');
    const [answerInput, setAnswerInput] = useState('');
    const sanitizedQuestion = DOMPurify.sanitize(questionInput);
    const sanitizedAnswer = DOMPurify.sanitize(answerInput)
    const [pvs, setPVs] = useState<PVClient[]>([]);
    const [rvs, setRVs] = useState<RVClient[]>([{name: '', lb: '', hb: ''}]);
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        fetchQuestionDetails(questionId)
        .then(data => {
            if(!data) {
                return
            }
            if(data.creator !== 'public' && data.creator !== user) {
                setMessage("Error: you don't have permission to edit this question")
                return
            }
            console.log(data)
            setQuestionInput(data.question);
            setAnswerInput(data.answer);
            setPVs(data.pvs);
            setRVs(data.rvs);
            setLoaded(true);
        })
        .catch(error => console.error(error))
    }, [])
    const [message, setMessage] = useState('');

    async function onCreate() {
            if(!user) {
                setMessage('Log in first!')
                return
            }
            const seenVarNames = new Set();
            for (let i = 0; i < pvs.length; i++) {
                if(seenVarNames.has(pvs[i].varName)) {
                    setMessage('You have some duplicate variables')
                    return
                    // setPVs(p => p.map((pv, index) => { return i === index ? { varName: '', latex: pv.latex } : pv}))
                }
                seenVarNames.add(pvs[i].varName)
            }
            const seenNames = new Set();
            for (let i = 0; i < rvs.length; i++) {
                if(seenNames.has(rvs[i].name)) {
                    setMessage('You have some duplicate variables')
                    return
                    // setRVs(r => r.map((rv, index) => { return i === index ? { name: '', lb: rv.lb, hb: rv.hb } : rv}))
                }
                seenVarNames.add(rvs[i].name);
            }
    
            let fixedPVs: PVClient[] = (pvs[pvs.length - 1].latex === `` && pvs[pvs.length - 1].varName === '') ? pvs.slice(0, -1) : pvs
            let fixedRVs = (rvs[rvs.length - 1].name === '' && rvs[rvs.length - 1].lb === '' && rvs[rvs.length - 1].hb === '') ? rvs.slice(0, -1) : rvs;
            if(fixedRVs.length < 1) {
                setMessage('Make Random Variables to use in Processed Variables!')
                return
            }
            if(fixedPVs.length < 1) {
                setMessage('Make Processed Variables! If you don\'t need processing, put the lone variable in the expression. e.g. A = a')
                return
            }
            
            const somePVsEmpty = fixedPVs.some(pv => pv.varName === '' || pv.latex === '');
            const someRVsEmpty = fixedRVs.some(rv => rv.name === '' || rv.lb === '' || rv.hb === '');
            if(somePVsEmpty || someRVsEmpty || questionInput.length === 0) {
                setMessage('Some of your fields are empty. Fill them in!') 
                return
            } 
            
            // Check if some PVs/RVs are the same name
    
            // sanitize all the pvs
            // for(const pv of fixedPVs) {
            //     pv.latex = texToSympyString(pv.latex);
            // }
            const createQuestion = await handleEditQuestion(questionId, sanitizedQuestion, fixedRVs, fixedPVs, sanitizedAnswer);
            if(createQuestion.success) {
                setMessage('Success!')
                navigate(`/library/${categoryId}/questions`)
                // redirect maybe with settimeout
            } else {
                setMessage(`Edit failed: ${createQuestion.message}`)
            }
        }
    
    // console.log(originalQuestion)
    if(!loaded) {
       return (
       <div className="mx-auto my-auto">
        <h1 className="text-xl">{message ? message : 'Loading...'}</h1>
       </div> )
    }
    return (
        <div className="flex flex-col gap-8 mx-4 lg:px-12 md:px-8 px-0 py-8">
            <div className="HEAD my-4">
                <div className="flex flex-col gap-2">
                    <Link 
                        to={`/library/${categoryId}/questions`}
                        className="text-darkgray hover:text-darkgray/80 hover:underline duration-300 text-lg font-medium"
                    >
                        ← Go back to questions
                    </Link>
                    <h1 className="text-6xl font-semibold">Edit Question</h1>
                </div>
            </div>
            <div className="BIG BODY bg-lightgray rounded-lg drop-shadow-xl flex flex-col gap-8 py-6 px-8">
                <div className="CATEGORY SELECT flex md:flex-row flex-col gap-4 md:justify-end md:items-center">
                    
                    {/* <div className="bg-darkgray py-1 px-2 text-white font-medium rounded-lg"><p>{selectedId}</p></div> */}
                    {/* <ComboBox /> */}
                    {/* <input type="text" placeholder="Dropdown"/> */}
                    <div className="relative">
                    <button onClick={() => setShowInfo(!showInfo)} className="drop-shadow-xl text-white w-70 bg-red-800 font-medium rounded-lg py-2 px-4 flex flex-row gap-2 items-center">
                        <p>READ BEFORE PROCEEDING</p>
                        <InformationCircleIcon className="h-4"/>
                    </button>
                    {showInfo && <Info />}
                    </div>
                </div>
                <div className="h-px w-full bg-black"/>
                <div className="QUESTION INPUT flex flex-col gap-2">
                    <h1 className="font-medium text-2xl">Question Input Text</h1>
                    <textarea className='p-2 rounded-lg outline-mywhite min-h-[100px]' placeholder="What is the value of $\frac{[[A]]}{[[B]]}$ ?" value={questionInput} onChange={e => setQuestionInput(e.target.value)}/>
                </div>
                <div className="QUESTION PREVIEW gap-3 flex flex-col">
                    <h1 className=" text-2xl font-medium">Preview Question</h1>
                    <div className="bg-darkgray text-white text-lg py-4 md:px-8 px-4 whitespace-pre-line rounded-lg min-h-[50px]">
                        <Latex children={sanitizedQuestion} />
                    </div>
                </div>
                {/* <div className="ANSWER grid grid-cols-2 gap-8">
                    <div>answer</div>
                    <div>input</div>
                </div> */}
                <div className="VARIABLES flex flex-col md:grid grid-cols-3 gap-8">
                    {/* Maybe you need to make it a flex with changeable size,  */}
                    <RVParent variables={rvs} setVariables={setRVs}/>
                    <div className="PVS flex flex-col col-span-2">
                        <h2 className="text-xl font-medium py-2">Processed Variables</h2>
                        <PVParent variables={pvs} setVariables={setPVs}/>
                    </div>
                </div>
                <div className="h-px w-full bg-black"/>
                <div className="ANSWER flex flex-col md:grid grid-cols-2 gap-8">
                    <div className="QUESTION INPUT flex flex-col gap-2">
                        <h1 className="font-medium text-2xl">Answer Input Text</h1>
                        <textarea className='p-2 my-2 rounded-lg outline-mywhite whitespace-normal' placeholder="[[A]] is greater than [[B]]" value={answerInput} onChange={e => setAnswerInput(e.target.value)}/>
                    </div>
                    <div className="QUESTION PREVIEW gap-3 flex flex-col">
                        <h1 className=" text-2xl font-medium">Preview Answer</h1>
                        <div className="bg-darkgray text-white text-lg py-4 px-4 rounded-lg min-h-[50px]">
                            <Latex children={sanitizedAnswer} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="SUBMIT flex flex-row gap-16">
                <button onClick={onCreate} className="ml-2 bg-darkgray text-white px-6 hover:scale-105 duration-300 py-2 font-medium text-lg rounded-lg drop-shadow-xl">Submit</button>
                <p className="my-auto">{message}</p>
            </div>
        </div>
    )
}