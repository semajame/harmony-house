import { foodAndDrinks } from '@/lib/foods-drinks'
import Image from 'next/image'

const FoodAndDrinks = () => {
  return (
    <div className='bg-white m-auto max-w-7xl py-[5rem] px-4' id='menu'>
      <h1 className='text-4xl font-bold text-center mb-4 text-gray-800'>
        Food & Drinks
      </h1>
      <p className='text-gray-600 text-center mb-10 max-w-2xl mx-auto'>
        Enhance your karaoke experience with our delicious selection of Filipino
        favorites and refreshing beverages
      </p>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {foodAndDrinks.map((item, index) => (
          <div
            key={index}
            className='border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white'
          >
            <div className='relative'>
              <Image
                src={item.image}
                alt={item.name}
                width={300}
                height={200}
                className='w-full h-48 object-contain bg-gray-50'
              />
              <span
                className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                  item.category === 'food'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {item.category === 'food' ? '🍽️ Food' : '🍺 Drink'}
              </span>
            </div>

            <div className='p-4'>
              <div className='flex justify-between items-start mb-2'>
                <h2 className='text-xl font-semibold text-[#944EA8]'>
                  {item.name}
                </h2>
                <span className='text-lg font-bold text-gray-800'>
                  {item.price}
                </span>
              </div>

              <p className='text-gray-600 text-sm leading-relaxed mb-3'>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-12 text-center'>
        <div className='bg-gray-50 rounded-lg p-6 max-w-4xl mx-auto'>
          <h3 className='text-2xl font-semibold text-gray-800 mb-3'>
            🎤 Perfect Pairings for Your KTV Experience
          </h3>
          <p className='text-gray-600 mb-4'>
            All our food and drinks are carefully selected to complement your
            singing session. Light snacks won't weigh you down, while our
            beverages keep your voice smooth and your spirits high!
          </p>
          <div className='flex flex-wrap justify-center gap-4 text-sm'>
            <span className='bg-purple-100 text-purple-800 px-3 py-1 rounded-full'>
              ✨ Fresh Daily
            </span>
            <span className='bg-green-100 text-green-800 px-3 py-1 rounded-full'>
              🌟 Premium Quality
            </span>
            <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full'>
              🚀 Fast Service
            </span>
            <span className='bg-orange-100 text-orange-800 px-3 py-1 rounded-full'>
              💰 Great Value
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FoodAndDrinks
