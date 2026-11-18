import { ar, TODAY, weekRange, solde } from '../utils';
import SessionCard from './SessionCard';

function Stat({ value, label, color }) {
  return (
    <div className="stat">
      <div className="num" style={color ? { color } : undefined}>{value}</div>
      <small>{label}</small>
    </div>
  );
}

export default function Home({ db, open, genSessions }) {
  const [a, b] = weekRange();
  const month = TODAY.slice(0, 7);
  const week = db.sessions.filter((x) => x.date >= a && x.date <= b).sort((p, q) => p.date.localeCompare(q.date));
  const revenue = db.payments.filter((p) => p.date.startsWith(month)).reduce((s, p) => s + p.montant, 0);
  const unpaid = db.students.reduce((s, x) => s + Math.max(0, solde(db, x.id)), 0);
  let present = 0, total = 0;
  db.sessions
    .filter((x) => x.statut === 'effectuée')
    .forEach((x) => Object.values(x.att || {}).forEach((v) => {
      if (v === 'P' || v === 'A') { total++; if (v === 'P') present++; }
    }));

  return (
    <>
      <div className="stats">
        <Stat value={week.length} label="séances cette semaine" />
        <Stat value={db.students.filter((s) => s.actif).length} label="élèves actifs" />
        <Stat value={ar(revenue)} label="encaissé ce mois-ci" />
        <Stat value={ar(unpaid)} label="impayés" color="var(--red)" />
      </div>
      <p className="muted">
        Taux de présence : {total ? Math.round((present / total) * 100) + ' %' : 'pas encore de données'}
      </p>
      <h2>Cette semaine</h2>
      {week.length ? (
        week.map((x) => <SessionCard key={x.id} db={db} session={x} onClick={() => open('session', x.id)} />)
      ) : (
        <div className="empty">
          Aucune séance cette semaine.<br /><br />
          <button onClick={genSessions}>Créer les mercredis et samedis</button>
        </div>
      )}
    </>
  );
}
