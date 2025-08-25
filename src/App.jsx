import { useState } from "react";
import { api } from "./api";

export default function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [people, setPeople] = useState(2);
  const [datetime, setDatetime] = useState("");
  const [available, setAvailable] = useState(null);
  const [message, setMessage] = useState("");

  async function findTable() {
    setMessage("");
    setAvailable(null);
    if (!datetime || !people) { setMessage("Välj datum/tid och antal."); return; }

    try {
      const r = await api.get("/Table/GetAvailableTable", {
        params: { seatingsRequired: people, bookingTime: datetime }
      });
      setAvailable(r.data); // innehåller t.ex. tableNumber/seatings
    } catch (e) {
      setMessage("Inget ledigt bord hittades 🤷");
    }
  }

  async function getOrCreateCustomer() {
    // försök hämta kund på telefon
    try {
      const r = await api.get("/Customer/GetByPhoneNumber", { params: { phoneNumber: phone }});
      return r.data.customerId || r.data.id; // beroende på modellnamn
    } catch {
      // skapa kund
      const r2 = await api.post("/Customer", {
        customerName: name,
        phoneNumber: phone
      });
      return r2.data.customerId || r2.data.id;
    }
  }

  async function book() {
    if (!available) { setMessage("Hitta ett bord först."); return; }
    try {
      const customerId = await getOrCreateCustomer();
      await api.post("/Booking", {
        customerId,
        tableId: available.tableNumber || available.tableId, // beroende på API
        bookingAmount: people,
        timeToArrive: datetime
      });
      setMessage("Bokningen är registrerad! ✅");
    } catch (e) {
      setMessage("Kunde inte boka. Testa igen.");
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "24px auto", padding: 16 }}>
      <h2>Boka bord</h2>
      <div className="form-group">
        <label>Namn</label>
        <input className="form-control" value={name} onChange={e=>setName(e.target.value)} placeholder="Ditt namn" />
      </div>
      <div className="form-group">
        <label>Telefon</label>
        <input className="form-control" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="0701234567" />
      </div>
      <div className="form-group">
        <label>Datum & tid</label>
        <input className="form-control" type="datetime-local" value={datetime} onChange={e=>setDatetime(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Antal personer</label>
        <input className="form-control" type="number" min="1" max="12" value={people} onChange={e=>setPeople(+e.target.value)} />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button className="btn btn-outline-primary" onClick={findTable}>Sök ledigt bord</button>
        <button className="btn btn-primary" onClick={book} disabled={!available}>Boka</button>
      </div>

      {available && (
        <div className="alert alert-success mt-3">
          Ledigt bord hittat: <strong>{available.tableNumber ?? available.tableId}</strong> ({available.seatings} platser)
        </div>
      )}
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
