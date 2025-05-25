'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import mqtt from 'mqtt';
import Cafeteira from "./../../public/Cafeteira.png";

export default function Home() {
  const [luminosidade, setLuminosidade] = useState(null);
  const [cafePronto, setCafePronto] = useState(false);
  const audioRef = useRef(null);
  const wasPlayingRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/sounds/cafeteira.mp3');
    audioRef.current.loop = true;
  }, []);

  useEffect(() => {
    if (luminosidade === null) return;

    const cafeteiraLigando = luminosidade < 500;

    if (cafeteiraLigando && !wasPlayingRef.current) {
      audioRef.current.play().catch((e) => {
        console.warn("🔇 Som bloqueado até interação do usuário.");
      });
      wasPlayingRef.current = true;
      
      timerRef.current = setTimeout(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        wasPlayingRef.current = false;
        setCafePronto(true);
      }, 30000);
    }

    if (!cafeteiraLigando && wasPlayingRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      wasPlayingRef.current = false;
      clearTimeout(timerRef.current);
      setCafePronto(false);
    }
  }, [luminosidade]);

  /*
  ventilador: temperatura
  varal: umidade
  cafeteira: luminosidade
  cofre: proximidade
  lampada: movimento
  */

  useEffect(() => {
    const clientId = `web-client-${Math.random().toString(16).substr(2, 8)}`;
    const host = "wss://mqtt.flespi.io:443";
    const topic = "topic/mateusTeixeira";

    const options = {
      clientId,
      username: "FlespiToken lXXvQYumvLgFmaRCiJgBwbhaAmIXjpWa0axMTw4OgWkA1RyfKlFeVbMmTLsnML5Q",
      password: "",
      clean: true,
      reconnectPeriod: 1000,
    };

    const client = mqtt.connect(host, options);

    client.on('connect', () => {
      console.log('✅ Conectado ao MQTT');
      client.subscribe(topic, (err) => {
        if (err) {
          console.error('❌ Erro ao se inscrever no tópico:', err);
        } else {
          console.log(`📡 Inscrito no tópico: ${topic}`);
        }
      });
    });

    client.on('message', (receivedTopic, message) => {
      const messageStr = message.toString();
      try {
        const json = JSON.parse(messageStr);
        if (json.luminosidade !== undefined) {
          setLuminosidade(json.luminosidade);
        }
      } catch (err) {
        console.error("❌ Erro ao parsear JSON MQTT:", err);
      }
    });

    client.on('error', (err) => {
      console.error('❌ Erro MQTT:', err);
    });

    return () => {
      client.end();
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="main-container">
      {luminosidade !== null ? (
        cafePronto ? (
          <h2>☕ Café pronto!</h2>
        ) : luminosidade < 500 ? (
          <>
            <h2>Cafeteira ligando!</h2>
            <h2>Preparando café</h2>
          </>
        ) : (
          <h2>Cafeteira!</h2>
        )
      ) : (
        <h2>Cafeteira!</h2>
      )}
      <Image src={Cafeteira} alt="Cafeteira" className='img-cafeteira' />
    </div>
  );
}
