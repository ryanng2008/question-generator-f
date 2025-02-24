import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

export function Info() {
    return (
        <div className="absolute right-0 md:w-[700px] border-2 border-darkgray bg-white py-3 px-4 text-darkgray rounded-lg text-sm top-full mt-1 drop-shadow-xl flex flex-col gap-2">
        <ul className="list-disc list-inside space-y-1"> 
            <li>Generate random integers with Random Variables (min and max inclusive)</li>
            <li>You can use Random Variables inside math expressions in Processed Variables: e.g. sin(a+b)</li>
            {/* <li>Use Random Variables inside your Processed Variables expressions: e.g. sin(<strong>a</strong>)</li> */}
            <li>Use both types of variables in the Question & Answer Input by adding <strong>[[</strong>double square brackets<strong>]]</strong></li>
            {/* <li>Delimit Processed Variables with <strong>[[</strong>double square brackets<strong>]]</strong></li> */}
            <li>Render LaTeX in Question and Answer between <strong>$</strong>dollar signs<strong>$</strong></li>
            <li>For <a href="https://katex.org/docs/supported.html" className="hover:underline text-blue-800">all supported LaTeX commands</a></li>
        </ul>
        <h1 className="text-lg font-semibold">Additional notes</h1>
        <ul className="space-y-2">
            <li className="flex items-center">Open the three dots <EllipsisVerticalIcon className="h-5" />  to configure constants & decimal places</li>
            {/* <li>Answer field coming soon!</li> */}
            <li>Sorry that the &lt; symbol is broken right now... use "&amp;lt;"</li>
        </ul>
        </div>
    )
}