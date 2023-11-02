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