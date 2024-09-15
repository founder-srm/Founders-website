'use client'
import React from 'react'
import { TextHoverEffect } from './ui/text-hover-effect'

const Footer = () => {
  return (
    <div className='flex w-full min-h-36 relative items-center justify-end mt-2 overflow-hidden z-40'>
        <TextHoverEffect text="FOUNDERS" automatic duration={2} className='w-full h-fit absolute z-50 mt-40' />
    </div>
  )
}

export default Footer