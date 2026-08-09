import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-5 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
        <Compass size={28} className="text-white/40" />
      </div>
      <p className="section-eyebrow">404</p>
      <h1 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">Page not found</h1>
      <p className="mt-2 text-sm text-white/45">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
