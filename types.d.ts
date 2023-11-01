interface AtomResult {
    //TODO
        atoms: {
            properties: Atom
        }
    }
    
    type Atom =  {
        TypeId: number;
        Id: IdLowHigh;
        Name: string;
        Children?: Atom[]
    }

    type IdLowHigh = {
        high: string;
        low:string
    }