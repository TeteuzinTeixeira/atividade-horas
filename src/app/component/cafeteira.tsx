"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import CafeteiraImg from "./../../../public/Cafeteira.png";
import "./../globals.css";

export default function Cafeteira({ luminosidade }) {
  const [cafePronto, setCafePronto] = useState(false);
  const [fazendoCafe, setFazendoCafe] = useState(false);
  const audioRef = useRef(null);
  const wasPlayingRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/cafeteira.mp3");
    audioRef.current.loop = true;
  }, []);

  useEffect(() => {
    if (luminosidade === null) return;

    const cafeteiraLigando = luminosidade > 1000;

    if (cafeteiraLigando && !wasPlayingRef.current) {
      setFazendoCafe(true);
      audioRef.current?.play().catch((e) => {
        console.warn("🔇 Som bloqueado até interação do usuário.");
      });
      wasPlayingRef.current = true;

      timerRef.current = setTimeout(() => {
        audioRef.current?.pause();
        audioRef.current.currentTime = 0;
        wasPlayingRef.current = false;
        setFazendoCafe(false);
        setCafePronto(true);
      }, 30000);
    }

    if (!cafeteiraLigando && wasPlayingRef.current) {
      setFazendoCafe(false);
      audioRef.current?.pause();
      audioRef.current.currentTime = 0;
      wasPlayingRef.current = false;
      clearTimeout(timerRef.current);
      setCafePronto(false);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      wasPlayingRef.current = false;
    };
  }, [luminosidade]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Cafeteira
      </h2>
      <Image
        src={CafeteiraImg}
        alt="Imagem da Cafeteira"
        className="w-64 h-auto mb-4"
      />
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Luminosidade:{" "}
        {luminosidade !== null ? `${luminosidade}` : "Carregando..."}
      </p>
      <p
        className={`text-lg font-semibold mt-2 ${cafePronto ? "text-green-500" : "text-red-500"}`}
      >
        {fazendoCafe ? (
          <span className="text-yellow-500">Fazendo café...</span>
        ) : cafePronto ? (
          "Café Pronto!"
        ) : (
          "Cafeteira desligada"
        )}
      </p>
    </div>
  );
}
