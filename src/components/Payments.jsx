import { ar, dfr, findStudent, solde } from '../utils';

export default function Payments({ db, setDb, open, toast }) {
  const list = [...db.payments].sort((p, q) => q.date.localeCompare(p.date));
  const debtors = db.students.filter((s) => solde(db, s.id) > 0);

  const remove = (id) => {
    if (!confirm('Supprimer ce paiement ?')) return;
    setDb((p) => ({ ...p, payments: p.payments.filter((x) => x.id !== id) }));
    toast('Paiement supprimé');
  };

  return (
    <>
      <div className="row">
        <h2 style={{ margin: '12px 0' }}>Paiements</h2>
        <button onClick={() => open('pay')}>Enregistrer un paiement</button>
      </div>
      {debtors.length > 0 && (
        <div className="card">
          <strong>À relancer</strong>
          {debtors.map((s) => {
            const tel = (s.tel || '').replace(/\D/g, '');
            const msg = encodeURIComponent(`Bonjour, petit rappel : il reste ${ar(solde(db, s.id))} pour les cours de ${s.name}. Merci !`);
            return (
              <div key={s.id} className="row" style={{ marginTop: 8 }}>
                <span>{s.name} <span className="muted">{ar(solde(db, s.id))}</span></span>
                {tel ? (
                  <a className="wa" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${tel}?text=${msg}`}>WhatsApp</a>
                ) : (
                  <span className="muted">pas de numéro</span>
                )}
              </div>
            );
          })}
        </div>
      )}
      <h2>Historique</h2>
      {list.length ? (
        list.map((p) => (
          <div key={p.id} className="card" onClick={() => remove(p.id)} style={{ cursor: 'pointer' }}>
            <div className="row">
              <strong>{findStudent(db, p.sid)?.name || 'Élève supprimé'}</strong>
              <span className="num">{ar(p.montant)}</span>
            </div>
            <div className="muted">{dfr(p.date)} · {p.mode}</div>
          </div>
        ))
      ) : (
        <div className="empty">Aucun paiement enregistré.</div>
      )}
    </>
  );
}
