import SessionCard from './SessionCard';

export default function Sessions({ db, open, genSessions }) {
  const list = [...db.sessions].sort((p, q) => q.date.localeCompare(p.date));
  return (
    <>
      <div className="row">
        <h2 style={{ margin: '12px 0' }}>Séances</h2>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="ghost" onClick={genSessions}>Mer. et sam.</button>
          <button onClick={() => open('session')}>Nouvelle séance</button>
        </div>
      </div>
      {list.length ? (
        list.map((x) => <SessionCard key={x.id} db={db} session={x} onClick={() => open('session', x.id)} />)
      ) : (
        <div className="empty">Aucune séance. Crée-en une, ou génère les mercredis et samedis des 4 prochaines semaines.</div>
      )}
    </>
  );
}
