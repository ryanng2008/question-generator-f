import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import Latex from "react-latex-next";
import { EditableMathField } from "react-mathquill";
import { CheckCircleIcon, TrashIcon } from "@heroicons/react/20/solid";

export default function CreateMenu() {
    // Add the question input 
    // Create a master component for processed variable input
    // Create the atomic processed variable component 
    // Make the add PV rows function, add state to master and slave, add tex sanitise 
    // 
    return (
        <div className="flex flex-col gap-8 mx-4 lg:px-12 md:px-8 px-0 py-8">
            <div className="HEAD my-4">
                <h1 className="text-6xl font-semibold">Create</h1>
            </div>
            <QuestionInput />
            <div className="grid grid-cols-2 gap-12">
                <div className="bg-lightgray">Random variables grid</div>
                <div className="bg-lightgray py-4 px-4 rounded-lg">
                    <PVParent />
                </div>
            </div>
        </div>
    )
}

function QuestionInput() {
    const [input, setInput] = useState('');
    const sanitizedInput = DOMPurify.sanitize(input);
    return (
        <div className="bg-gray-300 py-8 px-12 rounded-lg flex flex-col gap-6 ">
            <h1 className="text-3xl font-medium">Question text (use LaTeX)</h1>
            <input className='p-2 rounded-lg' placeholder="Type the question here..." value={input} onChange={e => setInput(e.target.value)}/>
            <div className="h-px bg-darkgray"/>
            <div className="PREVIEW flex flex-col gap-4">
                <h1 className="text-xl font-medium">Preview</h1>
                {/*Include a box or something, signify that it is a preview, etc */}
                <Latex children={sanitizedInput} />
            </div>
        </div>
    )
}

function RVParent() {

}

function PVParent() {
    interface Variable {
        varName: string,
        latex: string
    }
    const [variables, setVariables] = useState<Variable[]>([{varName: '', latex: ``}]);
    console.log(variables)
    console.log('\\')
    const pvInputs = variables.map((variable, index) => {
        return <ProcessedVariableInput 
            key={index}
            index={index} 
            initialVariable={`${variable.varName}`} 
            initialLatex={`${variable.latex}`}
            onUpdate={modifyVariable}
            onDelete={deleteVariable}/>
    })
    function modifyVariable(index: number, latexString: string, variable: string) {
        const nextVariables = variables.map((v, i) => {
            return (i === index) ? {varName: variable, latex: latexString} : v;
        })
        setVariables(nextVariables);
    }
    function deleteVariable(index: number) {
        console.log(index)
        const newVariables = variables.filter((variable, i) => ((i !== index)));
        setVariables(newVariables);
    }
    useEffect(() => {
        if(variables[variables.length - 1].varName) {
            setVariables([...variables, {varName: '', latex: ``}])
        }
    }, [variables])
    // Make it so that the last one is always empty, if not then append a new one
    return (
        <div>
            <div className="flex flex-col gap-4 px-8">
                <div className="">
                    <h1 className="text-xl font-medium">Processed Variables</h1>
                </div>
                {/* <div className="flex flex-row gap-4 items-center mx-8">
                    <div className="w-1/5 max-w-[100px]">
                        <h1>Test</h1>
                    </div>
                    <div className="w-[10%] bg-green-200 py-4" />
                    <div className="">

                    </div>
                </div> */}
                {pvInputs}
                {/* Put individual inputs here, onInput handle state in this parent, add an Add button that sets State,  */}
            </div>
        </div>
    )
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
    console.log(latex)
    const [saved, setSaved] = useState(false);
    const allowedFunctions = ['sin', 'cos', 'tan', 'log', 'sqrt', 'frac'];
    function sanitizeLatex(input: string) { // SANITIZE: .replace(/\\(left|right)/g, '')  
        const commandRegex = /\\([a-zA-Z]+)/g; // match LaTeX commands, e.g., \int, \sum, \sin
        const sanitized = input.replace(commandRegex, (match, p1) => {
          if (allowedFunctions.includes(p1)) {
            return match; // Keep allowed functions
          }
          return ''; // Remove disallowed functions
        });
        return sanitized;
    };
    function handleSubmit() {
        const sanitizedLatex = sanitizeLatex(latex);
        setLatex(sanitizeLatex);
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
        <>
        <div className="flex flex-row gap-4 items-center">
            <div className="w-1/5">
                <input 
                type="text" 
                className="VARIABLE NAME INPUT col-span-1 max-w-[100px] break-all p-1 rounded-sm outline outline-darkgray bg-lightgray" 
                placeholder="Variable"
                value={variable} 
                maxLength={10} 
                onChange={e => setVariable(e.target.value.replace(/[^A-Za-z]/g, '')
                )} />
            </div>
            <div className="justify-center flex"><Latex children={'$=$'}/></div>
            <div className="w-full overflow-hidden">
                <EditableMathField
                latex={latex}
                onChange={(mathField) => setLatex(mathField.latex())}
                />
            </div>
            <div className="justify-end flex">
                {!saved && <button onClick={handleSubmit}><CheckCircleIcon height={32}/></button>}
                <button onClick={() => onDelete(index)}><TrashIcon height={32} /></button>
            </div>
        </div>
        </>
    )
}