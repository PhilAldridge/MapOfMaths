export function createConcreteQuestion(question:string, answer:string): ConcreteQuestion {
    //regex find parts inside {} brackets
    var regex = /{([^}]+)}/g;
    let match;
    let results: QuestionVariable[] = [];
    while (match = regex.exec(question+answer)) {
        if(match[1].includes('=')) {
            results.push({
                name: match[1].split('=')[0],
                fullString: match[1],
                variablesReferenced:findVariablesReferenced(match[1].split('=')[1]),
                edittedString: match[1].split('=')[1]
            });
        } else{
            results.push({
                fullString: match[1],
                variablesReferenced:findVariablesReferenced(match[1]),
                edittedString: match[1]
            })
        }
        
    }
    results = calculateValues(results);
    results.forEach(result=>{
        question = question.replace("{"+result.fullString+"}", result.value as string)
        answer = answer.replace("{"+result.fullString+"}", result.value as string)
    })
    return {question:question,answer:answer}
}

export function findVariablesReferenced(givenString:string): string[] {
    
    let variablesFound: string[] = [];
    let startIndex=0
    let variableFound = false;
    for (let i=0; i<givenString.length; i++){
        if(givenString[i]==="$") {
            startIndex=i;
            variableFound=true;
        } else if(variableFound && !givenString[i].match(/[a-z]/)) {
            variablesFound.push(givenString.substring(startIndex,i))
            variableFound=false;
        }

    }
    if (variableFound) variablesFound.push(givenString.substring(startIndex))
    
    return variablesFound;
}


export function evaluateString(givenString:string): string {
    givenString = givenString.replace(" ", "");

    // array []
    if(givenString[0]==='[') {
        givenString = givenString.substring(1,givenString.length-1);
        //regex commas not contained in brackets
        const possibleValues = givenString.split(/,\s*(?![^()]*\))/g)
        return evaluateString(possibleValues[Math.floor(Math.random()*possibleValues.length)])
    }
    
    // number (regex number including decimals and negatives)
    const numberPattern = /^-?[0-9]\d*(\.\d+)?$/;
    if(numberPattern.test(givenString)) return (givenString);

    //randBetween
    if(givenString.includes('randBetween(')){
        return processRandBetween(givenString);
    }

    //todo trig

    //bracket
    if(givenString.includes('(')) {
        return processBrackets(givenString);
    }

    //operations
    if(givenString.includes('^')) return processExponents(givenString);
    if(givenString.includes('*') || givenString.includes('/')) return processMultiplication(givenString);
    if(givenString.includes('+')||givenString.includes('-')) return processAddition(givenString);

    //return text
    return givenString
}

function getRandomInteger(min:number, max:number):number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function findSubstringInBracket(fullString:string):string {
    const startIndex = fullString.indexOf('(');
    let endIndex = fullString.length-1;
    let bracketDepth = 1;
    for(let i = startIndex+1; i<fullString.length; i++){
        if(i===fullString.length-1 && fullString[i]===')') return fullString.substring(startIndex); 
        if(bracketDepth === 0) {
            endIndex = i;
            break;
        }
        switch(fullString[i]){
            case '(':
                bracketDepth++
                break;
            case ')':
                bracketDepth--;
                break;
            default:
                break;
        }
    }
    return fullString.substring(startIndex,endIndex)
}

function calculateValues(results: QuestionVariable[]) : QuestionVariable[] {
    let done = false;
    while(!done){
        done = true;
        results.forEach(result=> {
            if(!('value' in result)) {
                for(let i=result.variablesReferenced.length-1; i>=0;i--) {
                    const foundVariable = results.find(otherresult=>otherresult.name===result.variablesReferenced[i])
                    if(!foundVariable) throw new Error("variable referenced but not declared: "+result.variablesReferenced[i]);
                    if('value' in foundVariable){
                        result.edittedString = result.edittedString.replace(result.variablesReferenced[i],foundVariable.value?.toString() as string)
                        result.variablesReferenced.splice(i,1);
                    }
                }
            }
            if(result.variablesReferenced.length>0) 
            {
                done=false;
            } else {
                result.value = evaluateString(result.edittedString)
                result.edittedString = result.value;
            }

        })
    }

    return results
}


