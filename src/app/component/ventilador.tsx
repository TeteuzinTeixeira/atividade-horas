import Image from "next/image";
import VentiladorImg from "./../../../public/ventilador.png";
import { useEffect, useState } from "react";

export default function Ventilador({ temperatura }) {
  const [ventiladorLigado, setVentiladorLigado] = useState(false);

  useEffect(() => {
    if (temperatura === null) return;

    const ventiladorLigando = temperatura > 25;

    if (ventiladorLigando) {
      setVentiladorLigado(true);
    } else {
      setVentiladorLigado(false);
    }
  }, [temperatura]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Ventilador
      </h2>
      <Image
        src={VentiladorImg}
        alt="Imagem do ventilador"
        className={`w-64 h-auto mb-4 ${ventiladorLigado ? "animate-spin" : ""}`}
      />
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Temperatura: {temperatura !== null ? `${temperatura}` : "Carregando..."}
      </p>
      <p
        className={`text-lg font-semibold mt-2 ${temperatura ? "text-green-500" : "text-red-500"}`}
      >
        {ventiladorLigado ? "Ventilador ligado" : "Temperatura fresca"}
      </p>
    </div>
  );
}
