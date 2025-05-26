'use client'

import Image from 'next/image'

const images = [
  '/images/people-singing.jpg',
  '/images/people-singing-2.jpg',

  '/images/login-image-2.jpg',
]

export default function Carousel() {
  return (
    <div className='overflow-hidden w-full py-4'>
      <div className='relative flex w-max animate-scroll space-x-4'>
        {[...images, ...images].map((src, i) => (
          <div key={i} className='min-w-[500px] h-full flex-shrink-0'>
            <Image
              src={src}
              alt={`Image ${i}`}
              width={500}
              height={500}
              className='object-cover w-full h-auto'
            />
          </div>
        ))}
      </div>
    </div>
  )
}