function processRandBetween(givenString:string):string {
    const start = givenString.indexOf('randBetween(');
    
    const rangeAndBrackets = findSubstringInBracket(givenString.substring(start));
    const range = rangeAndBrackets.substring(1,rangeAndBrackets.length-1).split(/,\s*(?![^()]*\))/g);
    const valueInRange =  getRandomInteger(Number(evaluateString(range[0])), Number(evaluateString(range[1])))
    
    return evaluateString(givenString.replace('randBetween'+rangeAndBrackets,valueInRange.toString()))
}

function processBrackets(givenString:string): string {
    const textAndBrackets = findSubstringInBracket(givenString)
    const updatedString = givenString.replace(textAndBrackets, evaluateString(textAndBrackets.substring(1,textAndBrackets.length-1)).toString())
    return evaluateString(updatedString)
}

function processExponents(givenString:string): string {
    const split = givenString.split('^');
    //reqex splits on any of the following: +-*/^
    const superSplit = split[0].split(/[+\-*/^]/);
    const base = superSplit[superSplit.length-1];
    const exponent = split[1].split(/[+\-*/^]/);
    const newString = givenString.replace(base+"^"+exponent, Math.pow(Number(base),Number(exponent)).toString())
    return evaluateString(newString)
}

function processMultiplication(givenString:string): string {
    const firstMult = givenString.indexOf("*");
    const firstDiv = givenString.indexOf('/');
    let firstOperationIsTimes = true;
    let split = givenString.split('*');
    if((firstMult === -1 || firstDiv<firstMult) && firstDiv !==-1) {
        firstOperationIsTimes = false;
        split = givenString.split('/')
    }
    //reqex splits on any of the following: +-*/^
    const superSplit = split[0].split(/[+\-*/^]/);
    const value = superSplit[superSplit.length-1];
    const multiplier = split[1].split(/[+\-*/^]/)[0];
    let newString="";
    if(firstOperationIsTimes){
        newString = givenString.replace(value+"*"+multiplier, (Number(value)*Number(multiplier)).toString())
    } else {
        newString = givenString.replace(value+"/"+multiplier, (Number(value)/Number(multiplier)).toString())
    }
    return evaluateString(newString);
}

function processAddition(givenString:string): string {
    
    const firstAdd = givenString.indexOf("+");
    const firstSub = givenString.indexOf('-');
    let firstOperationIsAdd = true;
    let split = givenString.split('+');
    if((firstAdd === -1 || firstSub<firstAdd) && firstSub !==-1) {
        firstOperationIsAdd = false;
        split = givenString.split('-')
    }
    //reqex splits on any of the following: +-*/^
    const superSplit = split[0].split(/[+\-*/^]/);
    const value = superSplit[superSplit.length-1];
    const toAdd = split[1].split(/[+\-*/^]/)[0];
    
    let newString="";
    if(firstOperationIsAdd){
        
        newString = givenString.replace(value+"+"+toAdd, (Number(value)+Number(toAdd)).toString())
    } else {
        newString = givenString.replace(value+"-"+toAdd, (Number(value)-Number(toAdd)).toString())
    }
    return evaluateString(newString);
}
//to implement
/*

    //sin, cos, tan
    let trigFnc = null;
    let start='';
    switch(givenString.slice(0,4)) {
        case 'sin(':
            trigFnc= (value:number)=>{return Math.sin(value*Math.PI/180)}
            start = "sin"
            break;
        case 'cos(':
            trigFnc= (value:number)=>{return Math.cos(value*Math.PI/180)}
            start = 'cos'
            break;
        case 'tan(':
            trigFnc= (value:number)=>{return Math.tan(value*Math.PI/180)}
            start = 'tan'
            break;
        default:
            break;
    }
    if(trigFnc !== null) {
        const bracketedValue = findSubstringInBracket(givenString);
        const value = trigFnc(evaluateString(bracketedValue.substring(1,bracketedValue.length-1)) as number)
        return evaluateString(givenString.replace(start+bracketedValue,value.toString()))
    }*/