/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/components/DiagramSketchpad.tsx
"use client";

import Konva from "konva";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Layer, Line, Rect, Stage, Text } from "react-konva";

interface DiagramSketchpadProps {
  onImageGenerated: (imageFile: File | null) => void;
  isLoading?: boolean;
}

const DiagramSketchpad: React.FC<DiagramSketchpadProps> = ({
  onImageGenerated,
  isLoading,
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [lines, setLines] = useState<any[]>([]); // Para linhas de caneta
  const [rectangles, setRectangles] = useState<any[]>([]); // Para retângulos
  const [texts, setTexts] = useState<any[]>([]); // Para texto
  const [arrows, setArrows] = useState<any[]>([]); // Para setas

  const [tool, setTool] = useState<"pen" | "rectangle" | "text" | "arrow">(
    "pen"
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [_, setCurrentLine] = useState<number[]>([]); // Usado para desenho de linha contínua (pen)
  const [currentRectProps, setCurrentRectProps] = useState<any>(null); // Propriedades do retângulo em desenho
  const [currentArrowPoints, setCurrentArrowPoints] = useState<number[]>([]); // Pontos da seta em desenho

  const width = 600;
  const height = 400;

  // Função para gerar a imagem do stage Konva
  const generateImage = useCallback(() => {
    const stage = stageRef.current;
    if (stage) {
      const dataURL = stage.toDataURL({
        mimeType: "image/png",
        quality: 1,
        pixelRatio: 2, // Melhor qualidade para análise da IA
      });

      // Converte Data URL para File
      fetch(dataURL)
        .then((res) => res.blob())
        .then((blob) => {
          const imageFile = new File([blob], "sketchpad_diagram.png", {
            type: "image/png",
            lastModified: Date.now(),
          });
          onImageGenerated(imageFile);
        });
    } else {
      onImageGenerated(null);
    }
  }, [onImageGenerated]);

  // Efeito para gerar a imagem automaticamente sempre que o desenho muda
  useEffect(() => {
    // Adicione um pequeno delay para evitar muitas chamadas seguidas
    const timeout = setTimeout(() => {
      if (!isDrawing) {
        // Só gera a imagem quando o desenho está finalizado (não contínuo)
        generateImage();
      }
    }, 300); // Ajuste este valor conforme necessário

    return () => clearTimeout(timeout);
  }, [lines, rectangles, texts, arrows, isDrawing, generateImage]);

  const handleMouseDown = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    if (isLoading) return;

    setIsDrawing(true);
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    if (tool === "pen") {
      setCurrentLine([pos.x, pos.y]);
      setLines((prevLines) => [
        ...prevLines,
        { points: [pos.x, pos.y], stroke: "#FFFFFF", strokeWidth: 3 },
      ]);
    } else if (tool === "rectangle") {
      setCurrentRectProps({
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        stroke: "#FFFFFF",
        strokeWidth: 3,
      });
    } else if (tool === "text") {
      const textInput = prompt("Digite o texto:");
      if (textInput) {
        setTexts((prevTexts) => [
          ...prevTexts,
          {
            x: pos.x,
            y: pos.y,
            text: textInput,
            fill: "#FFFFFF",
            fontSize: 14,
          },
        ]);
      }
      setIsDrawing(false); // Texto é um clique único
    } else if (tool === "arrow") {
      setCurrentArrowPoints([pos.x, pos.y, pos.x, pos.y]); // [x1, y1, x2, y2]
    }
  };

  const handleMouseMove = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    if (!isDrawing || isLoading) return;

    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;

    if (tool === "pen") {
      const lastLine = lines[lines.length - 1];
      if (!lastLine) return;
      // Adiciona o novo ponto à linha existente
      lastLine.points = lastLine.points.concat([pos.x, pos.y]);
      setLines([...lines.slice(0, lines.length - 1), lastLine]);
    } else if (tool === "rectangle" && currentRectProps) {
      setCurrentRectProps((prev: any) => ({
        ...prev,
        width: pos.x - prev.x,
        height: pos.y - prev.y,
      }));
    } else if (tool === "arrow" && currentArrowPoints.length === 4) {
      setCurrentArrowPoints([
        currentArrowPoints[0],
        currentArrowPoints[1],
        pos.x,
        pos.y,
      ]);
    }
  };

  const handleMouseUp = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    if (isLoading) return;

    setIsDrawing(false);
    if (tool === "rectangle" && currentRectProps) {
      setRectangles((prevRects) => [...prevRects, currentRectProps]);
      setCurrentRectProps(null);
    } else if (tool === "arrow" && currentArrowPoints.length === 4) {
      setArrows((prevArrows) => [
        ...prevArrows,
        { points: currentArrowPoints, stroke: "#FFFFFF", strokeWidth: 3 },
      ]);
      setCurrentArrowPoints([]);
    }
    generateImage(); // Gerar imagem final após soltar o mouse (para retângulos e setas)
  };

  const clearCanvas = useCallback(() => {
    setLines([]);
    setRectangles([]);
    setTexts([]);
    setArrows([]);
    setCurrentLine([]);
    setCurrentRectProps(null);
    setCurrentArrowPoints([]);
    onImageGenerated(null); // Limpa a imagem gerada também
  }, [onImageGenerated]);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-700/40 rounded-lg border border-gray-600">
      <h3 className="text-xl font-bold text-teal-300 mb-4">
        Seu Rabiscador de Segurança 😈
      </h3>
      <div className="flex space-x-4 mb-4 flex-wrap justify-center">
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
      <Stage
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // Tratamento para quando o mouse sai do canvas
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        onTouchCancel={handleMouseUp}
        ref={stageRef}
        className="border-2 border-teal-500 bg-gray-800 rounded-md cursor-crosshair touch-none"
      >
        <Layer>
          {/* Desenhos de caneta */}
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.stroke}
              strokeWidth={line.strokeWidth}
              lineCap="round"
              lineJoin="round"
            />
          ))}
          {/* Retângulo em desenho */}
          {currentRectProps && (
            <Rect
              x={currentRectProps.x}
              y={currentRectProps.y}
              width={currentRectProps.width}
              height={currentRectProps.height}
              stroke={currentRectProps.stroke}
              strokeWidth={currentRectProps.strokeWidth}
            />
          )}
          {/* Retângulos finalizados */}
          {rectangles.map((rect, i) => (
            <Rect
              key={i}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              stroke={rect.stroke}
              strokeWidth={rect.strokeWidth}
            />
          ))}
          {/* Textos */}
          {texts.map((textProps, i) => (
            <Text
              key={i}
              x={textProps.x}
              y={textProps.y}
              text={textProps.text}
              fill={textProps.fill}
              fontSize={textProps.fontSize}
            />
          ))}
          {/* Seta em desenho (mostra a linha antes da ponta) */}
          {tool === "arrow" && currentArrowPoints.length === 4 && (
            <Line
              points={currentArrowPoints}
              stroke="#FFFFFF"
              strokeWidth={3}
            />
          )}
          {/* Setas finalizadas */}
          {arrows.map((arrow, i) => (
            <React.Fragment key={i}>
              <Line
                points={arrow.points}
                stroke={arrow.stroke}
                strokeWidth={arrow.strokeWidth}
              />
              {/* Ponta da seta - desenhada via Konva.Line com pontos específicos */}
              <Line
                points={[
                  arrow.points[2],
                  arrow.points[3], // ponto final
                  arrow.points[2] -
                    10 *
                      Math.cos(
                        Math.atan2(
                          arrow.points[3] - arrow.points[1],
                          arrow.points[2] - arrow.points[0]
                        ) -
                          Math.PI / 6
                      ),
                  arrow.points[3] -
                    10 *
                      Math.sin(
                        Math.atan2(
                          arrow.points[3] - arrow.points[1],
                          arrow.points[2] - arrow.points[0]
                        ) -
                          Math.PI / 6
                      ),
                  arrow.points[2],
                  arrow.points[3],
                  arrow.points[2] -
                    10 *
                      Math.cos(
                        Math.atan2(
                          arrow.points[3] - arrow.points[1],
                          arrow.points[2] - arrow.points[0]
                        ) +
                          Math.PI / 6
                      ),
                  arrow.points[3] -
                    10 *
                      Math.sin(
                        Math.atan2(
                          arrow.points[3] - arrow.points[1],
                          arrow.points[2] - arrow.points[0]
                        ) +
                          Math.PI / 6
                      ),
                ]}
                stroke={arrow.stroke}
                strokeWidth={arrow.strokeWidth}
                lineCap="round"
                lineJoin="round"
              />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default DiagramSketchpad;
