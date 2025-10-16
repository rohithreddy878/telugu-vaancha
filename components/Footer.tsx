import {
  FaInstagram,
  FaYoutube,
  FaGithub,
  FaCommentDots,
} from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 border-t border-pink-300">
      <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-white text-sm">
        <span className="font-medium drop-shadow-lg">
          © {new Date().getFullYear()} Telugu Vaancha
        </span>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=teluguvaancha@gmail.com&su=Feedback%20on%20Telugu%20Vaancha"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition-colors"
          >
            <FaCommentDots size={24} />
          </a>
          <a
            href="https://www.instagram.com/telugu_vaancha/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition-colors"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://www.youtube.com/@TeluguVaancha"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition-colors"
          >
            <FaYoutube size={24} />
          </a>
          <a
            href="https://github.com/rohithreddy878/telugu-vaancha"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition-colors"
          >
            <FaGithub size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}
