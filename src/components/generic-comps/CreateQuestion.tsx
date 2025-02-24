import DOMPurify from "dompurify";
import { useEffect, useState, Fragment } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import Latex from "react-latex-next";
import { EditableMathField } from "react-mathquill";
import { CheckCircleIcon, EllipsisVerticalIcon, InformationCircleIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { PVClient, RVClient } from "../../lib/interfaces";
import { sanitizeLatex } from "../../lib/shortcuts";
import { handlePostQuestion } from "../../lib/api/createApi";
import ComboSelectCategory from "./ui/ComboSelectCategory";
import { useAuth } from "../../AuthContext";
import { Info } from "./ui/Info";

export default function CreateQuestion() {
    const { user } = useAuth(); // BOUTTA GET RID O FHTISSSSS (why, for google auth??)
    const navigate = useNavigate();
    // Data
    const categoryId = useParams().categoryId || '-1';
    const [selectedId, setSelectedId] = useState(categoryId);
    
    // Question State + Sanitized
    const [questionInput, setQuestionInput] = useState('');
    const [answerInput, setAnswerInput] = useState('');
    const sanitizedQuestion = DOMPurify.sanitize(questionInput);
    const sanitizedAnswer = DOMPurify.sanitize(answerInput)
    // Variables state
    const [pvs, setPVs] = useState<PVClient[]>([{
        varName: '', 
        latex: ``,
        coefficient: false,
        dp: 0
    }]);

    // useEffect(() => {
    //     console.log(pvs)
    // }, [pvs])
    const [rvs, setRVs] = useState<RVClient[]>([{name: '', lb: '', hb: ''}]);
    const [message, setMessage] = useState('');
    async function onCreate() {
        if(!user) {
            setMessage('Log in first!')
            return
        }
        if(selectedId === '-1') {
            setMessage('Select an ID')
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
        // if(fixedRVs.length < 1) {
        //     setMessage('Make Random Variables to use in Processed Variables!')
        //     return
        // }
        // if(fixedPVs.length < 1) {
        //     setMessage('Make Processed Variables! If you don\'t need processing, put the lone variable in the expression. e.g. A = a')
        //     return
        // }
        
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
        const createQuestion = await handlePostQuestion(sanitizedQuestion, fixedRVs, fixedPVs, sanitizedAnswer, selectedId);
        if(createQuestion.success) {
            setMessage('Success!')
            navigate(`/library/${selectedId}/questions`)
            // redirect maybe with settimeout
        } else {
            setMessage(`Failed to upload this question: ${createQuestion.message}`)
        }
    }
    // useEffect(() => {
    //     setMessage('')
    // }, [pvs, rvs])

    const [showInfo, setShowInfo] = useState(false);
    return (
        <div className="flex flex-col gap-8 mx-4 lg:px-12 md:px-8 px-0 py-8">
            <div className="HEAD my-4">
                <h1 className="text-6xl font-semibold">Create Question</h1>
            </div>
            <div className="BIG BODY bg-lightgray rounded-lg drop-shadow-xl flex flex-col gap-8 py-6 px-8">
                <div className="CATEGORY SELECT flex md:flex-row flex-col gap-4 md:justify-between md:items-center">
                    <div className="flex flex-row gap-8 justify-left">
                    <h1 className="font-medium text-2xl">Category</h1>
                    <ComboSelectCategory categoryId={selectedId} onChange={setSelectedId}/>
                    </div>
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
                        <div className="bg-darkgray text-white text-lg py-4 px-4 rounded-lg min-h-[50px] whitespace-pre-line">
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



export function PVParent({
    variables,
    setVariables
    }: {
    variables: PVClient[],
    setVariables: (variables: PVClient[]) => void
    }) { 
    // function modifyVariableOld(index: number, latexString: string, variable: string, coefficient: boolean, dp: number) {
    //     const nextVariables = variables.map((v, i) => {
    //         return (i === index) ? {varName: variable, latex: latexString, coefficient: coefficient, dp: dp } : v;
    //     })
    //     setVariables(nextVariables);
    // }
    function modifyVariableLatex(index: number, latex: string) {
        const nextVariables = variables.map((v, i) => {
            return (i === index) ? {...v, latex: latex} : v;
        })
        setVariables(nextVariables)
    }
    function modifyVariable(index: number, keyName: string, value: string | number | boolean) {
        const nextVariables = variables.map((v, i) => {
            return (i === index) ? {...v, [keyName]: value} : v;
        })
        setVariables(nextVariables)
    }
    function deleteVariable(index: number) {
        if(variables.length > 1) {
            const newVariables = variables.filter((_variable, i) => ((i !== index)));
            setVariables(newVariables);
        }
    }
    // useEffect(() => {
    //     if(variables[variables.length - 1].varName) {
    //         setVariables([...variables, {varName: '', latex: ``}])
    //     }
    // }, [variables])
    function handleAdd() {
        setVariables([...variables, {
            varName: '', 
            latex: ``,
            coefficient: false,
            dp: 0
        }])
    }
    const pvInputs = variables.map((variable, index) => {
        return (
            <Fragment key={index}>
                <ProcessedVariableInput 
                key={index}
                index={index} 
                pv={variable}
                // initialVariable={`${variable.varName}`} 
                initialLatex={`${variable.latex}`}
                onUpdateLatex={modifyVariableLatex}
                onUpdateNormal={modifyVariable}
                onDelete={deleteVariable}/>
                {(index !== variables.length - 1) && <div key={`divider-${index}`} className="h-px bg-black"/>}
            </Fragment>)
    })
    return (
    <div className="flex flex-col gap-3">
        {pvInputs}
        <button 
            className="my-4 w-full mx-auto bg-darkgray/90 rounded-xl py-1 text-white flex items-center justify-center"
            onClick={handleAdd}>
            <PlusIcon height={20} />
        </button>
    </div>)
}


function ProcessedVariableInput({ 
    pv,
    // initialVariable, 
    initialLatex, 
    index,
    onUpdateLatex,
    onUpdateNormal,
    onDelete }: {
    pv: PVClient,
    // initialVariable: string, 
    initialLatex: string, 
    index: number, 
    onUpdateLatex: (index: number, latex: string) => void ,
    onUpdateNormal: (index: number, keyName: string, value: string | number | boolean) => void ,
    onDelete: (index: number) => void }) {
    // const [variable, setVariable] = useState(''); // What does the variable name look like and what constraints can we put on it
    const [latex, setLatex] = useState(initialLatex);
    const [saved, setSaved] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    // const [properties, setProperties] = useState({
    //     coefficient: false,
    //     dp: 0
    // });
    function handleUpdateLatex() {
        const sanitizedLatex = sanitizeLatex(latex);
        onUpdateLatex(index, sanitizedLatex);
        setSaved(true);
    }
    function handleUpdateNormal(keyName: string, value: string | boolean | number) {
        onUpdateNormal(index, keyName, value);
        // ADD THIS TO ALL OF THE INPUTS
    }
    // function handleSubmit() {
    //     const sanitizedLatex = sanitizeLatex(latex);
    //     //setLatex(sanitizedLatex);
    //     onUpdate(index, sanitizedLatex, variable, properties.coefficient, properties.dp);
    //     setSaved(true);
    // }

    useEffect(() => {
        setSaved(false)
    }, [latex])   
    useEffect(() => {
        // setVariable(initialVariable);
        setLatex(initialLatex);
      }, [initialLatex]); 
 
    return (
        <div className="flex flex-row gap-4">
            <div className="w-1/5 flex flex-col justify-end">
                <h2 className="text-xs text-[#738086] pl-[1px] pb-1 tracking-wider font-medium">Name</h2>
                <input 
                type="text" 
                className="VARIABLE NAME INPUT col-span-1 max-w-full break-all p-1 rounded-md text-sm bg-white outline-mywhite" 
                placeholder=""
                value={pv.varName} 
                maxLength={15} 
                onChange={e => handleUpdateNormal('varName', e.target.value.replace(/[^A-Za-z_]/g, '').toUpperCase())} />
            </div>
            <div className="flex items-end">
                <p className="mb-1 text-[#738086] font-semibold">=</p>
            </div>
            <div className="w-full">
                <h2 className="text-xs text-[#738086] pl-[3px] pb-1 tracking-wider font-medium">Expression</h2>
                <EditableMathField
                style={{
                    backgroundColor: 'white',
                    width: '95%',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.25rem 0.25rem',
                    marginLeft: '0.25rem',
                    marginTop: 'auto',
                    marginBottom: 'auto',
                    outlineColor: '#ECEAE1'
                }}
                latex={latex}
                onChange={(mathField) => setLatex(mathField.latex())}
                />
            </div>
            <div className="relative flex items-end">
            <div className="flex justify-end items-end gap-2">
                {!saved && <button className="hover:scale-[105%] hover:text-darkgray/60 duration-150" onClick={handleUpdateLatex}>
                <CheckCircleIcon height={32}/></button>}
                <button className="hover:scale-[105%] hover:text-darkgray/60 duration-150" onClick={() => onDelete(index)}>
                <TrashIcon height={32} /></button>
                <button className="hover:scale-[105%] hover:text-darkgray/60 duration-150" onClick={() => setMenuOpen(!menuOpen)}>
                <EllipsisVerticalIcon height={32} /></button>
            </div>
            {menuOpen && 
            <div className="z-[9999] flex flex-col gap-2 px-4 py-3 absolute w-[250px] right-0 -bottom-3 transform translate-y-full bg-mywhite border-2 border-darkgray/70 rounded-lg shadow-xl" onMouseLeave={() => setMenuOpen(!menuOpen)}>
            <div className="COEFFICIENT flex flex-row justify-between gap-4 mx-1 items-center">
                <h3 className="text-sm font-medium">Coefficient</h3>
                <div className="inline-flex items-center">
                  <label className="flex items-center cursor-pointer relative">
                    <input type="checkbox" 
                    onChange={() => handleUpdateNormal('coefficient', !pv.coefficient)} 
                    checked={pv.coefficient} 
                    className="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 bg-white checked:border-slate-800" id="check" />
                    <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </span>
                  </label>
                </div> 
            </div>

            <div className="h-px bg-gray-500"/>

            <div className="DP flex justify-between gap-4 overflow-hidden items-center mx-1">
                <h3 className="text-sm font-medium">d.p.</h3>
                <input 
                type="number" 
                className="min-w-0 max-w-[60px] py-1 px-2 text-sm rounded-md flex-grow box-border m-1 shadow-md " 
                value={isNaN(pv.dp) ? '' : pv.dp}
                onChange={e => handleUpdateNormal('dp', parseInt(e.target.value))} 
                />
            </div>

            <div className="h-px bg-gray-500"/>

            <div className="SCIENTIFIC NOTATION flex flex-row justify-between gap-4 mx-1 items-center">
                <h3 className="text-sm font-medium">Sci Notation</h3>
                <div className="inline-flex items-center">
                  <label className="flex items-center cursor-pointer relative">
                    <input type="checkbox" 
                    onChange={() => handleUpdateNormal('coefficient', !pv.coefficient)} 
                    checked={pv.coefficient} 
                    className="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 bg-white checked:border-slate-800" id="check" />
                    <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </span>
                  </label>
                </div> 
            </div>
            </div>
            }
            </div>

        </div>
    )
}


export function RVParent({
    variables,
    setVariables}: {
    variables: RVClient[],
    setVariables: (variables: RVClient[]) => void
    }) {
    
    function modifyVariable(index: number, type: 'name' | 'lb' | 'hb', value: string) {
        const nextVariables = variables.map((variable, i) => {
            return (i === index) ? {...variable, [type]: value} : variable
        })
        setVariables(nextVariables)
    }
    function deleteVariable(index: number) {
        if(variables.length > 1) {
            const nextVariables = variables.filter((_variable, i) => (i !== index))
            setVariables(nextVariables)
        }
    }
    const rvInputs = variables.map((variable, i) => {
        return (
            <Fragment key={i}>
                <RandomVariableInput 
                key={i}
                index={i} 
                variable={variable} 
                onVariableChange={modifyVariable} 
                onDelete={deleteVariable}/>
                {(i !== variables.length - 1) && <div key={`divider-${i}`} className="h-px bg-black"/>}
            </Fragment>)
    })
    function handleAdd() {
        setVariables([...variables, {name: '', lb: '', hb: ''}])
    }
    return (
        <div className="RVS flex flex-col col-span-1">
            <div className="flex gap-4">
                <h2 className="text-xl font-medium py-2">Random Variables</h2>
                {/* <button 
                    className="rounded-xl text-darkgray flex items-center justify-center"
                    onClick={handleAdd}>
                    <PlusIcon height={24} />
                </button> */}
            </div>
            <div className="flex flex-col gap-3">
                {rvInputs}
                <button 
                    className="my-4 flex bg-darkgray/90 rounded-xl py-1 text-white items-center justify-center"
                    onClick={handleAdd}>
                    <PlusIcon height={20} />
                </button>
            </div>
        </div>    
        )
}

function RandomVariableInput({
    index,
    variable,
    onVariableChange,
    onDelete }: {
    index: number,
    variable: RVClient,
    onVariableChange: (index: number, type: 'name' | 'lb' | 'hb', value: string) => void,
    onDelete: (index: number) => void
    }) {
    function onInput(e: React.ChangeEvent<HTMLInputElement>) {
        if(e.target.name === 'name') {
            onVariableChange(index, 'name', e.target.value.replace(/[^A-Za-z]/g, '').toLowerCase())
            return
        }
        onVariableChange(index, e.target.name as 'lb' | 'hb', e.target.value)
    }

    return (
        <div className="grid grid-cols-5 lg:gap-4 md:gap-2 gap-4 pb-[2.5px]">
            <div className="justify-between col-span-2">
                <h2 className="text-xs text-[#738086] pl-[1px] pb-1 tracking-wider font-medium">Name</h2>
                <input 
                name='name'
                type="text" 
                className="max-w-full break-all p-1 rounded-md text-sm bg-white outline-mywhite" 
                placeholder=""
                value={variable.name} 
                maxLength={15} 
                onChange={onInput} // e.target.value.replace(/[^A-Za-z]/g, '')
                 />
            </div>
            <div className="justify-between col-span-1">
                <h2 className="text-xs text-[#738086] pl-[1px] pb-1 tracking-wider font-medium">Min</h2>
                <input 
                name="lb"
                type="number" 
                className="max-w-full break-all p-1 rounded-md text-sm bg-white outline-mywhite" 
                placeholder=""
                value={variable.lb} 
                maxLength={15} 
                onChange={onInput} // e.target.value.replace(/[^A-Za-z]/g, '')
                 />
            </div>
            <div className="justify-between col-span-1">
                <h2 className="text-xs text-[#738086] pl-[1px] pb-1 tracking-wider font-medium">Max</h2>
                <input 
                name="hb"
                type="number" 
                className="max-w-full break-all p-1 rounded-md text-sm bg-white outline-mywhite" 
                placeholder=""
                value={variable.hb} 
                maxLength={15} 
                onChange={onInput} // e.target.value.replace(/[^A-Za-z]/g, '')
                 />
            </div>
            <div className="flex justify-end items-end col-span-1">
                <button onClick={() => onDelete(index)} className="hover:scale-105 duration-150 hover:text-darkgray/60"><TrashIcon height={32} /></button>
            </div>
        </div>
    )
}