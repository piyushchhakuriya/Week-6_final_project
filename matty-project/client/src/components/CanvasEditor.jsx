import React, { useRef, useEffect, useState } from "react";


function drawPolygon(ctx, x, y, radius, sides, color) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (2 * Math.PI * i) / sides - Math.PI / 2;
    const dx = x + radius * Math.cos(angle);
    const dy = y + radius * Math.sin(angle);
    if (i === 0) {
      ctx.moveTo(dx, dy);
    } else {
      ctx.lineTo(dx, dy);
    }
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

const HANDLE_SIZE = 16;
let nextId = 1;

const getDefaultSize = (type, text, ctx) => {
  if (type === "rectangle") return { w: 120, h: 80 };
  if (type === "square" || type === "circle") return { w: 100, h: 100 };
  if (type === "oval") return { w: 120, h: 80 };
  if (type === "image") return { w: 200, h: 200 };
  if (type === "text") {
    ctx.font = "24px Arial";
    return { w: ctx.measureText(text).width, h: 32, fontSize: 24 };
  }
  return { w: 120, h: 80 };
};

const CanvasEditor = ({ initialData }) => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [designName, setDesignName] = useState("");
  const [selectedShape, setSelectedShape] = useState("rectangle");
  const [shapeColor, setShapeColor] = useState("#4f46e5");
  const [drawMode, setDrawMode] = useState(false);
  const [eraserMode, setEraserMode] = useState(false);
  const [eraserSize, setEraserSize] = useState(20);
  const [textColor, setTextColor] = useState("#111827");
  const [pencilColor, setPencilColor] = useState("#333");
  const [brushSize, setBrushSize] = useState(2);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [resizingHandle, setResizingHandle] = useState(null);
  const drawingPointsRef = useRef([]);

  const [history, setHistory] = useState([
    { elements: [], lines: [], title: "" },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [imageCache, setImageCache] = useState({});

  // Destructure current elements, lines, title from history to use in render & save
  const { elements, lines, title } = history[historyIndex];

  // Load initialData properly when component mounts or changes
 useEffect(() => {
  setHistory([
    {
      elements: initialData?.jsonData?.elements || [],
      lines: initialData?.jsonData?.lines || [],
      title: initialData?.title || "",
    },
  ]);
  setHistoryIndex(0);
  setDesignName(initialData?.title || "");
}, [initialData]);

  // Cache loaded images for drawn image elements
  useEffect(() => {
    elements.forEach((el) => {
      if (el.type === "image" && el.src && !imageCache[el.id]) {
        const img = new window.Image();
        img.src = el.src;
        img.onload = () => setImageCache((c) => ({ ...c, [el.id]: img }));
      }
    });
  }, [elements, imageCache]);

  // Draw all elements and lines on canvas on every change
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineWidth = 2;

    elements.forEach((el, idx) => {
      ctx.save();
      const w = el.w,
        h = el.h;
      const cx = el.x + w / 2;
      const cy = el.y + h / 2;
      ctx.translate(cx, cy);
      ctx.rotate(((el.rotation || 0) * Math.PI) / 180);
      ctx.translate(-cx, -cy);

      if (el.type === "image") {
        const img = imageCache[el.id];
        if (img) {
          ctx.drawImage(img, el.x, el.y, w, h);
          if (idx === selectedIdx) {
            ctx.strokeStyle = "#f59e42";
            ctx.lineWidth = 2;
            ctx.strokeRect(el.x - 2, el.y - 2, w + 4, h + 4);
            drawHandles(ctx, el.x, el.y, w, h);
          }
        }
      } 
      else if (el.type === "text") {
  ctx.font = `${el.fontSize || 24}px ${el.fontFamily || "Arial"}`;
  ctx.fillStyle = el.color;
  ctx.fillText(el.text, el.x, el.y + (el.fontSize || 24));
  const boxW = el.w;
  const boxH = el.h || (el.fontSize || 24) + 8;
  if (idx === selectedIdx) {
    ctx.strokeStyle = "#f59e42";
    ctx.strokeRect(el.x - 2, el.y - 2, boxW + 4, boxH + 4);
    drawHandles(ctx, el.x, el.y, boxW, boxH);
  }
}


       else {
        ctx.fillStyle = el.color;
        ctx.strokeStyle = el.color;
        switch (el.type) {
          case "rectangle":
          case "square":
            ctx.fillRect(el.x, el.y, w, h);
            break;
          case "circle":
            ctx.beginPath();
            ctx.arc(el.x + w / 2, el.y + h / 2, w / 2, 0, 2 * Math.PI);
            ctx.fill();
            break;
          case "oval":
            ctx.save();
            ctx.translate(el.x + w / 2, el.y + h / 2);
            ctx.scale(1.5, 1);
            ctx.beginPath();
            ctx.arc(0, 0, h / 2, 0, 2 * Math.PI);
            ctx.restore();
            ctx.fill();
            break;
          case "triangle":
            ctx.beginPath();
            ctx.moveTo(el.x, el.y + h);
            ctx.lineTo(el.x + w, el.y + h);
            ctx.lineTo(el.x + w / 2, el.y);
            ctx.closePath();
            ctx.fill();
            break;
          case "parallelogram":
            ctx.beginPath();
            ctx.moveTo(el.x + 20, el.y + h);
            ctx.lineTo(el.x + w + 20, el.y + h);
            ctx.lineTo(el.x + w, el.y);
            ctx.lineTo(el.x, el.y);
            ctx.closePath();
            ctx.fill();
            break;
          case "rhombus":
            ctx.beginPath();
            ctx.moveTo(el.x + w / 2, el.y);
            ctx.lineTo(el.x + w, el.y + h / 2);
            ctx.lineTo(el.x + w / 2, el.y + h);
            ctx.lineTo(el.x, el.y + h / 2);
            ctx.closePath();
            ctx.fill();
            break;
          case "trapezoid":
            ctx.beginPath();
            ctx.moveTo(el.x + 20, el.y + h);
            ctx.lineTo(el.x + w - 20, el.y + h);
            ctx.lineTo(el.x + w, el.y);
            ctx.lineTo(el.x, el.y);
            ctx.closePath();
            ctx.fill();
            break;
          case "kite":
            ctx.beginPath();
            ctx.moveTo(el.x + w / 2, el.y);
            ctx.lineTo(el.x + w, el.y + h / 2);
            ctx.lineTo(el.x + w / 2, el.y + h);
            ctx.lineTo(el.x, el.y + h / 2);
            ctx.closePath();
            ctx.fill();
            break;
          case "pentagon":
          case "hexagon":
          case "heptagon":
          case "octagon":
          case "nonagon":
          case "decagon":
            const sides = {
              pentagon: 5,
              hexagon: 6,
              heptagon: 7,
              octagon: 8,
              nonagon: 9,
              decagon: 10,
            }[el.type];
            drawPolygon(
              ctx,
              el.x + w / 2,
              el.y + h / 2,
              Math.min(w, h) / 2,
              sides,
              el.color
            );
            break;
          default:
            break;
        }
        if (idx === selectedIdx) {
          ctx.strokeStyle = "#f59e42";
          ctx.lineWidth = 2;
          ctx.strokeRect(el.x - 2, el.y - 2, w + 4, h + 4);
          drawHandles(ctx, el.x, el.y, w, h);
        }
      }
      ctx.restore();
    });

    lines.forEach((line) => {
      ctx.beginPath();
      ctx.strokeStyle = line.mode === "eraser" ? "rgba(0,0,0,1)" : line.color || "#333";
      ctx.lineWidth = line.size || 2;
      ctx.globalCompositeOperation =
        line.mode === "eraser" ? "destination-out" : "source-over";
      line.points.forEach(([x, y], i) => {
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
    });
  }, [elements, lines, imageCache, selectedIdx]);

  function drawHandles(ctx, x, y, w, h) {
    const handles = [
      [x - HANDLE_SIZE / 2, y - HANDLE_SIZE / 2],
      [x + w - HANDLE_SIZE / 2, y - HANDLE_SIZE / 2],
      [x - HANDLE_SIZE / 2, y + h - HANDLE_SIZE / 2],
      [x + w - HANDLE_SIZE / 2, y + h - HANDLE_SIZE / 2],
    ];
    handles.forEach(([hx, hy]) => {
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.fillRect(hx, hy, HANDLE_SIZE, HANDLE_SIZE);
      ctx.strokeRect(hx, hy, HANDLE_SIZE, HANDLE_SIZE);
    });
  }

  const saveState = (newElements, newLines, newTitle = designName) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      elements: JSON.parse(JSON.stringify(newElements)),
      lines: JSON.parse(JSON.stringify(newLines)),
      title: newTitle,
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setDesignName(newTitle);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSelectedIdx(null);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSelectedIdx(null);
    }
  };

  const getHandleAt = (el, mouseX, mouseY) => {
    const { w, h } = el;
    const handles = [
      [el.x - HANDLE_SIZE / 2, el.y - HANDLE_SIZE / 2],
      [el.x + w - HANDLE_SIZE / 2, el.y - HANDLE_SIZE / 2],
      [el.x - HANDLE_SIZE / 2, el.y + h - HANDLE_SIZE / 2],
      [el.x + w - HANDLE_SIZE / 2, el.y + h - HANDLE_SIZE / 2],
    ];
    for (let i = 0; i < handles.length; i++) {
      const [hx, hy] = handles[i];
      if (
        mouseX >= hx &&
        mouseX <= hx + HANDLE_SIZE &&
        mouseY >= hy &&
        mouseY <= hy + HANDLE_SIZE
      )
        return i;
    }
    return null;
  };

  const handleCanvasMouseDown = (e) => {
    if (!canvasRef.current) return;
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    let clicked = false;
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      const handleIdx = getHandleAt(el, mouseX, mouseY);
      if (i === selectedIdx && handleIdx !== null) {
        setResizingHandle(handleIdx);
        clicked = true;
        break;
      }
      if (
        mouseX >= el.x &&
        mouseX <= el.x + el.w &&
        mouseY >= el.y &&
        mouseY <= el.y + el.h
      ) {
        setSelectedIdx(i);
        setDragOffset({ x: mouseX - el.x, y: mouseY - el.y });
        setIsDragging(true);
        clicked = true;
        break;
      }
    }
    if (!clicked) setSelectedIdx(null);

    if (drawMode || eraserMode) {
      setIsDrawing(true);
      drawingPointsRef.current = [[mouseX, mouseY]];
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (!canvasRef.current) return;
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;

    if (resizingHandle !== null && selectedIdx !== null) {
      const el = elements[selectedIdx];
      const newEl = { ...el };
      if (resizingHandle === 0) {
        newEl.x = mouseX;
        newEl.y = mouseY;
        newEl.w = el.w + (el.x - mouseX);
        newEl.h = el.h + (el.y - mouseY);
      } else if (resizingHandle === 1) {
        newEl.y = mouseY;
        newEl.w = mouseX - el.x;
        newEl.h = el.h + (el.y - mouseY);
      } else if (resizingHandle === 2) {
        newEl.x = mouseX;
        newEl.w = el.w + (el.x - mouseX);
        newEl.h = mouseY - el.y;
      } else if (resizingHandle === 3) {
        newEl.w = mouseX - el.x;
        newEl.h = mouseY - el.y;
      }
      newEl.w = Math.max(20, newEl.w);
      newEl.h = Math.max(20, newEl.h);
      if (el.type === "text") newEl.fontSize = Math.max(12, newEl.h - 8);
      const newElements = elements.map((s, idx) =>
        idx === selectedIdx ? newEl : s
      );
      setHistory((h) => {
        const newHistory = h.slice(0, historyIndex + 1);
        newHistory[historyIndex] = { elements: newElements, lines };
        return newHistory;
      });
      return;
    }

    if (isDragging && selectedIdx !== null) {
      const newElements = elements.map((s, idx) =>
        idx === selectedIdx
          ? { ...s, x: mouseX - dragOffset.x, y: mouseY - dragOffset.y }
          : s
      );
      setHistory((h) => {
        const newHistory = h.slice(0, historyIndex + 1);
        newHistory[historyIndex] = { elements: newElements, lines };
        return newHistory;
      });
    }

    if (isDrawing && (drawMode || eraserMode)) {
      const ctx = canvasRef.current.getContext("2d");
      const points = drawingPointsRef.current;
      points.push([mouseX, mouseY]);
      ctx.beginPath();
      ctx.moveTo(points[points.length - 2][0], points[points.length - 2][1]);
      ctx.lineTo(mouseX, mouseY);
      ctx.lineWidth = eraserMode ? eraserSize : brushSize;
      ctx.strokeStyle = eraserMode ? "rgba(0,0,0,1)" : pencilColor;
      ctx.globalCompositeOperation = eraserMode ? "destination-out" : "source-over";
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
    }
  };

  const handleCanvasMouseUp = () => {
    if (isDrawing) {
      if (!canvasRef.current) return;
      const newLine = {
        id: nextId++,
        points: drawingPointsRef.current,
        color: pencilColor,
        size: brushSize,
        mode: eraserMode ? "eraser" : "draw",
      };
      saveState(elements, [...lines, newLine], designName);
    }

    if (resizingHandle !== null) {
      setResizingHandle(null);
    }
    if (isDragging) {
      setIsDragging(false);
    }
    setIsDrawing(false);
  };

  const handleAddShape = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const { w, h } = getDefaultSize(selectedShape, "", ctx);
    const newElement = {
      id: nextId++,
      type: selectedShape,
      x: 300,
      y: 100,
      color: shapeColor,
      w,
      h,
      rotation: 0,
    };
    if (selectedShape === "image") return;
    saveState([...elements, newElement], lines, designName);
  };

  const [fontFamily, setFontFamily] = useState("Arial");
  const handleAddText = () => {
  if (!canvasRef.current) return;
  const text = prompt("Enter text to add:");
  if (!text) return;
  const ctx = canvasRef.current.getContext("2d");
  ctx.font = `24px ${fontFamily}`;
  const { w, h, fontSize } = getDefaultSize("text", text, ctx);
  const newText = {
    id: nextId++,
    type: "text",
    text,
    x: 100,
    y: 100,
    color: textColor,
    w,
    h,
    fontSize,
    fontFamily, // <-- add this
    rotation: 0,
  };
  saveState([...elements, newText], lines, designName);
};


  const handleShapeColorChange = (e) => {
    setShapeColor(e.target.value);
    if (selectedIdx !== null) {
      const newElements = elements.map((el, idx) =>
        idx === selectedIdx ? { ...el, color: e.target.value } : el
      );
      saveState(newElements, lines, designName);
    }
  };

  const handleTextColorChange = (e) => {
    setTextColor(e.target.value);
    if (selectedIdx !== null && elements[selectedIdx]?.type === "text") {
      const newElements = elements.map((el, idx) =>
        idx === selectedIdx ? { ...el, color: e.target.value } : el
      );
      saveState(newElements, lines, designName);
    }
  };

  const handleUploadImage = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
      const newElement = {
        id: nextId++,
        type: "image",
        x: 50,
        y: 50,
        w: 200,
        h: 200,
        src: event.target.result,
        rotation: 0,
      };
      saveState([...elements, newElement], lines, designName);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const moveElement = (dir) => {
    if (selectedIdx === null) return;
    const newElements = [...elements];
    let idx = selectedIdx;
    if (dir === "up" && idx < newElements.length - 1) {
      [newElements[idx], newElements[idx + 1]] = [
        newElements[idx + 1],
        newElements[idx],
      ];
      setSelectedIdx(idx + 1);
    }
    if (dir === "down" && idx > 0) {
      [newElements[idx], newElements[idx - 1]] = [
        newElements[idx - 1],
        newElements[idx],
      ];
      setSelectedIdx(idx - 1);
    }
    saveState(newElements, lines, designName);
  };

  const clearCanvas = () => {
    setHistory([{ elements: [], lines: [], title: designName }]);
    setHistoryIndex(0);
    setSelectedIdx(null);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = designName.trim() || "canvas.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  

  const handleSaveToCloud = async () => {
  if (!canvasRef.current) return;

  // Get PNG data URL
  const imageDataURL = canvasRef.current.toDataURL("image/png");

  // 1. Upload thumbnail to Cloudinary
  let thumbnailCloudinaryUrl = '';
  try {
    const thumbRes = await fetch("http://localhost:5000/api/upload-thumbnail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ dataUrl: imageDataURL }),
    });
    const thumbData = await thumbRes.json();
    if (thumbRes.ok && thumbData.url) {
      thumbnailCloudinaryUrl = thumbData.url;
    } else {
      alert("Error uploading thumbnail to Cloudinary");
      return;
    }
  } catch (err) {
    alert("Failed to upload thumbnail to Cloudinary");
    return;
  }

  // 2. Save everything to MongoDB (including Cloudinary thumbnail URL)
  try {
    const response = await fetch("http://localhost:5000/api/designs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        thumbnailUrl: thumbnailCloudinaryUrl, // NEW: Now a Cloudinary-hosted URL
        title: designName.trim() || "Untitled Design",
        jsonData: {
          elements,
          lines,
        }
      }),
    });
    const data = await response.json();
    if (response.ok) {
      alert("Design saved and uploaded successfully!");
    } else {
      alert("Failed to upload design: " + (data.message || "Unknown error"));
    }
  } catch (error) {
    console.error("Error uploading design:", error);
    alert("Upload failed, please try again.");
  }
};


  const handleDeleteSelected = () => {
    if (selectedIdx !== null) {
      const newElements = elements.filter((_, idx) => idx !== selectedIdx);
      saveState(newElements, lines, designName);
      setSelectedIdx(null);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      
      <header className="flex justify-between items-center p-4 bg-gray-100 border-b">
        <div className="text-5xl font-bold" style={{ fontFamily: '"Kablammo", system-ui' }}>MATTY</div>
        <div className="flex gap-2" />
        <button className="text-gray-700 hover:underline" onClick={() => navigate('About')}>About Us</button>
      </header>

      <div className="p-2 bg-gray-100 flex items-center gap-4 border-b">
        <input
          className="border px-3 py-2 rounded font-medium text-lg flex-grow"
          placeholder="Enter design name"
          value={designName}
          onChange={(e) => {
            const newTitle = e.target.value;
            setDesignName(newTitle);
            saveState(elements, lines, newTitle);
          }}
        />
        
      </div>

      <div className="flex gap-4 p-2 bg-gray-50 border-b">
        <button onClick={clearCanvas}>Clear All</button>
        <button onClick={handleUndo} disabled={historyIndex === 0}>
          Undo
        </button>
        <button onClick={handleRedo} disabled={historyIndex === history.length - 1}>
          Redo
        </button>
        <button
          onClick={() => moveElement("up")}
          disabled={selectedIdx === null || selectedIdx >= elements.length - 1}
        >
          Move Up
        </button>
        <button
          onClick={() => moveElement("down")}
          disabled={selectedIdx === null || selectedIdx <= 0}
        >
          Move Down
        </button>
        <label className="ml-4 flex items-center gap-2">
          Rotation:
          <input
            type="range"
            min={0}
            max={360}
            value={selectedIdx !== null ? elements[selectedIdx].rotation || 0 : 0}
            onChange={(e) => {
              if (selectedIdx !== null) {
                const angle = Number(e.target.value);
                const newElements = elements.map((el, idx) =>
                  idx === selectedIdx ? { ...el, rotation: angle } : el
                );
                saveState(newElements, lines, designName);
              }
            }}
          />
          <span>{selectedIdx !== null ? elements[selectedIdx].rotation || 0 : 0}°</span>
        </label>
        {selectedIdx !== null && (
          <button
            className="px-3 py-1 bg-red-100 text-red-700 rounded border border-red-300"
            onClick={handleDeleteSelected}
          >
            Delete Selected
          </button>
        )}
      </div>

      <div className="flex flex-1">
        <aside className="flex flex-col gap-6 p-4 bg-gray-50 border-r min-w-[240px]">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-2">
            <h3 className="font-semibold text-lg mb-3 border-b pb-2">Drawing Tools</h3>
            <div className="flex gap-2 mb-3">
              <button
                className={`py-2 px-4 rounded ${
                  drawMode && !eraserMode ? "bg-blue-100 font-bold" : "bg-gray-100"
                }`}
                onClick={() => {
                  if (drawMode) setDrawMode(false);
                  else {
                    setDrawMode(true);
                    setEraserMode(false);
                  }
                }}
              >
                Pencil
              </button>
              <button
                className={`py-2 px-4 rounded ${
                  eraserMode ? "bg-blue-100 font-bold" : "bg-gray-100"
                }`}
                onClick={() => {
                  if (eraserMode) setEraserMode(false);
                  else {
                    setEraserMode(true);
                    setDrawMode(false);
                  }
                }}
              >
                Eraser
              </button>
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1">Pencil Color</label>
              <input
                type="color"
                value={pencilColor}
                onChange={(e) => setPencilColor(e.target.value)}
                className="w-8 h-8 p-0 border-0"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1">Brush Size</label>
              <input
                type="range"
                min={1}
                max={30}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-xs">{brushSize}px</span>
            </div>
            <div>
              <label className="block text-sm mb-1">Eraser Size</label>
              <input
                type="range"
                min={5}
                max={50}
                value={eraserSize}
                onChange={(e) => setEraserSize(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-xs">{eraserSize}px</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-2">
            <h3 className="font-semibold text-lg mb-3 border-b pb-2">Shapes</h3>
            <label className="block text-sm mb-1">Shape</label>
            <select
              className="mb-3 p-1 border rounded w-full"
              value={selectedShape}
              onChange={(e) => {
                setSelectedShape(e.target.value);
                setDrawMode(false);
                setEraserMode(false);
              }}
            >
              <option value="rectangle">Rectangle</option>
              <option value="square">Square</option>
              <option value="circle">Circle</option>
              <option value="oval">Oval</option>
              <option value="triangle">Triangle</option>
              <option value="parallelogram">Parallelogram</option>
              <option value="rhombus">Rhombus</option>
              <option value="trapezoid">Trapezoid</option>
              <option value="kite">Kite</option>
              <option value="pentagon">Pentagon</option>
              <option value="hexagon">Hexagon</option>
              <option value="heptagon">Heptagon</option>
              <option value="octagon">Octagon</option>
              <option value="nonagon">Nonagon</option>
              <option value="decagon">Decagon</option>
            </select>
            <label className="block text-sm mb-1">Shape Color</label>
            <input
              type="color"
              value={shapeColor}
              onChange={handleShapeColorChange}
              className="w-8 h-8 p-0 border-0"
            />
            <button
              className="w-full mt-3 py-2 rounded bg-gray-100 hover:bg-blue-50"
              onClick={handleAddShape}
            >
              Add Shape
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-2">
            <h3 className="font-semibold text-lg mb-3 border-b pb-2">Text</h3>
            
            <label className="block text-sm mt-2 mb-1">Text Font</label>
<select
  className="mb-3 p-1 border rounded w-full"
  value={fontFamily}
  onChange={e => {
    setFontFamily(e.target.value);
    if (selectedIdx !== null && elements[selectedIdx]?.type === "text") {
      const newElements = elements.map((el, idx) =>
        idx === selectedIdx ? { ...el, fontFamily: e.target.value } : el
      );
      saveState(newElements, lines, designName);
    }
  }}
>
  <option value="Arial">Arial</option>
  <option value="Times New Roman">Times New Roman</option>
  <option value="Georgia">Georgia</option>
  <option value="Courier New">Courier New</option>
  <option value="Comic Sans MS">Comic Sans MS</option>
  <option value="Verdana">Verdana</option>
  <option value="Trebuchet MS">Trebuchet MS</option>
  <option value="Lucida Console">Lucida Console</option>
  <option value="Impact">Impact</option>
  <option value="Tahoma">Tahoma</option>
  <option value="Palatino Linotype">Palatino Linotype</option>
  <option value="Garamond">Garamond</option>
  <option value="Brush Script MT">Brush Script MT</option>
  <option value="Helvetica">Helvetica</option>
  <option value="Futura">Futura</option>
  <option value="Gill Sans">Gill Sans</option>
  <option value="Rockwell">Rockwell</option>
  <option value="Franklin Gothic Medium">Franklin Gothic Medium</option>
  <option value="Copperplate">Copperplate</option>
  <option value="Optima">Optima</option>
</select>
<label className="block text-sm mb-1">Text Color</label>
            <input
              type="color"
              value={textColor}
              onChange={handleTextColorChange}
              className="w-8 h-8 p-0 border-0"
            />
            <button
              className="w-full mt-3 py-2 rounded bg-gray-100 hover:bg-blue-50"
              onClick={handleAddText}
            >
              Add Text
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <button
              className="w-full mb-2 py-2 rounded bg-gray-100 hover:bg-blue-50"
              onClick={handleUploadImage}
            >
              Upload Image
            </button>
            <button
              className="w-full mb-2 py-2 rounded bg-gray-100 hover:bg-blue-50"
              onClick={handleSaveToCloud}
            >
              Save to Cloud
            </button>
            <button
              className="w-full py-2 rounded bg-gray-100 hover:bg-blue-50"
              onClick={handleDownload}
            >
              Download
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </aside>

        <main className="flex-1 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={1000}
            height={700}
            style={{ background: "#fff", border: "1px solid #eee", marginTop: "-250px" }}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          />
        </main>
      </div>
    </div>
  );
};

export default CanvasEditor;
