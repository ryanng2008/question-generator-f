export interface Category {
    author: string;
    description: string;
    _id: string;
    imageLink: string;
    questions: string[];
    tags: string[];
    title: string;
}

export interface QuestionTemplateType {
    question: string,
    rvs: RVClient[],
    pvs: PVClient[],
    // answer_expressions: ProcessedVariables
    answer: string,
    tags: string[]
}

export interface GeneratedQuestionType {
    question: string,
    answer: string,
    creator: string,
    tags: string[],
    id: string
}

export interface RV {
    name: string,
    lb: number,
    hb: number
}

export interface RVClient {
    name: string,
    lb: string | number,
    hb: string | number,
    dp?: number,
    coefficient?: boolean
}


export interface PVClient {
    varName: string,
    latex: string,
    coefficient: boolean,
    dp: number
}

// interface ProcessedVariables {
//     [variable: string]: string // evalString
// }
export interface BulkInputQuestion {
    questionInput: string,
    solutionInput: string,
    template: QuestionTemplateType,
    checked?: boolean | null,
    flagged?: boolean | null,
    sample: {
        question: string,
        answer: string
    },
    tab?: 'input' | 'preview' | null,
    canRandomize?: boolean | null
}