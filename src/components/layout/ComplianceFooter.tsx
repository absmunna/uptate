import { Link } from "wouter";

export function ComplianceFooter() {
  return (
    <footer className="w-full border-t border-white/5 bg-black/20 backdrop-blur-sm mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-white/50 text-sm">PaikarMart</span>
          <span>·</span>
          <span>© {new Date().getFullYear()} PaikarMart Ltd. All rights reserved.</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link
            href="/legal/terms"
            className="hover:text-white transition-colors underline-offset-2 hover:underline"
          >
            Terms of Service
          </Link>
          <Link
            href="/legal/refund"
            className="hover:text-white transition-colors underline-offset-2 hover:underline"
          >
            Refund &amp; Return Policy
          </Link>
          <Link
            href="/legal/privacy"
            className="hover:text-white transition-colors underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="/legal/shipping"
            className="hover:text-white transition-colors underline-offset-2 hover:underline"
          >
            Shipping Policy
          </Link>
        </nav>

        <p className="hidden md:block">
          Licensed under Bangladesh Digital Commerce Policy 2021
        </p>
      </div>
    </footer>
  );
}
