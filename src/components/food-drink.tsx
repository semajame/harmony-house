import Image from 'next/image'

const foodAndDrinks = [
  {
    name: 'Chicharon',
    image: '/images/foods/chicharon.png',
    price: '₱199',
  },
  {
    name: 'Cracklings',
    image: '/images/foods/cracklings.png',
    price: '₱149',
  },
  {
    name: 'Oishi',
    image: '/images/foods/oishi.png',
    price: '₱299',
  },
  {
    name: 'Patata',
    image: '/images/foods/patata.png',
    price: '₱49',
  },
  {
    name: 'Peanuts',
    image: '/images/foods/peanuts.png',
    price: '₱89',
  },
  {
    name: 'Grande',
    image: '/images/foods/grande.png',
    price: '₱199',
  },
  {
    name: 'Flavored Beer',
    image: '/images/foods/flavored-beer.png',
    price: '₱149',
  },
  {
    name: 'San Miguel Light',
    image: '/images/foods/san-mig-light.png',
    price: '₱299',
  },
  {
    name: 'Smirnoff',
    image: '/images/foods/smirnoff.png',
    price: '₱49',
  },
  {
    name: 'San Miguel',
    image: '/images/foods/san-miguel.png',
    price: '₱89',
  },
]

const FoodAndDrinks = () => {
  return (
    <div className='min-h-screen p-6  bg-white'>
      <h1 className='text-4xl font-bold text-center mb-10 text-gray-800'>
        Food & Drinks
      </h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
        {foodAndDrinks.map((item, index) => (
          <div
            key={index}
            className='border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300'
          >
            <Image
              src={item.image}
              alt={item.name}
              width={70}
              height={70}
              className='w-full h-42 object-contain'
            />
            <div className='p-4'>
              <h2 className='text-xl font-semibold mb-2 text-[#944EA8]'>
                {item.name}
              </h2>
              <p className='text-gray-700'>{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FoodAndDrinks
