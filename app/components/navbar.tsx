import React from 'react'

const Navbar = () => {

  // will change the fonts later on

  return (
    <div className='w-[calc(100%-60px)] h-[60px] border-b-[3.5px] border-black fixed top-0 right-0 z-[15]'>
      <div className='w-full h-full flex flex-row justify-between items-center'>
        <a href='/' className='text-center font-noto-serif font-bold text-3xl ml-2'>founder's club</a>
        <div className='w-56 h-full border-l-[3.5px] border-black cursor-pointer transition-all duration-150 ease-in-out hover:bg-yellow-200'>
          <p className='text-xl transition-all duration-150 ease-in-out hover:-translate-x-2 w-full h-full flex justify-center items-center'>Let's Chat!</p>
        </div>
      </div>
    </div>
  )
}

export default Navbar