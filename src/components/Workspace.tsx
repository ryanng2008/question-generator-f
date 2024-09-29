import 'katex/dist/katex.min.css';
import { useState } from 'react';
import Latex from 'react-latex-next';
import DOMPurify from 'dompurify';
import MathQuill, { addStyles, EditableMathField } from 'react-mathquill'

// inserts the required css to the <head> block.
// you can skip this, if you want to do that by yourself.
addStyles()





export default function Workspace() {
    return (
        <>
            {/* <QuestionInput /> */}
            <PVsInput />
        </>
    )
}

function PVsInput() { 
    // One component stores internal state - on click it saves to a global state variable in a parent. That click will sanitize the TeX (PROBLEM SOLVED)

    // TODO: Make a math expression parser
    const [latex, setLatex] = useState('\\frac{1}{\\sqrt{2}}\\cdot 2')
    const allowedFunctions = ['sin', 'cos', 'tan', 'log', 'sqrt', 'frac'];
    function sanitizeLatex(input: string) {
      // SANITIZE: .replace(/\\(left|right)/g, '')

      const commandRegex = /\\([a-zA-Z]+)/g; // match LaTeX commands, e.g., \int, \sum, \sin
      const sanitized = input.replace(commandRegex, (match, p1) => {
        if (allowedFunctions.includes(p1)) {
          return match; // Keep allowed functions
        }
        return ''; // Remove disallowed functions
      });
      return sanitized;
    };   
    // function handleChange(mathFieldLatex: string) {
    //   const newLatex = sanitizeLatex(mathFieldLatex);
    //   setLatex(newLatex)
    // } 
    return (
      <div>
        <EditableMathField
          latex={latex}
          onChange={(mathField) => setLatex(mathField.latex())}
        />
        <p>{latex}</p>
      </div>
    )
}

function RVsInput() {

}

function QuestionInput() {
    const [input, setInput] = useState('');
    const sanitizedInput = DOMPurify.sanitize(input);
    //const latex = `We give illustrations for the three processes $e^+e^-$, gluon-gluon and some macros: $\\int 1$`
    return (
        <div className="my-12 mx-12 flex flex-col gap-8">
            <input className='p-2 rounded-lg' value={input} onChange={e => setInput(e.target.value)}/>
            <Latex children={sanitizedInput} />
        </div>
    )
}
