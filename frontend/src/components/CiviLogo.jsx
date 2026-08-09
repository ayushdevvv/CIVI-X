import { UsersRound } from "lucide-react";
import { Link } from "react-router-dom";

export default function CiviLogo({ admin = false }) {
  return (
    <Link to={admin ? "/admin" : "/"} className="civi-logo" aria-label="Civi-X home">
      <span className="civi-logo-mark"><UsersRound size={18} strokeWidth={2.3} /></span>
      <span className="civi-logo-wordmark">
        <strong>Civi-X</strong>
        <small>{admin ? "Command Center" : "Citizen Connect"}</small>
      </span>
    </Link>
  );
}
