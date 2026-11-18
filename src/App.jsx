import { useState, useCallback } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { iso, uid } from './utils';
import Home from './components/Home';
import Students from './components/Students';
import Sessions from './components/Sessions';
import Payments from './components/Payments';
import { StudentForm, SessionForm, PayForm } from './components/Forms';

const EMPTY = { students: [], sessions: [], payments: [] };
const TABS = [['home', 'Accueil'], ['students', 'Élèves'], ['sessions', 'Séances'], ['pay', 'Paiements']];

export default function App() {
  const [db, setDb] = useLocalStorage('coursapp.v1', EMPTY);
  const [view, setView] = useState('home');
  const [modal, setModal] = useState(null);
  const [msg, setMsg] = useState('');

  const toast = useCallback((m) => {
    setMsg(m);
    setTimeout(() => setMsg(''), 2200);
  }, []);

  const open = (kind, id) => {
    if ((kind === 'session' || kind === 'pay') && !db.students.length) {
      toast('Ajoute d’abord un élève');
      return;
    }
    setModal({ kind, id });
  };
  const close = () => setModal(null);

  // Crée les mercredis et samedis des 4 prochaines semaines (sans doublons)
  const genSessions = () => {
    const active = db.students.filter((s) => s.actif);
    if (!active.length) { toast('Ajoute d’abord un élève actif'); return; }
    const created = [];
    const d = new Date();
    for (let i = 0; i < 28; i++) {
      const date = iso(d);
      const day = d.getDay();
      if ((day === 3 || day === 6) && !db.sessions.some((x) => x.date === date)) {
        created.push({ id: uid(), date, statut: 'prévue', theme: '', devoirs: '', att: Object.fromEntries(active.map((s) => [s.id, 'U'])) });
      }
      d.setDate(d.getDate() + 1);
    }
    if (created.length) setDb((p) => ({ ...p, sessions: [...p.sessions, ...created] }));
    toast(created.length ? `${created.length} séances créées` : 'Les séances existent déjà');
  };

  const common = { db, setDb, open, toast, genSessions };

  return (
    <>
      <header>
        <h1>Mon cahier de cours</h1>
        <p>Mercredi et samedi après-midi · 6ᵉ à 3ᵉ</p>
      </header>
      <main>
        {view === 'home' && <Home {...common} />}
        {view === 'students' && <Students {...common} />}
        {view === 'sessions' && <Sessions {...common} />}
        {view === 'pay' && <Payments {...common} />}
      </main>
      <nav>
        {TABS.map(([k, label]) => (
          <button key={k} className={view === k ? 'on' : ''} onClick={() => { setView(k); window.scrollTo(0, 0); }}>
            {label}
          </button>
        ))}
      </nav>
      {modal?.kind === 'student' && <StudentForm key={modal.id || 'new'} {...common} id={modal.id} onClose={close} />}
      {modal?.kind === 'session' && <SessionForm key={modal.id || 'new'} {...common} id={modal.id} onClose={close} />}
      {modal?.kind === 'pay' && <PayForm {...common} onClose={close} />}
      <div id="toast" role="status" className={msg ? 'show' : ''}>{msg}</div>
    </>
  );
}
