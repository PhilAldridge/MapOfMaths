import { useRouter } from 'next/navigation'

function Banner() {
    const router = useRouter();
  return (
    <div className='h-72  w-full text-center justify-center flex items-center font-bold tracking-wide bg-repeat bg-opacity-70' 
        style={{fontSize:"3.5rem", 
                lineHeight:"1", 
                backgroundImage: 'url("/stripes.png")',
                backgroundSize:'10%',
                maskImage: 'url("/faded-edges.png")',
                WebkitMaskImage: 'url("/faded-edges.png")',
                maskSize: '100% 100%',
                WebkitMaskSize:'150% 100%',
                WebkitMaskPositionX: '50%',
                maskPosition: 'center'
            }}>
        <span className='bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-300 hover:bg-right hover:cursor-pointer' onClick={()=>{router.push('/')}} style={{backgroundSize: '150%', transition: 'all 0.5s linear'}}>
            <span className="hover:text-6xl">M</span>
            <span className="hover:text-6xl">a</span>
            <span className="hover:text-6xl">p</span>
            <span className="hover:text-6xl"> O</span>
            <span className="hover:text-6xl">f</span>
            <span className="hover:text-6xl"> M</span>
            <span className="hover:text-6xl">a</span>
            <span className="hover:text-6xl">t</span>
            <span className="hover:text-6xl">h</span>
            <span className="hover:text-6xl">e</span>
            <span className="hover:text-6xl">m</span>
            <span className="hover:text-6xl">a</span>
            <span className="hover:text-6xl">t</span>
            <span className="hover:text-6xl">i</span>
            <span className="hover:text-6xl">c</span>
            <span className="hover:text-6xl">s</span>

        </span>
    </div>
      
  )
}

export default Banner