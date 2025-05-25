import { useEffect, useState } from "react";
import Image from "next/image";
import varalImg from "./../../../public/varal.png";
import varalSemRoupaImg from "./../../../public/varal-sem-roupa.png";

export default function Varal({ umidade }) {
  const [varalRecolhido, setVaralRecolhido] = useState(false);

  useEffect(() => {
    if (umidade === null) return;

    const varalRecolhendo = umidade > 70;

    if (varalRecolhendo) {
      setVaralRecolhido(true);
    } else {
      setVaralRecolhido(false);
    }
  }, [umidade]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Varal
      </h2>
      {!varalRecolhido ? (
        <Image
          src={varalImg}
          alt="Imagem do varal com roupa"
          className={`w-64 h-auto mb-4`}
        />
      ) : (
        <Image
          src={varalSemRoupaImg}
          alt="Imagem do varal sem roupa"
          className="w-64 h-auto mb-4"
        />
      )}
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Umidade: {umidade !== null ? `${umidade}` : "Carregando..."}
      </p>
      <p
        className={`text-lg font-semibold mt-2 ${umidade ? "text-green-500" : "text-red-500"}`}
      >
        {varalRecolhido ? "Roupa recolhida" : "será que ai vem agua?"}
      </p>
    </div>
  );
}
