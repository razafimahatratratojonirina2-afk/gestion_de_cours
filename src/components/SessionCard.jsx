import { dfr, findStudent } from '../utils';

const tagClass = { effectuée: 'ok', prévue: '', annulée: 'bad', reportée: 'warn' };

export default function SessionCard({ db, session: x, onClick }) {
  const names = Object.keys(x.att || {})
    .map((id) => findStudent(db, id)?.name.split(' ')[0])
    .filter(Boolean)
    .join(', ');
  return (
    <div className="card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="row">
        <strong>{dfr(x.date)}</strong>
        <span className={'tag ' + tagClass[x.statut]}>{x.statut}</span>
      </div>
      <div>{x.theme || <span className="muted">Thème à renseigner</span>}</div>
      <div className="muted">{names || 'Aucun élève'}</div>
    </div>
  );
}
