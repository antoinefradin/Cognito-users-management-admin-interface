import React from 'react';
import { PiSmileyXEyesFill } from 'react-icons/pi';

const ErrorFallback: React.FC = () => {
  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-aws-paper">
      <div className="flex text-5xl font-bold">
        <PiSmileyXEyesFill />
        ERROR
      </div>
      <div className="mt-4 text-lg">Une erreur inattendue s'est produite</div>
      <button
        className="underline"
        onClick={() => (window.location.href = '/')}>
        Retourner à l'accueil
      </button>
    </div>
  );
};

export default ErrorFallback;
