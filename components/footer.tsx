export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 py-8 md:py-10 bg-background/95 backdrop-blur-sm">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          {/* Social Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <a
              href="https://www.tiktok.com/@yg_of_la"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground hover:underline underline-offset-4"
            >
              TikTok
            </a>
            <span className="text-muted-foreground/40">•</span>
            <a
              href="https://x.com/yg_of_la"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground hover:underline underline-offset-4"
            >
              Twitter
            </a>
            <span className="text-muted-foreground/40">•</span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Tweet Reply Generator. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
