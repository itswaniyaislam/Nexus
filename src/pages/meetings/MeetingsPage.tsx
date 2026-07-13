import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Check, X, Clock, Calendar as CalendarIcon, UserPlus, Send, Plus, Trash2 } from 'lucide-react';

interface Meeting {
  id: string;
  name: string;
  date: string;
  time: string;
}

interface Availability {
  id: string;
  date: string;
  time: string;
}

export const MeetingsPage: React.FC = () => {
  const [requestName, setRequestName] = useState<string>('');
  const [requestTime, setRequestTime] = useState<string>('09:00');
  const [requestDate, setRequestDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [sentRequests, setSentRequests] = useState<Meeting[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<Meeting[]>([
    { id: '1', name: 'Ahmed Khan', date: '2026-07-15', time: '10:00' },
    { id: '2', name: 'Sara Ali', date: '2026-07-16', time: '14:00' },
  ]);
  const [confirmed, setConfirmed] = useState<Meeting[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);

  const sendRequest = () => {
    if (!requestName.trim()) return alert("Please enter a name");
    setSentRequests([...sentRequests, { id: Date.now().toString(), name: requestName, date: requestDate, time: requestTime }]);
    setRequestName('');
  };

  const addAvailability = () => {
    setAvailability([...availability, { id: Date.now().toString(), date: selectedDate, time: requestTime }]);
  };

  const deleteAvailability = (id: string) => {
    setAvailability(availability.filter(slot => slot.id !== id));
  };

  return (
    <div className="p-6 space-y-8 animate-fade-in max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meeting Management</h1>
        <p className="text-gray-600">Coordinate your schedule and manage professional requests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            selectable={true}
            dateClick={(info) => {
              setSelectedDate(info.dateStr);
              setRequestDate(info.dateStr); // Syncs calendar click to the send request date
            }}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><CalendarIcon size={20} /> My Availability</h2>
            <div className="text-xs text-gray-500 mb-2">Selected: {selectedDate}</div>
            <input type="time" value={requestTime} onChange={(e) => setRequestTime(e.target.value)} className="w-full p-2 mb-3 border rounded-lg" />
            <button onClick={addAvailability} className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2">
              <Plus size={18} /> Add Slot
            </button>
            <div className="mt-4 space-y-2">
              {availability.map(slot => (
                <div key={slot.id} className="flex justify-between items-center text-xs bg-indigo-50 text-indigo-700 p-2 rounded border border-indigo-100">
                  <span>{slot.date} @ {slot.time}</span>
                  <button onClick={() => deleteAvailability(slot.id)} className="text-indigo-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Send size={20} /> Send Request</h2>
            <input type="text" placeholder="Recipient name..." value={requestName} onChange={(e) => setRequestName(e.target.value)} className="w-full p-2 mb-3 border rounded-lg" />
            <input type="date" value={requestDate} onChange={(e) => setRequestDate(e.target.value)} className="w-full p-2 mb-3 border rounded-lg" />
            <input type="time" value={requestTime} onChange={(e) => setRequestTime(e.target.value)} className="w-full p-2 mb-3 border rounded-lg" />
            <button onClick={sendRequest} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2">
              <UserPlus size={18} /> Send Invitation
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-500 uppercase text-sm mb-4">Sent Requests</h2>
          <div className="space-y-3">
            {sentRequests.map(req => (
              <div key={req.id} className="p-3 bg-gray-50 rounded-lg text-sm border">
                <p className="font-semibold">{req.name}</p>
                <p className="text-xs text-gray-400">{req.date} • {req.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-orange-600 uppercase text-sm mb-4">Received Requests</h2>
          <div className="space-y-3">
            {receivedRequests.map(req => (
              <div key={req.id} className="p-3 bg-orange-50 rounded-lg text-sm border border-orange-100 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{req.name}</p>
                  <p className="text-xs text-orange-700">{req.date} • {req.time}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setConfirmed([...confirmed, req]); setReceivedRequests(receivedRequests.filter(r => r.id !== req.id)); }} className="text-green-600 p-1 hover:bg-green-100 rounded"><Check size={16} /></button>
                  <button onClick={() => setReceivedRequests(receivedRequests.filter(r => r.id !== req.id))} className="text-red-600 p-1 hover:bg-red-100 rounded"><X size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-green-600 uppercase text-sm mb-4">Confirmed Meetings</h2>
          <div className="space-y-3">
            {confirmed.map(conf => (
              <div key={conf.id} className="p-3 bg-green-50 rounded-lg text-sm border border-green-100 flex items-center gap-3">
                <Clock size={16} className="text-green-600" />
                <div>
                  <p className="font-semibold">{conf.name}</p>
                  <p className="text-xs text-green-700">{conf.date} • {conf.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};