'use client';
import React from 'react';
import { TextHoverEffect } from './ui/text-hover-effect';

const Footer = () => {
  return (
    <div className="relative z-40 mt-2 flex min-h-36 w-full items-center justify-end overflow-hidden">
      <TextHoverEffect
        text="FOUNDERS"
        automatic
        duration={2}
        className="absolute z-50 mt-40 h-fit w-full"
      />
    </div>
  );
};

export default Footer;
