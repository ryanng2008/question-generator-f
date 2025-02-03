import { InlineMath } from 'react-katex'

export function random(min: number, max: number, places: number = 0) { // MIN INCLUSIVE, MAX EXCLUSIVE
    if (typeof places !== 'number' || places < 0 || min > max) {
        console.error('Invalid input.');
        return null;
      }
    const dp = Math.trunc(places)
    return min + (Math.round((Math.random()*(max-min)) * (10**dp)) / 10**dp)
}

export function round(value: number, places: number = 0) {
    const dp = Math.trunc(places)
    return Math.round(value * (10**dp)) / (10**dp)
}

export function toTeX(rawText: string) { // returns the stuff inside question block
  // old regex: /(?<!\\)\$(.*?)(?<!\\)\$/g
  if(!rawText) return ''
  const regex = /((?<!\\)\$.*?(?<!\\)\$)/g;
  const matches = rawText.match(regex);
  if(!matches) return rawText
  const parts = rawText.split(regex)
  const texified = (<div className='flex flex-wrap items-center'>{parts.map((part, index) => {
    if (matches.includes(`${part}`)) { // ISSUE: case like 
      return <div className='pl-2 max-h-8 flex items-center' key={index}><InlineMath key={index}>{part.substring(1, part.length - 1)}</InlineMath></div>; // the string w/o starting and ending $
    } else {
      return <p className='pl-2' key={index}>{part}</p>;
    }
  })}</div>)
  return texified
}

export function texToSympyString(latex: string) {
    return latex
      // REMOVE LEFT AND RIGHT
      .replace(/\\frac{([^}]+)}{([^}]+)}/g, '(($1) / ($2))')
      .replace(/\\left/g, '')
      .replace(/\\right/g, '')
      // SYMBOLS
      .replace(/\\pi/g, 'pi') // PI
      .replace(/\b(?<!\\)e\b/g, 'E') // E - using word boundaries
      // TRIG
      .replace(/\\sin/g, 'sin')
      .replace(/\\cos/g, 'cos')
      .replace(/\\tan/g, 'tan')
      .replace(/\\asin/g, 'asin')
      .replace(/\\acos/g, 'acos')
      .replace(/\\atan/g, 'atan')
      // OTHER ELEMENTARY
      .replace(/\\log/g, 'log')
      .replace(/\\ln/g, 'log')
      .replace(/\\sqrt/g, 'sqrt')
      // HYPERBOLIC
      .replace(/\\sinh/g, 'sinh')
      .replace(/\\cosh/g, 'cosh')
      .replace(/\\tanh/g, 'tanh')
      .replace(/\\asinh/g, 'asinh')
      .replace(/\\acosh/g, 'acosh')
      .replace(/\\atanh/g, 'atanh')
      // SPECIAL - math formatting 
      .replace(/\^/g, '**') // EXP
      .replace(/\|([^|]+)\|/g, 'Abs($1)') // ABS
      .replace(/\\cdot/g, ' *')
      // SPECIAL - string formatting
      .replace(/\\ /g, ' ') 
      .replace(/\\frac{([^}]+)}{([^}]+)}/g, '(($1) / ($2))') // FRAC
}

export const allowedFunctions = [
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 
  'log', 'ln', 'sqrt', 'frac', 'pi', 
  'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
  'cdot'];

export function sanitizeLatex(input: string) { // MOVE THIS INTO A DIFFERENT MODULE 
  // SANITIZE: .replace(/\\(left|right)/g, '')  
  const commandRegex = /\\([a-zA-Z]+)/g; // match LaTeX commands, e.g., \int, \sum, \sin
  const sanitized = input
    .replace(commandRegex, (match, p1) => {
    if (allowedFunctions.includes(p1)) {
      return match; // Keep allowed functions
    }
    return ''; // Remove disallowed functions
  });
  return sanitized;
}

export function finalSanitize(input: string) {
  const sanitized = input

  return sanitized
}
