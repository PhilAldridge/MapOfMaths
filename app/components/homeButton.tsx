import { useRouter } from 'next/navigation'
import Image from 'next/image';

function HomeButton() {
    const router = useRouter();
  return (
    <div className=' absolute w-full text-left p-8 z-50'>
        <button onClick={()=>{router.push('/')}} className='hover:cursor-pointer transition duration-300 hover:scale-110 hover:brightness-110 active:translate-y-px active:brightness-75 '>
          <Image
            src="/home.png"
            alt="Home"
            width="64"
            height="64"
          />
        </button>
  
    </div>
    )
}

export default HomeButton

