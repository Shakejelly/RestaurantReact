import { useState } from 'react';
import axios from 'axios';

export default function RestaurantCreate() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [people, setPeople] = useState(1);
  const [table, setTable] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [error, setError] = useState('');

  const handleBooking = async () => {
    setError('');
    setTable(null);
    setBookingConfirmed(false);

    const bookingTime = new Date(`${date}T${time}`);
    try {
      const tableResponse = await axios.get(
        `https://localhost:7053/api/Table/GetAvailableTable`,
        {
          params: {
            seatingsRequired: people,
            bookingTime: bookingTime.toISOString(),
          },
        }
      );

      if (!tableResponse.data || !tableResponse.data.tableId) {
        setError('Inga bord tillgängliga 😢');
        return;
      }

      setTable(tableResponse.data);

      const booking = {
        customerId: 1, 
        tableId: tableResponse.data.tableId,
        tableAmount: people,
        timeToArrive: bookingTime,
      };
      console.log("Skickar bokning:", booking);
      await axios.post(`https://localhost:7053/api/Booking/addBooking`, booking);
      console.log("Bokningen lyckades");
      setBookingConfirmed(true);
      
    } catch (err) {
      console.error(err);
      setError('Något gick snett vid bokningen 😬');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '2rem' }}>
      <h2>Boka Bord 🍽️</h2>

      <div className="mb-3">
        <label>Datum:</label>
        <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="mb-3">
        <label>Tid:</label>
        <input type="time" className="form-control" value={time} onChange={(e) => setTime(e.target.value)} />
      </div>

      <div className="mb-3">
        <label>Antal personer:</label>
        <input
          type="number"
          min="1"
          max="20"
          className="form-control"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
        />
      </div>

      <button className="btn btn-primary" onClick={handleBooking}>
        Boka
      </button>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {bookingConfirmed && (
        <div className="alert alert-success mt-3">
          Bokningen är bekräftad! Bord #{table?.tableId} är ditt. ✨
        </div>
      )}
    </div>
  );
}
