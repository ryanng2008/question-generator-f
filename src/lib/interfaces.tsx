export interface Category {
    author: string;
    description: string;
    id: string;
    imageLink: string;
    questions: string[];
    tags: string[];
    title: string;
}

export interface RawQuestion {
    question: string,
    rvs: RandomVariable[],
    pvs: ProcessedVariables,
    answer_expressions: ProcessedVariables
    answer: string
}

export interface Question {
    question: string,
    answer: string
}

interface RandomVariable {
    name: string,
    lb: number,
    hb: number
}

interface ProcessedVariables {
    [variable: string]: string // evalString
}
