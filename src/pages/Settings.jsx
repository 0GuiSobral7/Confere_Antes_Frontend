import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import Icon from "../components/Icon.jsx";
import Screen from "../components/Screen.jsx";
import { settingsStore } from "../lib/storage.js";

function Switch({ label, checked, onChange, disabled }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label}
      className="switch" disabled={disabled} onClick={() => onChange(!checked)} />
  );
}

export default function Settings() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState(() => settingsStore.get(user.email));
  const update = (key) => (value) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    settingsStore.set(user.email, next);
  };

  return (
    <Screen sub="Preferências" title="Configurações">
      <section className="card">
        <h2>Proteção e alertas</h2>
        <ul className="list">
          <li>
            <div className="item">
              <span className="grow"><strong>Alertas de contato suspeito</strong><small>Aviso imediato por notificação</small></span>
              <Switch label="Alertas de contato suspeito" checked={prefs.alerts} onChange={update("alerts")} />
            </div>
          </li>
          <li>
            <div className="item item--disabled">
              <span className="grow"><strong>Confirmação em duas etapas no login</strong><small>Código de verificação ao entrar · Em breve</small></span>
              <Switch label="Confirmação em duas etapas no login (em breve)" checked={false} onChange={() => {}} disabled />
            </div>
          </li>
          <li>
            <div className="item">
              <span className="grow"><strong>Compartilhar denúncias anonimizadas</strong><small>Ajuda a mapear padrões de golpe</small></span>
              <Switch label="Compartilhar denúncias anonimizadas" checked={prefs.shareReports} onChange={update("shareReports")} />
            </div>
          </li>
        </ul>
        <p className="muted small" style={{ marginTop: 8 }}>Preferências salvas neste dispositivo.</p>
      </section>
      <section className="card">
        <ul className="list" style={{ marginTop: 0 }}>
          <li><div className="item"><span className="grow"><strong>Idioma</strong><small>Português (Brasil)</small></span></div></li>
          <li><div className="item item--disabled" aria-disabled="true"><span className="grow"><strong>Privacidade e dados</strong></span><span className="badge">Em breve</span></div></li>
          <li><div className="item item--disabled" aria-disabled="true"><span className="grow"><strong>Ajuda e suporte</strong></span><span className="badge">Em breve</span></div></li>
        </ul>
      </section>
    </Screen>
  );
}
