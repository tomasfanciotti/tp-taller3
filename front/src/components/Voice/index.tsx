import React, { useState } from 'react';
import { useSpeechRecognition } from 'react-speech-kit';

const SpeechModal: React.FC<{ onSave: (text: string) => void; onCancel: () => void }> = ({ onSave, onCancel }) => {
  const [text, setText] = useState('');
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result: any) => {
      setText((prev) => {
        console.log('notice me');
        return prev + ' ' + result
      });
    },
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const toggleListening = () => {
    if (listening) {
      stop();
    } else {
      listen({interimResults: false, lang: 'es'});
    }
  };

  const handleSave = () => {
    if (listening) {
      stop();
    }
    onSave(text);
    setText('');
  };

  const handleClose = () => {
    if (listening) {
      stop();
    }
    setText('');
    onCancel();
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Speech Modal</h2>
        <div className="mb-4">
          <textarea
            className="w-full h-24 p-2 border rounded"
            value={text}
            onChange={handleInputChange}
            placeholder="Comience a hablar o use la entrada de voz..."
          />
        </div>
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={toggleListening}>
            {listening ? 'Detener Escucha' : 'Comenzar Escucha'}
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleSave}>Guardar</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={handleClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default SpeechModal;
