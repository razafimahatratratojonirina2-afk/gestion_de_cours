import { useState } from 'react';
import Modal from './Modal';
import { CL, ST, MODES, TODAY, uid, ar, solde } from '../utils';

export function StudentForm({ db, setDb, id, onClose, toast }) {
  const existing = id ? db.students.find((s) => s.id === id) : null;
  const [f, setF] = useState(
    existing ?? { name: '', classe: '6ᵉ', matieres: 'Maths', parent: '', tel: '', tarif: 15000, actif: true }
  );
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const o = { ...f, id: id || uid(), name: f.name.trim(), tarif: Number(f.tarif) };
    setDb((p) => ({ ...p, students: id ? p.students.map((x) => (x.id === id ? o : x)) : [...p.students, o] }));
    toast('Élève enregistré');
    onClose();
  };
  const remove = () => {
    if (!confirm('Supprimer cet élève, ses paiements et ses présences ?')) return;
    setDb((p) => ({
      ...p,
      students: p.students.filter((x) => x.id !== id),
      payments: p.payments.filter((x) => x.sid !== id),
      sessions: p.sessions.map((x) => {
        const { [id]: _removed, ...att } = x.att;
        return { ...x, att };
      }),
    }));
    toast('Élève supprimé');
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={submit}>
        <h3>{id ? 'Modifier l’élève' : 'Nouvel élève'}</h3>
        <label>Nom complet</label>
        <input required value={f.name} onChange={(e) => set('name', e.target.value)} />
        <label>Classe</label>
        <select value={f.classe} onChange={(e) => set('classe', e.target.value)}>
          {CL.map((c) => <option key={c}>{c}</option>)}
        </select>
        <label>Matières</label>
        <input value={f.matieres} onChange={(e) => set('matieres', e.target.value)} />
        <label>Nom du parent ou tuteur</label>
        <input value={f.parent} onChange={(e) => set('parent', e.target.value)} />
        <label>Téléphone du parent (avec indicatif, ex. 261341234567)</label>
        <input inputMode="tel" value={f.tel} onChange={(e) => set('tel', e.target.value)} />
        <label>Tarif par séance (Ar)</label>
        <input type="number" min="0" step="500" required value={f.tarif} onChange={(e) => set('tarif', e.target.value)} />
        <label>
          <input type="checkbox" checked={f.actif} onChange={(e) => set('actif', e.target.checked)} style={{ width: 'auto', minHeight: 0 }} /> Élève actif
        </label>
        <div className="actions">
          {id && <button type="button" className="del" onClick={remove}>Supprimer</button>}
          <button type="button" className="ghost" onClick={onClose}>Annuler</button>
          <button>Enregistrer</button>
        </div>
      </form>
    </Modal>
  );
}

export function SessionForm({ db, setDb, id, onClose, toast }) {
  const existing = id ? db.sessions.find((s) => s.id === id) : null;
  const [f, setF] = useState(existing ?? { date: TODAY, theme: '', devoirs: '', statut: 'prévue', att: {} });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const setAtt = (sid, v) =>
    setF((p) => {
      const att = { ...p.att };
      if (v) att[sid] = v; else delete att[sid];
      return { ...p, att };
    });

  const submit = (e) => {
    e.preventDefault();
    const o = { ...f, id: id || uid() };
    setDb((p) => ({ ...p, sessions: id ? p.sessions.map((x) => (x.id === id ? o : x)) : [...p.sessions, o] }));
    toast('Séance enregistrée');
    onClose();
  };
  const remove = () => {
    if (!confirm('Supprimer cette séance ?')) return;
    setDb((p) => ({ ...p, sessions: p.sessions.filter((x) => x.id !== id) }));
    toast('Séance supprimée');
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={submit}>
        <h3>{id ? 'Modifier la séance' : 'Nouvelle séance'}</h3>
        <label>Date</label>
        <input type="date" required value={f.date} onChange={(e) => set('date', e.target.value)} />
        <label>Statut</label>
        <select value={f.statut} onChange={(e) => set('statut', e.target.value)}>
          {ST.map((s) => <option key={s}>{s}</option>)}
        </select>
        <label>Thème abordé</label>
        <input value={f.theme} onChange={(e) => set('theme', e.target.value)} />
        <label>Devoirs donnés</label>
        <textarea rows="2" value={f.devoirs} onChange={(e) => set('devoirs', e.target.value)} />
        <label>Élèves et présence</label>
        {db.students.filter((s) => s.actif || f.att[s.id]).map((s) => (
          <div className="pill" key={s.id}>
            <span>{s.name} <span className="muted">{s.classe}</span></span>
            <select value={f.att[s.id] || ''} onChange={(e) => setAtt(s.id, e.target.value)}>
              <option value="">Non concerné</option>
              <option value="U">Prévu</option>
              <option value="P">Présent</option>
              <option value="A">Absent</option>
            </select>
          </div>
        ))}
        <div className="actions">
          {id && <button type="button" className="del" onClick={remove}>Supprimer</button>}
          <button type="button" className="ghost" onClick={onClose}>Annuler</button>
          <button>Enregistrer</button>
        </div>
      </form>
    </Modal>
  );
}

export function PayForm({ db, setDb, onClose, toast }) {
  const first = db.students.find((s) => solde(db, s.id) > 0) || db.students[0];
  const suggest = (s) => Math.max(0, solde(db, s.id)) || s.tarif;
  const [f, setF] = useState({ sid: first.id, montant: suggest(first), date: TODAY, mode: MODES[0] });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const pickStudent = (sid) => {
    const s = db.students.find((x) => x.id === sid);
    setF((p) => ({ ...p, sid, montant: suggest(s) }));
  };
  const submit = (e) => {
    e.preventDefault();
    setDb((p) => ({ ...p, payments: [...p.payments, { id: uid(), sid: f.sid, montant: Number(f.montant), date: f.date, mode: f.mode }] }));
    toast('Paiement enregistré');
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={submit}>
        <h3>Enregistrer un paiement</h3>
        <label>Élève</label>
        <select value={f.sid} onChange={(e) => pickStudent(e.target.value)}>
          {db.students.map((s) => (
            <option key={s.id} value={s.id}>{s.name}{solde(db, s.id) > 0 ? ` (doit ${ar(solde(db, s.id))})` : ''}</option>
          ))}
        </select>
        <label>Montant (Ar)</label>
        <input type="number" min="1" step="500" required value={f.montant} onChange={(e) => set('montant', e.target.value)} />
        <label>Date</label>
        <input type="date" required value={f.date} onChange={(e) => set('date', e.target.value)} />
        <label>Mode de paiement</label>
        <select value={f.mode} onChange={(e) => set('mode', e.target.value)}>
          {MODES.map((m) => <option key={m}>{m}</option>)}
        </select>
        <div className="actions">
          <button type="button" className="ghost" onClick={onClose}>Annuler</button>
          <button>Enregistrer</button>
        </div>
      </form>
    </Modal>
  );
}
