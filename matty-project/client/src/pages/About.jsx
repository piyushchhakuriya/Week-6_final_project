import React from "react";

const AboutUs = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 flex flex-col items-center">
    <div className="max-w-4xl w-full">
      <h1 className="text-5xl font-extrabold text-center text-black mb-6">About Matty</h1>
      <p className="text-lg text-gray-700 mb-10 text-center">
        <span className="font-bold">Matty</span> is the next-generation visual design and diagramming platform for students, creators, and developers—from simple sketches to complex product flows.
        Built with modern web technology, Matty empowers fast creative work with real-time editing, secure cloud storage, and instant project management.
      </p>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-indigo-700 mb-2">Why Choose Matty?</h2>
        <ul className="list-disc pl-6 text-gray-800 space-y-2">
          <li>
            <span className="font-bold">Easy Canvas Editing:</span> Draw, drag, resize, annotate, and upload—all with a single click.
          </li>
          <li>
            <span className="font-bold">Design Management:</span> Organize and revisit your projects from your dashboard, every design gets a live thumbnail!
          </li>
          <li>
            <span className="font-bold">Secure & Collaborative:</span> Privacy-first and teamwork ready—with login, JWT authentication, and powerful sharing.
          </li>
          <li>
            <span className="font-bold">Lightning Fast:</span> Built on React and Node.js for performance even in the classroom or on the move.
          </li>
        </ul>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-indigo-700 mb-2">Our Mission</h2>
        <p className="text-gray-700">
          Matty’s goal is creative freedom for everyone.<br/>
          Whether you’re a student building assignments, a software engineer designing APIs, or an artist sketching ideas—Matty has the speed, features, and flexibility you need.
        </p>
      </div>
      <div className="mt-10 text-center">
        <a
          href="/register"
          className="inline-block px-6 py-2 rounded-full border border-black bg-black text-white font-semibold hover:bg-white hover:text-black transition"
        >
          Get Started Free
        </a>
      </div>
    </div>
    <footer className="w-full mt-16 text-center text-sm text-gray-400">
      &copy; {new Date().getFullYear()} Matty AI Design Tool. Crafted for teams, students, and innovators.
    </footer>
  </div>
);

export default AboutUs;
