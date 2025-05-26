const Footer = () => {
  return (
    <footer className='bg-[#944EA8] text-white text-center py-10'>
      <div className='container mx-auto px-4'>
        <p className='text-sm'>
          &copy; {new Date().getFullYear()} Harmony House KTV. All rights
          reserved.
        </p>
        <div className='mt-2 flex justify-center gap-6 text-sm'>
          <a href='#' className='hover:underline'>
            Privacy Policy
          </a>
          <a href='#' className='hover:underline'>
            Terms of Service
          </a>
          <a href='#' className='hover:underline'>
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
