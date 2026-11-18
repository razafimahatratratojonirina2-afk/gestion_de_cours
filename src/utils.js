export const CL = ['6ᵉ', '5ᵉ', '4ᵉ', '3ᵉ'];
export const ST = ['prévue', 'effectuée', 'annulée', 'reportée'];
export const MODES = ['Espèces', 'Mobile money', 'Virement'];

export const uid = () => Math.random().toString(36).slice(2, 9);
export const ar = (n) => Math.round(n).toLocaleString('fr-FR') + ' Ar';
export const iso = (d) =>
  d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
export const TODAY = iso(new Date());
export const dfr = (s) =>
  new Date(s + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });

export const findStudent = (db, id) => db.students.find((s) => s.id === id);

// solde = (séances effectuées où l'élève est présent × tarif) − paiements
export function due(db, sid) {
  const s = findStudent(db, sid);
  if (!s) return 0;
  return db.sessions.filter((x) => x.statut === 'effectuée' && x.att && x.att[sid] === 'P').length * s.tarif;
}
export const paid = (db, sid) => db.payments.filter((p) => p.sid === sid).reduce((a, p) => a + p.montant, 0);
export const solde = (db, sid) => due(db, sid) - paid(db, sid);

export function weekRange() {
  const d = new Date();
  const a = new Date(d);
  a.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  const b = new Date(a);
  b.setDate(a.getDate() + 6);
  return [iso(a), iso(b)];
}
