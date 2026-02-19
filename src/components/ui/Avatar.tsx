import { Edit } from "lucide-react";
import { useState } from "react";

interface User {
  avatar?: string;
  name?: string;
}

export default function Avater({ user, className = "" }: { user?: User; className?: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const list = [
    {
      src: "/animal-bear.png",
      alt: "",
    },
    {
      src: "/animal-cat.png",
      alt: "",
    },
    {
      src: "/animal-dog.png",
      alt: "",
    },
    {
      src: "/animal-panda.png",
      alt: "",
    },
    {
      src: "/animal-rabbit.png",
      alt: "",
    },
  ];
  return (
    <div
      className={`relative group w-24 h-24 text-center rounded-full border-4 border-white shadow-lg ${className}`}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-60 blur"></div>
      <div className="relative h-24 w-24 rounded-full border-4 border-white overflow-hidden shadow-lg">
        <img
          src={user?.avatar || list[active].src}
          alt={user?.name || list[active].alt}
          className="w-full h-full"
          onClick={() => setOpen(prev => !prev)}
        />
      </div>

      <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-50 transition-colors">
        <Edit className="h-4 w-4 text-gray-600" onClick={() => setOpen(prev => !prev)} />
      </button>

      {open && (
        <div className="min-w-96 absolute z-20 left-20 top-20 bg-white rounded-md shadow-sm p-6 grid grid-cols-3 gap-2">
          {list.map((item, index) => (
            <img
              src={user?.avatar || item.src}
              alt={user?.name || item.alt}
              onClick={() => {
                setActive(index);
                setOpen(false);
              }}
              className="w-20 cursor-pointer"
            />
          ))}
        </div>
      )}
    </div>
  );
}
