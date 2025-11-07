import  { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { colors, eyesOptions, mouthOptions } from "../../utils/avatarOptions";

const AvatarCustomizer = () => {



  const [colorIndex, setColorIndex] = useState(0);
  const [eyesIndex, setEyesIndex] = useState(0);
  const [mouthIndex, setMouthIndex] = useState(0);

  // Variables derivadas
  const bodyColor = colors[colorIndex];
  const eyes = eyesOptions[eyesIndex];
  const mouth = mouthOptions[mouthIndex];

  // Generar avatar aleatorio
  const randomizeAvatar = () => {
    setColorIndex(Math.floor(Math.random() * colors.length));
    setEyesIndex(Math.floor(Math.random() * eyesOptions.length));
    setMouthIndex(Math.floor(Math.random() * mouthOptions.length));
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-6 border-2 border-[#B6A8CA] rounded-2xl shadow-lg w-80 bg-[#F7F2F6]">
      

      <button
          onClick={randomizeAvatar}
          className="right-4 top-6 absolute rounded-lg shadow-md cursor-pointer"
        >
          🎲
        </button>
      <div className="flex items-center justify-center mb-4 w-full pt-5">
        {/* Flecha izquierda: cambia expresión (ojos + boca) hacia atrás */}
        <div className="flex flex-col gap-2">
          {/* ojos */}
          <button
            onClick={() => {
              setEyesIndex((eyesIndex - 1 + eyesOptions.length) % eyesOptions.length);

            }}
            className="p-2  rounded-lg text-black"
          >
            <ChevronLeft size={22} />
          </button>
          {/* boca */}
          <button
            onClick={() => {

              setMouthIndex((mouthIndex - 1 + mouthOptions.length) % mouthOptions.length);
            }}
            className="p-2  rounded-lg text-black"
          >
            <ChevronLeft size={22} />
          </button>
          {/* color */}
          <button
            onClick={() =>
              setColorIndex((colorIndex - 1 + colors.length) % colors.length)
            }
            className="p-2  rounded-lg text-black"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Vista previa del personaje */}
        <motion.div
          key={`${colorIndex}-${eyesIndex}-${mouthIndex}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex flex-col items-center justify-center border border-black p-4 rounded-lg mx-3"
          style={{
            backgroundColor: bodyColor,
            imageRendering: "pixelated",
            width: "96px",
            height: "96px",
          }}
        >
          {/* Ojos y boca */}
          <div className="flex justify-between w-full text-2xl leading-none font-mono">
            <span>{eyes[0]}</span>
            <span>{eyes[1]}</span>
          </div>
          <div className="text-2xl leading-none mt-1 font-mono">{mouth}</div>
        </motion.div>

        {/* Flecha derecha: cambia expresión hacia adelante */}
        <div className="flex flex-col gap-2">
          {/* ojos  */}
          <button
            onClick={() => {
              setEyesIndex((eyesIndex + 1) % eyesOptions.length);

            }}
            className="p-2  rounded-lg text-black"
          >
            <ChevronRight size={22} />
          </button>
          {/* boca */}
          <button
            onClick={() => {

              setMouthIndex((mouthIndex + 1) % mouthOptions.length);
            }}
            className="p-2  rounded-lg text-black"
          >
            <ChevronRight size={22} />
          </button>
          {/* Color */}
          <button
            onClick={() =>
              setColorIndex((colorIndex + 1) % colors.length)
            }
            className="p-2  rounded-lg text-black"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

    
    </div>
  );
};

export default AvatarCustomizer;
