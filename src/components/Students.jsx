import { useState } from 'react';
import { CL, ar, solde } from '../utils';

export default function Students({ db, open }) {
  const [filter, setFilter] = useState('Toutes');
  const list = db.students.filter((s) => filter === 'Toutes' || s.classe === filter);
  return (
    <>
      <div className="row">
        <h2 style={{ margin: '12px 0' }}>Élèves</h2>
        <button onClick={() => open('student')}>Ajouter un élève</button>
      </div>
      <div className="filters">
        {['Toutes', ...CL].map((c) => (
          <button key={c} className={c === filter ? 'on' : ''} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>
      {list.length ? (
        list.map((s) => {
          const so = solde(db, s.id);
          return (
            <div key={s.id} className="card" onClick={() => open('student', s.id)} style={{ cursor: 'pointer' }}>
              <div className="row"><strong>{s.name}</strong><span className="tag">{s.classe}</span></div>
              <div className="muted">{s.matieres} · {ar(s.tarif)} par séance</div>
              <div className="muted">Parent : {s.parent || '—'} {s.actif ? '' : '· inactif'}</div>
              <div>{so > 0 ? <span className="tag bad">Doit {ar(so)}</span> : <span className="tag ok">À jour</span>}</div>
            </div>
          );
        })
      ) : (
        <div className="empty">Aucun élève ici. Ajoute le premier avec le bouton ci-dessus.</div>
      )}
    </>
  );
}
