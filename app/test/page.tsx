import {createConcreteQuestion} from '@/app/lib/questionParse'



function page() {
    (
        [//createConcreteQuestion("",""),
        //createConcreteQuestion("What is {$x=4} + {$y=5}?", "{$x+$y}"),
        //createConcreteQuestion("What is {$x+$y} - {$y=5}?", "{$x=randBetween(6,9)}"),
        //createConcreteQuestion("What is {$xam=[1,2,3,4,5]} x 2?","{$xam*2}"),
        //createConcreteQuestion("What is ({$x=randBetween(3,9)}x({$y=[13,15]}-{$z=[4,5,6,randBetween(1,3)]}))?", "{($x*($y-$z))}"),
        //createConcreteQuestion("What is {$x=[5,6,7]}^{$y=[-1,2,3]}?", "{$x^$y}"),
        createConcreteQuestion("What is {$x=randBetween(1,20)*10 + randBetween(5,9)} + {$y=randBetween(1,20)*10 + randBetween(5,9)}?","{$x+$y}")
    
    
    ]
    )



  return (<>

  </>)
}

export default page