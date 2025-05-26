import Carousel from '@/components/home/carousel'
import CheckInForm from '@/components/checkin-form'
import Contact from '@/components/home/contact'
import FoodDrinks from '@/components/home/food-drink'
import Footer from '@/components/home/footer'
import Header from '@/components/home/header'
import Rooms from '@/components/home/rooms'
import { Button } from '@/components/ui/button'
import { Music, Star } from 'lucide-react'

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
        <div className='relative z-10 px-4 flex gap-7 flex-col items-center pt-[4rem]'>
          <div>
            <h1 className='text-7xl font-bold font-serif italic '>
              Harmony House
            </h1>

            <div className='flex items-center justify-center gap-2 my-2'>
              <Music className='w-6 h-6 text-purple-400' />
              <span className='text-2xl font-light tracking-widest text-purple-200'>
                K.T.V EXPERIENCE
              </span>
              <Music className='w-6 h-6 text-purple-400' />
            </div>
            <div className='flex justify-center gap-1 mb-4'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className='w-5 h-5 text-yellow-400 fill-current'
                />
              ))}
              <span className='ml-2 text-sm text-gray-300'>
                (4.9/5 from 500+ reviews)
              </span>
            </div>
            {/* <span className='text-2xl font-'>K.T.V</span> */}
          </div>
          <p className='text-xl max-w-[700px] m-auto text-bold'>
            Sing your heart out at Harmony House! Experience premium KTV rooms
            with state-of-the-art sound systems, extensive song libraries, and
            unforgettable moments with friends.
          </p>

          <div className='flex gap-8 text-center mb-4'>
            <div className='flex flex-col items-center'>
              <div className='text-3xl font-bold text-purple-400'>4</div>
              <div className='text-sm text-gray-300'>Premium Rooms</div>
            </div>
            <div className='flex flex-col items-center'>
              <div className='text-3xl font-bold text-pink-400'>50K+</div>
              <div className='text-sm text-gray-300'>Songs Available</div>
            </div>
            <div className='flex flex-col items-center'>
              <div className='text-3xl font-bold text-blue-400'>24/7</div>
              <div className='text-sm text-gray-300'>Open Daily</div>
            </div>
          </div>

          <button className='bg-[#944EA8] w-[150px] m-auto py-3 rounded-md cursor-pointer'>
            Get Started
          </button>
        </div>
      </main>

      {/* rooms  */}
      <Rooms />

      <Carousel />

      {/* foods and drinks */}
      <FoodDrinks />

      {/* contact */}
      <Contact />
    </div>
  )
}
