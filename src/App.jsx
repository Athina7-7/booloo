import { useState, useEffect } from "react";
import "./App.css";

const RESPUESTAS = [
  // Positivas
  "Sí, definitivamente.",
  "Sin duda.",
  "Puedes confiar en ello.",
  "Mis fuentes dicen que sí.",
  "Todo apunta a que sí.",
  "Es muy probable.",
  "Claro que sí.",
  "Definitivamente va a pasar.",
  // Negativas
  "No cuentes con ello.",
  "Mis fuentes dicen que no.",
  "No parece buena idea.",
  "Muy poco probable.",
  "No va a pasar.",
  "Lo dudo mucho.",
  "Definitivamente no.",
  // Neutras
  "Pregunta de nuevo más tarde.",
  "Mejor no te lo digo ahora.",
  "Concéntrate y vuelve a preguntar.",
  "No estoy seguro, intenta otra vez.",
  "La respuesta es incierta por ahora.",
  "Aún no puedo predecirlo.",
  "Necesito más información.",
  "Mmm… no sé… ¿y si preguntas algo más inteligente?",
  "Vuelve a intentarlo, estaba bostezando.",
  "Ni idea. Estoy en modo ahorro de energía.",
  "Pregunta otra vez, pero con ganas.",
  "No veo el futuro… apenas sobrevivo al presente.",
  "Aún no puedo predecirlo… mi WiFi mental está lento.",
  "Pregunta luego, estoy ocupado juzgándote.",
  "Sí, carajo, obvio que sí.",
  "Sin duda… hasta tú podrías entenderlo.",
  "Puedes confiar en ello, aunque tú confías en pura tontería.",
  "Mis fuentes dicen que sí… no sé cómo, pero sí.",
  "Todo apunta a que sí, sorprendentemente.",
  "Es muy probable… hasta tú tienes suerte a veces.",
  "Claro que sí, deja de joder.",
  "Definitivamente va a pasar, ya deja el drama.",

  // Negativas Groseras
  "No cuentes con ello, campeón de las malas decisiones.",
  "Mis fuentes dicen que no… igual que todo en tu vida.",
  "No parece buena idea, pero tú decides embarrarla.",
  "Muy poco probable… y eso siendo generoso.",
  "No va a pasar… ni rezando.",
  "Lo dudo mucho… muchísimo.",
  "Definitivamente no… deja de insistir, por Dios.",

  // Neutras Groseras
  "Pregunta de nuevo más tarde, estoy ocupado ignorándote.",
  "Mejor no te lo digo ahora, no quiero verte llorar.",
  "Concéntrate y vuelve a preguntar… si puedes.",
  "No estoy seguro, intenta otra vez… y hazlo bien esta vez.",
  "La respuesta es incierta… como tu vida amorosa.",
  "Aún no puedo predecirlo… estoy cansado de ti.",
  "Necesito más información… que no esté mal explicada, gracias.",
  "Mmm… no sé… ¿y si preguntas algo que no dé pena?",
  "Vuelve a intentarlo, me quedé dormido del aburrimiento.",
  "Ni idea. Estoy en modo avión por tu culpa.",
  "Pregunta otra vez, pero esta vez sin flojera mental.",
  "No veo el futuro… apenas te soporto.",
  "Aún no puedo predecirlo… mi paciencia se acabó primero.",
  "Pregunta luego, estoy ocupado burlándome de tus decisiones.",
];

function App() {
  const [isListening, setIsListening] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");

  const getRandomResponse = () => {
    const index = Math.floor(Math.random() * RESPUESTAS.length);
    return RESPUESTAS[index];
  };

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      console.log("Speech Recognition no soportado");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = "es-ES";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);
      
      // Activar sacudida
      setIsShaking(true);
      
      // Después de 1.5s, mostrar respuesta
      setTimeout(() => {
        setIsShaking(false);
        setResponse(getRandomResponse());
      }, 1500);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.abort();
    };
  }, [isListening]);

  const handleBallClick = () => {
    // No permitir click si está en proceso
    if (isListening || isShaking) return;
    
    // Si hay respuesta, limpiar y volver al estado inicial
    if (response) {
      setResponse("");
      setTranscript("");
      return;
    }
    
    setTranscript("");
    setIsListening(true);
  };

  const getContainerClass = () => {
    if (isListening) return "ball-container listening";
    if (isShaking) return "ball-container shaking";
    return "ball-container";
  };

  return (
    <div className="app">
      <div className="stars"></div>
      <div className="stars2"></div>
      
      <h1 className="title">
        <span className="magic">Booloo</span>
      </h1>
      <p className="subtitle">Haz tu pregunta a Bola 8</p>

      <div className={getContainerClass()}>
        <div className="ball" onClick={handleBallClick}>
          <div className="ball-shine"></div>
          <div className="eight-circle">
            {isListening ? (
              <div className="mic-indicator">
                <svg className="mic-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="11" rx="3"></rect>
                  <path d="M5 10a7 7 0 0 0 14 0"></path>
                  <line x1="12" y1="19" x2="12" y2="22"></line>
                </svg>
                <div className="pulse-ring"></div>
              </div>
            ) : isShaking ? (
              <div className="thinking">
                <span>...</span>
              </div>
            ) : response ? (
              <div className="triangle">
                <span className="response-text">{response}</span>
              </div>
            ) : (
              <span className="eight">8</span>
            )}
          </div>
        </div>
        <div className="ball-shadow"></div>
      </div>

      {transcript && (
        <p className="transcript">"{transcript}"</p>
      )}

      <p className="hint">
        {response ? "Toca la bola para preguntar de nuevo" : "Toca la bola y habla"}
      </p>
    </div>
  );
}

export default App;
