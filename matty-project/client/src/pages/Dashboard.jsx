import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('Date Created');
  const navigate = useNavigate();

  const token = localStorage.getItem('token') || 'YOUR_JWT_TOKEN';

  useEffect(() => {
    fetchDesigns();
    // eslint-disable-next-line
  }, []);

  const fetchDesigns = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/designs', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDesigns(data);
        else if (data.designs && Array.isArray(data.designs)) setDesigns(data.designs);
        else setDesigns([]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const deleteDesign = (id) => {
    if (!window.confirm('Are you sure you want to delete this design?')) return;

    fetch(`http://localhost:5000/api/designs/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete design');
        setDesigns((prev) => prev.filter((design) => design._id !== id));
      })
      .catch((err) => {
        alert('Failed to delete design: ' + err.message);
      });
  };

  const sortedDesigns = [...designs].sort((a, b) => {
    if (sortBy === "Title") {
      return (a.title || '').localeCompare(b.title || '');
    }
    // Default: Newest first if createdAt exists
    if (sortBy === "Date Created" && a.createdAt && b.createdAt) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });
  const visibleDesigns = sortedDesigns.slice(0, 8);

  const handleAddNew = () => navigate('/editor');
  const openDesign = (id) => navigate(`/editor/${id}`);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4">
        <div className="text-5xl font-extrabold text-black-700 cursor-pointer" onClick={() => navigate('/')} style={{ fontFamily: '"Kablammo", system-ui' }}>
          Matty
        </div>
        <div className="flex gap-4">
          <div className="flex gap-32 items-center">
            <a href="About" className="text-gray-700 hover:underline">About us</a>
            <a href="#" className="text-gray-700 hover:underline">Reviews</a>
            <a href="#" className="text-gray-700 hover:underline">Our blog</a>
          </div>
        </div>
        <button
          className="px-6 py-2 rounded-full border border-black text-white font-semibold bg-black transition-colors duration-200 hover:bg-white hover:text-black" style={{ letterSpacing: '0.05em' }}
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
        >
          Logout
        </button>
      </header>

      {/* Banner */}
      <section className="relative mt-6 mx-8 rounded-xl h-80 flex items-center overflow-hidden" style={{ letterSpacing: '0.05em' }}>
        <video
          className="absolute inset-0 w-full h-full object-cover brightness-100"
          autoPlay
          loop
          muted
          playsInline
          src="/bg.mp4"
          type="video/mp4"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" /> {/* overlay */}
        <h1 className="relative z-10 text-4xl font-bold text-white mx-auto">Projects</h1>
      </section>
      {/* Controls & sorting */}
      <div className="flex flex-wrap justify-between items-center my-8 mx-8">
        <h2 className="text-2xl font-semibold">Recent designs</h2>
        <div className="flex gap-3 items-center">
          <label htmlFor="sort" className="text-gray-600 mr-1">
            Sort by:
          </label>
          <select
            id="sort"
            className="bg-white border px-2 py-1 rounded"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="Date Created">Date Created</option>
            <option value="Title">Title</option>
          </select>
          <button
            className="px-6 py-2 rounded-full border border-black text-white font-semibold bg-black transition-colors duration-200 hover:bg-white hover:text-black"
            onClick={handleAddNew}
          >
            + Add New Design
          </button>
        </div>
      </div>

      {/* Design cards */}
      <div className="mx-8">
        {loading ? (
          <div className="py-20 text-center text-gray-500">Loading designs...</div>
        ) : designs.length === 0 ? (
          <div className="py-20 text-center text-gray-400">No designs found.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {visibleDesigns.map((design) => (
              <div
                key={design._id}
                className="bg-white rounded-xl shadow p-3 flex flex-col items-center hover:cursor-pointer hover:shadow-lg relative"
                title="Click to open editor"
              >
                <div onClick={() => openDesign(design._id)} className="w-full">
                  {design.thumbnailUrl ? (
                    <img
                      src={design.thumbnailUrl}
                      alt="Thumbnail"
                      className="w-full h-40 object-contain rounded mb-2 bg-gray-100"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center mb-2 rounded text-gray-400 text-sm">
                      No thumbnail
                    </div>
                  )}
                  <div className="w-full font-semibold text-center truncate">
                    {design.title || 'Untitled Design'}
                  </div>
                </div>
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDesign(design._id);
                  }}
                  className="absolute top-2 right-2 py-1 px-3 text-sm text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {designs.length > visibleDesigns.length && (
          <div className="flex justify-center mt-8">
            <button className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded font-semibold hover:bg-indigo-200">
              See more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
