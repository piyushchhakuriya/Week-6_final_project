import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => (
  <div className="relative min-h-screen flex flex-col overflow-hidden">
    {/* Video as background */}
    <video
      autoPlay
      loop
      muted
      className="absolute inset-0 w-full h-full object-cover z-0"
      src="hd.mp4"
      type="video/mp4"
    />

    {/* Overlay for readability */}
    <div className="absolute inset-0 bg-black bg-opacity-40 z-10 "></div>

    {/* Main Content */}
    <div className="relative z-20 min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-5 py-3 ">
        <div className="text-5xl font-extrabold text-white cursor-pointer" style={{ fontFamily: '"Kablammo", system-ui' }}>Matty</div>
        <nav className="flex items-center gap-8">
          <Link to="/about" className="text-white hover:underline">About Us</Link>
          <a href="#" className="text-white hover:underline">Our Blog</a>
          <a href="#" className="text-white hover:underline">Contact Us</a>
          <Link to="/login" className="px-6 py-2 rounded-full border border-black text-white font-semibold bg-black transition-colors duration-200 hover:bg-white hover:text-black" style={{ letterSpacing: '0.05em' }}>Login</Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-5xl font-extrabold leading-tight text-center mt-9 mb-4 text-white">
          Think, plan, and create<br />
          <span className="text-gray-200 font-normal">all in one place</span>
        </h1>
        <p className="text-lg text-gray-100 mb-8 text-center">
          Efficiently design, organize, and save your creative work with Matty.
        </p>
        <Link
          to="/register"
          className="text-3xl px-10 py-5 rounded-full border border-black text-white font-semibold bg-black transition-colors duration-200 hover:bg-white hover:text-black" style={{ letterSpacing: '0.05em' }}
        >
          Start Designing
        </Link>
      </main>

      <footer className="py-6 text-center text-gray-200 text-sm border-t border-gray-500/20">
        &copy; 2025 Matty. All rights reserved.
      </footer>
    </div>
  </div>
);

export default HomePage;
