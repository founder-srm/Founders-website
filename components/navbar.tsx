import React from 'react';

const Navbar = () => {
  return (
    <div className="fixed right-0 top-0 z-[15] h-[60px] w-[calc(100%-60px)] border-b-[3.5px] border-black">
      <div className="flex h-full w-full flex-row items-center justify-between">
        <a href="/" className="ml-2 text-center font-hanson text-3xl font-bold">
          founder&apos;s club
        </a>
        <div className="h-full w-56 cursor-pointer border-l-[3.5px] border-black transition-all duration-150 ease-in-out hover:bg-yellow-200">
          <p className="flex h-full w-full items-center justify-center font-hanson text-xl font-bold transition-all duration-150 ease-in-out hover:-translate-x-2">
            Let&apos;s Chat!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
