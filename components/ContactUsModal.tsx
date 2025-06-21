import React from "react";
import IconButton from "./button/IconButton";
import { MemberService } from "@/services/MemberService";

interface ContactUsModalProps {
  open: boolean;
  onClose: () => void;
}

const ContactUsModal: React.FC<ContactUsModalProps> = ({ open, onClose }) => {
  if (!open) return null;


  const sendMessage = async (name: string, email: string, message: string) => {
    const result = await (new MemberService()).sendContactUs(name, email, message);
    if (result) {
      alert("Your message has been sent successfully. We will get back to you soon.");
      onClose();
    }
  }

  // Add state for form fields
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[95vh] min-h-[600px] overflow-hidden p-8 relative">
        {/* Title and Close Button Row */}
        <div className="flex items-center justify-between mb-4 pr-8" style={{ minHeight: 32 }}>
          <h2 className="text-2xl font-bold flex items-center h-8 m-0 p-0" style={{ lineHeight: '32px', height: 32 }}>Contact Us</h2>
          <div className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-transparent border-none cursor-pointer">
            <IconButton
              imageSrc="/images/icon/close.svg"
              width={16}
              height={16}
              onClick={onClose}
            />
          </div>
        </div>
        {/* Contact form content */}
        <div className="prose max-w-none overflow-y-auto custom-scrollbar pr-8" style={{ maxHeight: '70vh', minHeight: '350px' }}>
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(name, email, message);
            }}
          >
            <div>
              <label htmlFor="name" className="block font-medium mb-1">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Your name"
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-medium mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="your-email@example.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="message" className="block font-medium mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="How can we help you?"
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUsModal;
