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

  console.log(`RAW TEXT: ${rawText}`)
  if(!rawText) return ''
  const regex = /((?<!\\)\$.*?(?<!\\)\$)/g;
  const matches = rawText.match(regex);
  if(!matches) return rawText
  const parts = rawText.split(regex)
  const texified = (<div className='flex flex-wrap'>{parts.map((part, index) => {
    if (matches.includes(`${part}`)) { // ISSUE: case like 
      return <div className='pl-2 max-h-8' key={index}><InlineMath key={index}>{part.substring(1, part.length - 1)}</InlineMath></div>; // the string w/o starting and ending $
    } else {
      return <p className='pl-2' key={index}>{part}</p>;
    }
  })}</div>)
  return texified
}

export function texToSympyString(latex: string) {
    return latex
      .replace(/\\left/g, '')
      .replace(/\\right/g, '')
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
      .replace(/\\frac{([^}]+)}{([^}]+)}/g, '(($1) / ($2))') // FRAC
      .replace(/\^/g, '**') // EXP
      .replace(/\|([^|]+)\|/g, 'abs($1)') // ABS
      // SYMBOLS
      .replace(/\\pi/g, 'pi') // PI
      .replace(/\b(?<!\\)e\b/g, 'e') // E - using word boundaries
      // ADD: HYPERBOLIC (sinh, cosh, tanh, asinh, acosh, atanh)

      // SPECIAL: Abs, Min, Max
      // REMOVE LEFT AND RIGHT
    while(true) {

    }
}