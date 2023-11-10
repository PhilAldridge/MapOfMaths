interface AtomResult {
    //TODO
        atoms: {
            properties: Atom
        }
    }
    
    type Atom =  {
        type: number;
        id: IdLowHigh;
        name: string;
        children?: Atom[]
    }

    type IdLowHigh = {
        high: string;
        low:string
    }

    type ConcreteQuestion = {
        question: string;
        answer: string
    }
    
    type QuestionVariable = {
        name?: string;
        fullString: string;
        edittedString: string;
        value?: string;
        variablesReferenced: string[]
    }