// src/app/components/DiagramSketchpad.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

interface DiagramSketchpadProps {
  onImageGenerated: (imageFile: File | null) => void;
  isLoading?: boolean;
}

const DiagramSketchpad: React.FC<DiagramSketchpadProps> = ({
  onImageGenerated,
  isLoading,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const [tool, setTool] = useState<"pen" | "rectangle" | "text" | "arrow">(
    "pen"
  );
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  // Efeito para configurar o contexto do canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#FFFFFF"; // Cor branca para o desenho
        ctx.fillStyle = "#FFFFFF"; // Cor branca para o texto
        ctx.font = "14px sans-serif"; // Tamanho da fonte para o texto
        setContext(ctx);
      }
    }
  }, []);

  const getCanvasCoordinates = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;

      if ("touches" in event) {
        // Verifica se o array touches existe e tem pelo menos um elemento
        clientX = event.touches?.[0]?.clientX;
        clientY = event.touches?.[0]?.clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    },
    []
  );

  // Definindo generateImage antes de startDrawing e stopDrawing
  const generateImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          const imageFile = new File([blob], "sketchpad_diagram.png", {
            type: "image/png",
            lastModified: Date.now(),
          });
          onImageGenerated(imageFile);
        }
      }, "image/png");
    }
  }, [onImageGenerated]);

  const drawArrowhead = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      fromX: number,
      fromY: number
    ) => {
      const headlen = 10; // Comprimento da ponta da seta
      const angle = Math.atan2(y - fromY, x - fromX);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(
        x - headlen * Math.cos(angle - Math.PI / 6),
        y - headlen * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(x, y);
      ctx.lineTo(
        x - headlen * Math.cos(angle + Math.PI / 6),
        y - headlen * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    },
    []
  ); // Sem dependências, pois só usa argumentos

  const startDrawing = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (!context) return;
      const coords = getCanvasCoordinates(event);
      setStartPoint(coords);
      setIsDrawing(true);

      if (tool === "pen") {
        context.beginPath();
        context.moveTo(coords.x, coords.y);
      } else if (tool === "text") {
        const text = prompt("Digite o texto:");
        if (text) {
          context.fillText(text, coords.x, coords.y);
          generateImage(); // Atualiza a imagem após adicionar texto
        }
        setIsDrawing(false); // Para de "desenhar" imediatamente após o texto
      } else if (tool === "arrow") {
        context.beginPath();
        context.moveTo(coords.x, coords.y);
      }
    },
    [context, getCanvasCoordinates, tool, generateImage]
  ); // Adicionado generateImage aqui

  const draw = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing || !context || tool !== "pen") return;
      const coords = getCanvasCoordinates(event);
      context.lineTo(coords.x, coords.y);
      context.stroke();
    },
    [isDrawing, context, getCanvasCoordinates, tool]
  );

  const stopDrawing = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (!context || !startPoint || !isDrawing) return;
      setIsDrawing(false);

      const endPoint = getCanvasCoordinates(event);

      if (tool === "rectangle") {
        const width = endPoint.x - startPoint.x;
        const height = endPoint.y - startPoint.y;
        context.strokeRect(startPoint.x, startPoint.y, width, height);
        generateImage(); // Atualiza a imagem
      } else if (tool === "arrow") {
        context.lineTo(endPoint.x, endPoint.y);
        context.stroke();
        drawArrowhead(
          context,
          endPoint.x,
          endPoint.y,
          startPoint.x,
          startPoint.y
        );
        generateImage(); // Atualiza a imagem
      }
      setStartPoint(null);
    },
    [
      context,
      getCanvasCoordinates,
      startPoint,
      tool,
      generateImage,
      isDrawing,
      drawArrowhead,
    ]
  ); // Adicionado generateImage e drawArrowhead aqui

  const clearCanvas = useCallback(() => {
    if (context && canvasRef.current) {
      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      onImageGenerated(null); // Limpa a imagem gerada também
    }
  }, [context, onImageGenerated]);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-700/40 rounded-lg border border-gray-600">
      <h3 className="text-xl font-bold text-teal-300 mb-4">
        Seu Rabiscador de Segurança 😈
      </h3>
      <div className="flex space-x-4 mb-4 flex-wrap justify-center">
        {" "}
        {/* Adicionado flex-wrap e justify-center */}
        <button
          onClick={() => setTool("pen")}
          className={`py-2 px-4 rounded-md font-semibold ${
            tool === "pen"
              ? "bg-teal-600 text-white"
              : "bg-gray-600 text-gray-200 hover:bg-teal-500"
          } mb-2`}
          disabled={isLoading}
        >
          Caneta 🖊️
        </button>
        <button
          onClick={() => setTool("rectangle")}
          className={`py-2 px-4 rounded-md font-semibold ${
            tool === "rectangle"
              ? "bg-teal-600 text-white"
              : "bg-gray-600 text-gray-200 hover:bg-teal-500"
          } mb-2`}
          disabled={isLoading}
        >
          Retângulo ⬛
        </button>
        <button
          onClick={() => setTool("text")}
          className={`py-2 px-4 rounded-md font-semibold ${
            tool === "text"
              ? "bg-teal-600 text-white"
              : "bg-gray-600 text-gray-200 hover:bg-teal-500"
          } mb-2`}
          disabled={isLoading}
        >
          Texto <span aria-hidden="true">T</span>
        </button>
        <button
          onClick={() => setTool("arrow")}
          className={`py-2 px-4 rounded-md font-semibold ${
            tool === "arrow"
              ? "bg-teal-600 text-white"
              : "bg-gray-600 text-gray-200 hover:bg-teal-500"
          } mb-2`}
          disabled={isLoading}
        >
          Seta <span aria-hidden="true">→</span>
        </button>
        <button
          onClick={clearCanvas}
          className="py-2 px-4 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors duration-200 mb-2"
          disabled={isLoading}
        >
          Limpar 🗑️
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="border-2 border-teal-500 bg-gray-800 rounded-md cursor-crosshair touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onTouchCancel={stopDrawing}
        style={{ touchAction: "none" }}
      />
    </div>
  );
};

export default DiagramSketchpad;
