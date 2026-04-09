import { useState } from "react";
import { X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa"; // ✅ WhatsApp icon

export default function WhatsAppChat() {
  const [open, setOpen] = useState(false);

  const phoneNumber = "919876543210"; // replace
  const message = "Hi, I am interested in job opportunities";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Chat Box */}
      {open && (
        <div className="w-72 bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">

          {/* Header */}
          <div className="bg-green-500 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">OneStep Jobs</p>
              <p className="text-xs opacity-90">Typically replies instantly</p>
            </div>
            <button onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-gray-50">
            <div className="bg-white p-3 rounded-lg shadow text-sm text-gray-700">
              👋 Hi there! <br />
              How can we help you today?
            </div>
          </div>

          {/* Action */}
          <div className="p-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-green-500 hover:bg-green-400 text-white py-2 rounded-lg text-sm font-medium transition"
            >
              Start Chat
            </a>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative bg-green-500 hover:bg-green-400 text-white p-4 rounded-full shadow-lg transition duration-300"
      >
        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping"></span>

        {/* ✅ WhatsApp Icon */}
        <FaWhatsapp className="w-6 h-6 relative" />
      </button>
    </div>
  );
}