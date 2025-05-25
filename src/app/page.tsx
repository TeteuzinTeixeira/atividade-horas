"use client";

import { useEffect, useState } from "react";
import Ventilador from "./component/ventilador";
import Varal from "./component/varal";
import Cofre from "./component/cofre";
import Lampada from "./component/lampada";
import Cafeteira from "./component/cafeteira";
import mqtt from "mqtt";

export default function MainPage() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null,
  );
  const [luminosidade, setLuminosidade] = useState<number | null>(null);
  const [temperatura, setTemperatura] = useState<number | null>(null);
  const [umidade, setUmidade] = useState<number | null>(null);
  const [movimento, setMovimento] = useState<boolean>(false);
  const [aproximacao, setAproximacao] = useState(null);

  useEffect(() => {
    const clientId = `web-client-${Math.random().toString(16).substr(2, 8)}`;
    const host = "wss://mqtt.flespi.io:443";
    const topic = "topic/mateusTeixeira";

    const options = {
      clientId,
      username:
        "FlespiToken lXXvQYumvLgFmaRCiJgBwbhaAmIXjpWa0axMTw4OgWkA1RyfKlFeVbMmTLsnML5Q",
      password: "",
      clean: true,
      reconnectPeriod: 1000,
    };

    const client = mqtt.connect(host, options);

    client.on("connect", () => {
      console.log("✅ Conectado ao MQTT");
      client.subscribe(topic, (err) => {
        if (err) {
          console.error("❌ Erro ao se inscrever no tópico:", err);
        } else {
          console.log(`📡 Inscrito no tópico: ${topic}`);
        }
      });
    });

    client.on("message", (receivedTopic, message) => {
      const messageStr = message.toString();
      try {
        console.log(messageStr, "Mensagem recebida no tópico:", receivedTopic);
        const json = JSON.parse(messageStr);
        setLuminosidade(json.luminosidade);
        setTemperatura(json.temperatura);
        setUmidade(json.umidade);
        setMovimento(json.movimento === 1 ? true : false);
        setAproximacao(json.proximidade);
      } catch (err) {
        console.error("❌ Erro ao parsear JSON MQTT:", err);
      }
    });

    client.on("error", (err) => {
      console.error("❌ Erro MQTT:", err);
    });

    return () => {
      client.end();
    };
  }, [luminosidade, temperatura, umidade, movimento, aproximacao]);

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Cafeteira":
        return <Cafeteira luminosidade={luminosidade} />;
      case "Ventilador":
        return <Ventilador temperatura={temperatura} />;
      case "Varal":
        return <Varal umidade={umidade} />;
      case "Cofre":
        return <Cofre aproximacao={aproximacao} />;
      case "Lampada":
        return <Lampada movimento={movimento} />;
      default:
        return (
          <p className="text-gray-600 dark:text-gray-300">
            Selecione um item para exibir.
          </p>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Controle de Dispositivos
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => setSelectedComponent("Cafeteira")}
          className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition"
        >
          Cafeteira <br /> Iluminosidade
        </button>
        <button
          onClick={() => setSelectedComponent("Ventilador")}
          className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Ventilador <br /> Temperatura
        </button>
        <button
          onClick={() => setSelectedComponent("Varal")}
          className="bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-yellow-600 transition"
        >
          Varal <br /> Umidade
        </button>
        <button
          onClick={() => setSelectedComponent("Cofre")}
          className="bg-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-purple-600 transition"
        >
          Cofre <br /> Proximidade
        </button>
        <button
          onClick={() => setSelectedComponent("Lampada")}
          className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-red-600 transition"
        >
          Lâmpada <br /> Movimento
        </button>
      </div>
      <div className="w-full max-w-4xl p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
        {renderComponent()}
      </div>
    </div>
  );
}
