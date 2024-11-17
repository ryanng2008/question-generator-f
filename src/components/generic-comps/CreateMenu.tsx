import DOMPurify from "dompurify";
import { useEffect, useState, Fragment } from "react";
import Latex from "react-latex-next";
import { EditableMathField } from "react-mathquill";
import { CheckCircleIcon, TrashIcon } from "@heroicons/react/20/solid";
import { PVClient, RVClient } from "../../lib/interfaces";
import { sanitizeLatex } from "../../lib/shortcuts";
import { handlePostQuestion } from "../../lib/api/createQuestionApi";
import { Link } from "react-router-dom";

export default function CreateMenu() {
    return (
    <div className="flex flex-col gap-4 mx-4 lg:px-12 md:px-8 px-0 py-8">
        <div className="HEAD my-4">
            <h1 className="text-6xl font-semibold">Create</h1>
        </div>
        <div className="grid grid-cols-2 min-h-[60vh]">
            <div className="MENU BUTTONS flex flex-col gap-4 pt-8">
                <Link to='/' className="bg-lightgray py-4 px-4 text-xl hover:scale-[101%] duration-300 text-darkgray font-medium rounded-2xl">
                <p>Create category</p>
                </Link>
                <Link to='/' className="bg-lightgray py-4 px-4 text-xl hover:scale-[101%] duration-300 text-darkgray font-medium rounded-2xl">
                <p>Create question</p>
                </Link>
            </div>
            <div className="ART m-8 bg-gray-400">
                ART
            </div>
        </div>
    </div>)
}

export function CreateCategory() {
    // Make a form with the fields for a category
    // Title, Description, Tags
    return <></>
}

export function CreateQuestion() {
    // Question State
    const [questionInput, setQuestionInput] = useState('');
    const sanitizedQuestion = DOMPurify.sanitize(questionInput);
    // PV State
    const [pvs, setPVs] = useState<PVClient[]>([{varName: '', latex: ``}]);
    const [rvs, setRVs] = useState<RVClient[]>([{name: '', lb: '', hb: ''}]);
    const [answerInput, _setAnswerInput] = useState('');
    const sanitizedAnswer = DOMPurify.sanitize(answerInput)
    const [message, setMessage] = useState('');

    async function onCreate() {
        let fixedPVs = (pvs[pvs.length - 1].latex === `` && pvs[pvs.length - 1].varName === '') ? pvs.slice(0, -1) : pvs
        let fixedRVs = (rvs[rvs.length - 1].name === '' && rvs[rvs.length - 1].lb === '' && rvs[rvs.length - 1].hb === '') ? rvs.slice(0, -1) : rvs;
        const somePVsEmpty = fixedPVs.some(pv => pv.varName === '' || pv.latex === '');
        const someRVsEmpty = fixedRVs.some(rv => rv.name === '' || rv.lb === '' || rv.hb === '');
        if(somePVsEmpty || someRVsEmpty) {
            // Add a message thing
            setMessage('Some of your fields are empty. Fill them in!') 
        } else {
            const createQuestion = await handlePostQuestion(sanitizedQuestion, fixedRVs, fixedPVs, sanitizedAnswer);
            if(createQuestion.success) {
                setMessage('Success!')
            } else {
                setMessage('Failed to upload this question. Check your fields!')
            }
        }
        // TO DO 
        // Remove the last row of pvs and rvs if it is totally empty
        // Check if any fields are empty
    }
    return (
        <div className="flex flex-col gap-8 mx-4 lg:px-12 md:px-8 px-0 py-8">
            <div className="HEAD my-4">
                <h1 className="text-6xl font-semibold">Create Question</h1>
            </div>
            <div className="BIG BODY bg-lightgray rounded-lg drop-shadow-xl flex flex-col gap-8 py-6 px-8">
                <div className="QUESTION INPUT flex flex-col gap-2">
                    <h1 className="font-medium text-2xl">Question Input Text</h1>
                    <input className='p-2 rounded-lg' placeholder="Type the question here..." value={questionInput} onChange={e => setQuestionInput(e.target.value)}/>
                </div>
                <div className="QUESTION PREVIEW gap-3 flex flex-col">
                    <h1 className=" text-2xl font-medium">Preview Question</h1>
                    <div className="bg-darkgray text-white text-lg py-4 px-8 rounded-lg min-h-[50px]">
                        <Latex children={sanitizedQuestion} />
                    </div>
                </div>
                <div className="VARIABLES flex flex-col md:grid grid-cols-3 gap-8">
                    {/* Maybe you need to make it a flex with changeable size,  */}
                    <div className="RVS flex flex-col col-span-1">
                        <h2 className="text-xl font-medium py-2">Random Variables</h2>
                        <RVParent variables={rvs} setVariables={setRVs}/>
                        {/* array of RVs but they have a divider border, except for the last one*/ }
                    </div>
                    <div className="PVS flex flex-col col-span-2">
                        <h2 className="text-xl font-medium py-2">Processed Variables</h2>
                        <PVParent variables={pvs} setVariables={setPVs}/>
                    </div>
                </div>
            </div>
            <div className="SUBMIT flex flex-row gap-16">
                <button onClick={onCreate} className="ml-2 bg-darkgray text-white px-6 hover:scale-105 duration-300 py-2 font-medium text-lg rounded-lg drop-shadow-xl">Submit</button>
                <p className="my-auto">{message}</p>
            </div>
            {/* <QuestionInput />
            <div className="grid grid-cols-2 gap-12">
                <div className="bg-lightgray">Random variables grid</div>
                <div className="bg-lightgray py-4 px-4 rounded-lg">
                    <PVParent />
                </div>
            </div> */}
        </div>
    )
}

