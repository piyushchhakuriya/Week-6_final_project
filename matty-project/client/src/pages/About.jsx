import React from "react";

const AboutUs = () => (
  <div className="bg-gray-50 min-h-screen flex flex-col items-center">
    <div className="max-w-3xl w-full px-6 py-12">
      <h1 className="text-5xl font-extrabold mb-6 text-center text-indigo-700" style={{ fontFamily: '"Kablammo", system-ui' }}>
        About Matty
      </h1>
      <p className="text-lg mb-8 text-gray-800 text-center">
        <span className="font-bold">Matty</span> is a next-generation visual design tool for creators, students, and professionals. Whether you're sketching concepts, building presentations, or designing software diagrams, Matty's powerful canvas and instant cloud dashboard empower you to work fast, share, and stay organized.
      </p>
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Key Features</h2>
        <ul className="list-disc pl-8 text-gray-700 space-y-2">
          <li><span className="font-bold">Intuitive Canvas:</span> Drag, draw, and edit shapes, text, or images effortlessly.</li>
          <li><span className="font-bold">Real-time Saving:</span> Instantly save projects with thumbnails to your personal dashboard.</li>
          <li><span className="font-bold">Team Collaboration:</span> Share designs and collaborate securely with others.</li>
          <li><span className="font-bold">Built for Speed:</span> Cutting-edge React/Node.js stack means seamless user experience.</li>
        </ul>
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Our Mission</h2>
        <p>
          The goal of Matty is creative freedom for everyone—students, innovators, educators, engineers. We believe digital tools should spark ideas and productivity, not slow them down.
        </p>
      </section>
      <div className="text-center mt-8">
        <a
          href="/register"
          className="inline-block px-6 py-2 rounded-full border border-black bg-black text-white font-semibold hover:bg-white hover:text-black transition"
        >
          Try Matty Free
        </a>
      </div>
    </div>
    <footer className="w-full py-4 text-center text-gray-500 text-sm mt-14 border-t">
      &copy; {new Date().getFullYear()} Matty Product Platform. Designed for builders, learners and teams.
    </footer>
  </div>
);

export default AboutUs;
