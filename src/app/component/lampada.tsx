import { useEffect, useState } from "react";
import Image from "next/image";
import LampadaOnImg from "./../../../public/lampada-on.png";
import LampadaOffImg from "./../../../public/lampada-off.png";

export default function Lampada({ movimento }) {
  const [lampadaLigada, setLampadaLigada] = useState(false);

  useEffect(() => {
    if (movimento === null) return;
    const lampadaOn = movimento == 1;

    if (lampadaOn) {
      setLampadaLigada(true);
    } else {
      setLampadaLigada(false);
    }
  }, [movimento]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Lampada
      </h2>
      {lampadaLigada ? (
        <Image
          src={LampadaOnImg}
          alt="Imagem da lampada ligada"
          className={`w-52 h-auto mb-4`}
        />
      ) : (
        <Image
          src={LampadaOffImg}
          alt="Imagem da lampada apagada"
          className="w-28 h-auto mb-4"
        />
      )}
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Movimento:{" "}
        {movimento !== null ? (movimento ? "Sim" : "Não") : "Carregando..."}
      </p>
      <p
        className={`text-lg font-semibold mt-2 ${movimento ? "text-green-500" : "text-red-500"}`}
      >
        {lampadaLigada ? "Lampada ligada" : "Ta escuro"}
      </p>
    </div>
  );
}
