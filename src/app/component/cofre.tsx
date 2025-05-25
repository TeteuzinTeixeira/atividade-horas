import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import CofreImg from "./../../../public/cofre.png";
import AlarmeImg from "./../../../public/alarme-cofre.jpeg";

export default function Cofre({ aproximacao }) {
  const [pessoaProxima, setPessoaProxima] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wasPlayingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/alert.mp3");
    audioRef.current.loop = true;
  }, []);

  useEffect(() => {
    if (aproximacao === null) return;
    console.log(aproximacao, "Aproximação");
    const alarmeLigando = aproximacao < 80;

    if (alarmeLigando && !wasPlayingRef.current) {
      setPessoaProxima(true);
      audioRef.current?.play().catch((e) => {
        console.warn("🔇 Som bloqueado até interação do usuário.");
      });
      wasPlayingRef.current = true;
    } else if (!alarmeLigando && wasPlayingRef.current) {
      setPessoaProxima(false);
      audioRef.current?.pause();
      audioRef.current.currentTime = 0;
      wasPlayingRef.current = false;
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [aproximacao]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Cofre
      </h2>
      {!pessoaProxima ? (
        <Image
          src={CofreImg}
          alt="Imagem da lampada ligada"
          className={`w-52 h-auto mb-4`}
        />
      ) : (
        <Image
          src={AlarmeImg}
          alt="Imagem da lampada apagada"
          className="w-52 h-auto mb-4"
        />
      )}
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Aproximação:{" "}
        {aproximacao !== null
          ? aproximacao < 80
            ? "Sim"
            : "Não"
          : "Carregando..."}
      </p>
      <p
        className={`text-lg font-semibold mt-2 ${aproximacao ? "text-green-500" : "text-red-500"}`}
      >
        {pessoaProxima
          ? "ALERTA! Esse cofre está sendo monitorado pela CarSystem"
          : "Ninguem proximo"}
      </p>
    </div>
  );
}
