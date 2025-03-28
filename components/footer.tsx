import { Link } from "react-router-dom";
import { FaTiktok, FaXTwitter, FaGithub } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 py-6 md:py-8">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-6">
        {/* Social Media Links */}
        <nav className="flex items-center gap-4">
          <Link
            to="https://www.tiktok.com/@yg_of_la"
            target="_blank"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <FaTiktok size={20} />
          </Link>
          <Link
            to="https://x.com/yg_of_la"
            target="_blank"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <FaXTwitter size={20} />
          </Link>
          <Link
            to="https://github.com/Olayiwolaaa/tweet-reply"
            target="_blank"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <FaGithub size={20} />
          </Link>
        </nav>
      </div>
    </footer>
  );
}
