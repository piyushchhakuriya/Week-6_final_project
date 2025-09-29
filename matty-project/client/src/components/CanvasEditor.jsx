import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Image } from 'react-konva';
import useImage from 'use-image';

const CanvasImage = ({ imgData }) => {
  const [image] = useImage(imgData.url);
  return <Image image={image} x={imgData.x} y={imgData.y} width={imgData.width} height={imgData.height} />;
};

const CanvasEditor = ({ design }) => {
  const stageRef = useRef();
  const [history, setHistory] = useState([design.jsonData]);
  const [step, setStep] = useState(0);
  const [currentData, setCurrentData] = useState(design.jsonData);

  useEffect(() => {
    setCurrentData(history[step]);
  }, [step, history]);

  const addRect = () => {
    const newData = {
      ...currentData,
      shapes: [...currentData.shapes, { type: 'rect', x: 50, y: 50, width: 100, height: 100, color: 'red' }],
    };
    const newHistory = [...history.slice(0, step + 1), newData];
    setHistory(newHistory);
    setStep(step + 1);
  };

  const undo = () => step > 0 && setStep(step - 1);
  const redo = () => step < history.length - 1 && setStep(step + 1);

  return (
    <div className="flex flex-col">
      <div className="mb-2">
        <button onClick={addRect} className="px-2 py-1 bg-blue-500 text-white rounded">Add Rectangle</button>
        <button onClick={undo} className="px-2 py-1 bg-gray-500 text-white rounded ml-2">Undo</button>
        <button onClick={redo} className="px-2 py-1 bg-gray-500 text-white rounded ml-2">Redo</button>
      </div>
      <Stage width={800} height={600} ref={stageRef} className="border border-gray-300">
        <Layer>
          {currentData.shapes.map((s, i) => (
            <Rect key={i} x={s.x} y={s.y} width={s.width} height={s.height} fill={s.color} />
          ))}
          {currentData.text.map((t, i) => (
            <Text key={i} x={t.x} y={t.y} text={t.content} fontSize={t.fontSize} fill={t.color} />
          ))}
          {currentData.images.map((img, i) => (
            <CanvasImage key={i} imgData={img} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasEditor;
