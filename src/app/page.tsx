import CheckInForm from '@/components/checkin-form'
import Contact from '@/components/contact'
import FoodDrinks from '@/components/food-drink'
import Footer from '@/components/footer'
import Header from '@/components/header'
import Rooms from '@/components/rooms'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div>
      {/* hero main */}
      <main
        className='relative min-h-screen bg-cover bg-center text-white text-center flex justify-center items-center'
        style={{ backgroundImage: "url('/images/hero-image.jpg')" }}
      >
        {/* Dark overlay */}
        <div className='absolute inset-0 bg-black opacity-30 z-0' />

        {/* Content */}
        <div className='relative z-10 px-4 flex gap-7 flex-col'>
          <div>
            <h1 className='text-7xl font-bold'>Harmony House</h1>
            {/* <span className='text-2xl font-'>K.T.V</span> */}
          </div>
          <p className='text-2xl max-w-[700px] m-auto'>
            Sing your heart out at Harmony House! Book your KTV room online for
            a hassle-free and fun-filled karaoke experience.
          </p>

          <button className='bg-[#944EA8] w-[150px] m-auto py-3 rounded-md'>
            Get Started
          </button>

          {/* <CheckInForm /> */}
        </div>
      </main>

      {/* rooms  */}
      <Rooms />

      {/* foods and drinks */}
      <FoodDrinks />

      {/* contact */}
      <Contact />
    </div>
  )
}