function PVParent({
    variables,
    setVariables
    }: {
    variables: PVClient[],
    setVariables: (variables: PVClient[]) => void
    }) { 
    function modifyVariable(index: number, latexString: string, variable: string) {
        const nextVariables = variables.map((v, i) => {
            return (i === index) ? {varName: variable, latex: latexString} : v;
        })
        setVariables(nextVariables);
    }
    function deleteVariable(index: number) {
        //console.log(index)
        const newVariables = variables.filter((_variable, i) => ((i !== index)));
        setVariables(newVariables);
    }
    useEffect(() => {
        if(variables[variables.length - 1].varName) {
            setVariables([...variables, {varName: '', latex: ``}])
        }
    }, [variables])
    const pvInputs = variables.map((variable, index) => {
        return (
            <Fragment key={index}>
                <ProcessedVariableInput 
                key={index}
                index={index} 
                initialVariable={`${variable.varName}`} 
                initialLatex={`${variable.latex}`}
                onUpdate={modifyVariable}
                onDelete={deleteVariable}/>
                {(index !== variables.length - 1) && <div key={`divider-${index}`} className="h-px bg-black"/>}
            </Fragment>)
    })
    return (<div className="flex flex-col gap-3">{pvInputs}</div>)
}


function ProcessedVariableInput({ 
    initialVariable, 
    initialLatex, 
    index,
    onUpdate,
    onDelete }: { 
    initialVariable: string, 
    initialLatex: string, 
    index: number, 
    onUpdate: (index: number, variable: string, latex: string) => void ,
    onDelete: (index: number) => void }) {
    const [variable, setVariable] = useState(initialVariable); // What does the variable name look like and what constraints can we put on it
    const [latex, setLatex] = useState(initialLatex);
    const [saved, setSaved] = useState(false);
    console.log(latex)
    
    function handleSubmit() {
        const sanitizedLatex = sanitizeLatex(latex);
        //setLatex(sanitizedLatex);
        onUpdate(index, sanitizedLatex, variable);
        setSaved(true);
    }

    useEffect(() => {
        setSaved(false)
    }, [variable, latex])   
    useEffect(() => {
        setVariable(initialVariable);
        setLatex(initialLatex);
      }, [initialVariable, initialLatex]);      
    return (
        <div className="flex flex-row gap-4">
            <div className="w-1/5 flex flex-col justify-end">
                <h2 className="text-xs text-[#738086] pl-[1px] pb-1 tracking-wider font-medium">Name</h2>
                <input 
                type="text" 
                className="VARIABLE NAME INPUT col-span-1 max-w-full break-all p-1 rounded-md text-sm bg-white" 
                placeholder=""
                value={variable} 
                maxLength={15} 
                onChange={e => setVariable(e.target.value.replace(/[^A-Za-z]/g, '')
                )} />
            </div>
            <div className="flex items-end">
                <p className="mb-1 text-[#738086] font-semibold">=</p>
            </div>
            <div className="w-full overflow-hidden">
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
                }}
                latex={latex}
                onChange={(mathField) => setLatex(mathField.latex())}
                />
            </div>
            <div className="flex justify-end items-end">
                {!saved && <button onClick={handleSubmit}><CheckCircleIcon height={32}/></button>}
                <button onClick={() => onDelete(index)}><TrashIcon height={32} /></button>
            </div>
        </div>
    )
}


function RVParent({
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
        const nextVariables = variables.filter((_variable, i) => (i !== index))
        setVariables(nextVariables)
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
    useEffect(() => {
        if(variables[variables.length - 1].name) {
            setVariables([...variables, {name: '', lb: '', hb: ''}])
        }
    }, [variables])
    return (<div className="flex flex-col gap-3">{rvInputs}</div>)
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
        onVariableChange(index, e.target.name as 'name' | 'lb' | 'hb', e.target.value)
    }
    return (
        <div className="grid grid-cols-5 lg:gap-4 md:gap-2 gap-4 pb-[2.5px]">
            <div className="justify-between col-span-2">
                <h2 className="text-xs text-[#738086] pl-[1px] pb-1 tracking-wider font-medium">Name</h2>
                <input 
                name='name'
                type="text" 
                className="max-w-full break-all p-1 rounded-md text-sm bg-white" 
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
                className="max-w-full break-all p-1 rounded-md text-sm bg-white" 
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
                className="max-w-full break-all p-1 rounded-md text-sm bg-white" 
                placeholder=""
                value={variable.hb} 
                maxLength={15} 
                onChange={onInput} // e.target.value.replace(/[^A-Za-z]/g, '')
                 />
            </div>
            <div className="flex justify-end items-end col-span-1">
                <button onClick={() => onDelete(index)}><TrashIcon height={32} /></button>
            </div>
        </div>
    )
}


// TRASH


{/* <div className="flex flex-row gap-4 items-center mx-8">
    <div className="w-1/5 max-w-[100px]">
        <h1>Test</h1>
    </div>
    <div className="w-[10%] bg-green-200 py-4" />
    <div className="">
    </div>
</div> */}
