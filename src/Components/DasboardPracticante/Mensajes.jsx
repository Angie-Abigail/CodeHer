import { useState } from "react";

const O = "#F47920";
const B = "#003087";

export default function Mensajes() {
  const [activeChat, setActiveChat] = useState(1);

  const chats = [
    {
      id: 1,
      name: "Reclutador BCP",
      last: "Hola, revisamos tu perfil...",
      unread: true,
      messages: [
        { from: "reclutador", text: "Hola, revisamos tu perfil." },
        { from: "user", text: "Gracias por la oportunidad." },
        { from: "reclutador", text: "Queremos agendar una entrevista." },
      ],
    },
    {
      id: 2,
      name: "Talent Acquisition",
      last: "Avance de proceso...",
      unread: false,
      messages: [
        { from: "reclutador", text: "Avance de tu postulación." },
        { from: "user", text: "Perfecto, quedo atento." },
      ],
    },
  ];

  const chat = chats.find((c) => c.id === activeChat);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[75vh] flex overflow-hidden">

      {/* SIDEBAR CHATS */}
      <div className="w-1/3 border-r border-gray-100 bg-gray-50">

        <div className="p-4 border-b">
          <h2 className="text-sm font-bold" style={{ color: B }}>
            Mensajes
          </h2>
          <p className="text-xs text-gray-500">
            Conversaciones con reclutadores
          </p>
        </div>

        <div className="overflow-y-auto h-full">
          {chats.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveChat(c.id)}
              className={`w-full text-left px-4 py-3 border-b hover:bg-white transition ${
                activeChat === c.id ? "bg-white" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-900">
                  {c.name}
                </p>

                {/* NOTIFICACIÓN */}
                {c.unread && (
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: O }}
                  />
                )}
              </div>

              <p className="text-xs text-gray-500 truncate">
                {c.last}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* CHAT VIEW */}
      <div className="flex-1 flex flex-col">

        {/* HEADER CHAT */}
        <div className="px-5 py-4 border-b">
          <h3 className="text-sm font-bold text-gray-900">
            {chat.name}
          </h3>
          <p className="text-xs text-gray-500">
            Reclutador activo
          </p>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-5 space-y-3 overflow-y-auto bg-white">

          {chat.messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg text-sm ${
                  msg.from === "user"
                    ? "bg-blue-900 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

        </div>

        {/* INPUT */}
        <div className="p-4 border-t flex gap-2 bg-gray-50">

          <input
            placeholder="Escribe un mensaje..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
          />

          <button
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: B }}
          >
            Enviar
          </button>

        </div>

      </div>
    </div>
  );
}