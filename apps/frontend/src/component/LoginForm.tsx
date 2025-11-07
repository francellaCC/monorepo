
import { useState } from 'react';
import AvatarCustomizer from './AvatarCustomizer';


export default function LoginForm() {
 const [name, setName] = useState('');

  const handleSubmit = () => {
   console.log(`Name: ${name}`);
  }
  return (
    <div className="bg-[#E5E7F4] min-h-screen flex flex-col justify-center items-center ">
      <div>
        <h1 className="text-2xl font-semibold pb-4 text-center">Drawlio 🖋️</h1>
        <div className="bg-[#F5F5F5] border-[#BAADBD] border-2 h-full rounded-lg shadow-md flex flex-col p-4 space-y-3 w-full">
          <div>
            <AvatarCustomizer />
          </div>
            <div className="flex flex-row gap-4 p-3">
              <input
                type="text"
                name='name'
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nombre"
                className="p-2 border border-[#BAADBD] rounded"
              />
             
            </div>
            <button
              type="submit"
              className="bg-[#F3F0F7] border-[#BAADBD] border-2 text-black p-2 rounded hover:bg-[#BAADBD] hover:text-white 
              transition"
              onClick={handleSubmit}
            >
              Create Private Room
            </button>
          
        </div>
      </div>
    </div>
  )
}
