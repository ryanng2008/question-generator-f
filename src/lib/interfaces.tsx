export interface Category {
    author: string;
    description: string;
    _id: string;
    imageLink: string;
    questions: string[];
    tags: string[];
    title: string;
}

export interface RawQuestion {
    question: string,
    rvs: RV[],
    pvs: ProcessedVariables,
    answer_expressions: ProcessedVariables
    answer: string
}

export interface Question {
    question: string,
    answer: string,
    creator: string,
    id: string
}

export interface RV {
    name: string,
    lb: number,
    hb: number
}

export interface RVClient {
    name: string,
    lb: string,
    hb: string
}


export interface PVClient {
    varName: string,
    latex: string,
    coefficient: boolean,
    dp: number
}

interface ProcessedVariables {
    [variable: string]: string // evalString
}
