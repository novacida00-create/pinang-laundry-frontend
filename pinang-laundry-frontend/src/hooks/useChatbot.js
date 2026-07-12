import { useState } from "react";

export default function useChatbot() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Halo 👋 Saya chatbot Laundry, ada yang bisa dibantu?",
    },
  ]);

  const sendMessage = (text) => {
    if (!text) return;

    const userMsg = { from: "user", text };

    const botMsg = {
      from: "bot",
      text: getReply(text),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const getReply = (text) => {
    const msg = text.toLowerCase();

    if (msg.includes("harga")) {
      return "Harga laundry mulai Rp 5.000/kg";
    }

    if (msg.includes("lama")) {
      return "Proses laundry 1-2 hari tergantung antrian";
    }

    if (msg.includes("alamat")) {
      return "Kami buka setiap hari 08.00 - 20.00";
    }

    return "Saya belum paham, coba tanyakan hal lain 😊";
  };

  return {
    messages,
    sendMessage,
  };
}