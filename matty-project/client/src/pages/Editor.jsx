import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CanvasEditor from '../components/CanvasEditor'; // Adjust the path as needed

const Editor = () => {
  const { id } = useParams();
  const [designData, setDesignData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setDesignData({}); // New blank design
      return;
    }

    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    fetch(`http://localhost:5000/api/designs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch design');
        return res.json();
      })
      .then((data) => {
        setDesignData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setDesignData({});
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading design...</div>;
  if (error) return <div>Error: {error}</div>;

  // Always pass an object to CanvasEditor
  return <CanvasEditor initialData={designData || {}} />;
};

export default Editor;
