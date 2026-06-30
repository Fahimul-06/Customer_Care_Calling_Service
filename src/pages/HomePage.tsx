import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Headphones, PhoneCall, Radio, ShieldCheck, Truck, UserCog, Wifi } from 'lucide-react';
import { api, API_BASE_URL, clearToken, getToken, setToken } from '../lib/api';
import type { Role } from '../features/customerCareCalling/callTypes';

type TokenState = {
  admin: string;
  delivery: string;
};

function makeRoomId(prefix = 'customer-care') {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${random}`;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState<TokenState>({ admin: getToken('admin'), delivery: getToken('delivery') });
  const [roomId, setRoomId] = useState(makeRoomId());
  const [role, setRole] = useState<Role>('admin');
  const [createPath, setCreatePath] = useState('/delivery/support/call');
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');
  const apiBase = useMemo(() => API_BASE_URL || window.location.origin, []);

  const saveTokens = () => {
    if (tokens.admin.trim()) setToken('admin', tokens.admin.trim()); else clearToken('admin');
    if (tokens.delivery.trim()) setToken('delivery', tokens.delivery.trim()); else clearToken('delivery');
    setMessage('Tokens saved in browser localStorage.');
  };

  const joinRoom = (event?: FormEvent) => {
    event?.preventDefault();
    const id = roomId.trim();
    if (!id) {
      setMessage('Please enter a room ID.');
      return;
    }
    saveTokens();
    navigate(`/call/${encodeURIComponent(id)}?role=${role}`);
  };

  const createRoomFromBackend = async () => {
    saveTokens();
    setCreating(true);
    setMessage('Creating call room from backend...');
    try {
      const data = await api.post<any>(createPath, {}, 'delivery');
      const url = data.callUrl || data.room?.callUrl || data.room?.roomUrl || '';
      const id = data.roomId || data.room?.roomId || data.room?._id || (typeof url === 'string' ? url.split('/call/')[1]?.split('?')[0] : '');
      if (!id) throw new Error('Backend did not return roomId or callUrl. Use manual room ID instead.');
      setRoomId(id);
      setRole('delivery');
      navigate(`/call/${encodeURIComponent(id)}?role=delivery`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not create room from backend.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Headphones size={18}/> Customer Care Calling Service</div>
          <h1>Own live internet call frontend for customer care and delivery support.</h1>
          <p>
            This standalone React frontend connects to your own Express + Socket.IO backend. It supports direct WebRTC first,
            then own-server relay mode for stricter networks.
          </p>
          <div className="hero-actions">
            <a className="primary-btn" href="#join">Start / Join Call</a>
            <a className="secondary-btn" href="#settings">Configure Tokens</a>
          </div>
        </div>
        <div className="status-card">
          <div className="pulse-icon"><Radio/></div>
          <h2>Realtime Call Ready</h2>
          <p>Backend target</p>
          <code>{apiBase}</code>
          <div className="feature-row"><ShieldCheck size={17}/> No Jitsi or third-party meeting room</div>
          <div className="feature-row"><Wifi size={17}/> Own Socket.IO relay fallback</div>
        </div>
      </section>

      <section className="grid-3">
        <article className="mini-card"><PhoneCall/><h3>Direct WebRTC</h3><p>Low latency browser-to-browser audio when network allows.</p></article>
        <article className="mini-card"><Wifi/><h3>Own Relay</h3><p>Fallback audio through your own backend Socket.IO server.</p></article>
        <article className="mini-card"><Headphones/><h3>Customer Care UI</h3><p>Admin/support and delivery users can join the same room.</p></article>
      </section>

      <section id="settings" className="glass-card">
        <div className="section-title">
          <UserCog/>
          <div>
            <h2>Access tokens</h2>
            <p>Paste your app login JWTs here. They are saved only in this browser localStorage.</p>
          </div>
        </div>
        <div className="form-grid">
          <label>
            Customer Care/Admin token
            <textarea value={tokens.admin} onChange={(e) => setTokens((prev) => ({ ...prev, admin: e.target.value }))} placeholder="Paste admin/customer care JWT token" />
          </label>
          <label>
            Delivery token
            <textarea value={tokens.delivery} onChange={(e) => setTokens((prev) => ({ ...prev, delivery: e.target.value }))} placeholder="Paste delivery man JWT token" />
          </label>
        </div>
        <button className="secondary-btn" onClick={saveTokens}>Save tokens</button>
      </section>

      <section id="join" className="glass-card">
        <div className="section-title">
          <PhoneCall/>
          <div>
            <h2>Start or join a call room</h2>
            <p>Use the same room ID on both sides. One browser can join as delivery, another as customer care/admin.</p>
          </div>
        </div>
        <form className="join-form" onSubmit={joinRoom}>
          <label>
            Room ID
            <input value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="customer-care-room-001" />
          </label>
          <label>
            Join as
            <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="admin">Customer Care / Admin</option>
              <option value="delivery">Delivery Man</option>
            </select>
          </label>
          <button className="primary-btn" type="submit">Open Call Room</button>
        </form>
      </section>

      <section className="glass-card">
        <div className="section-title">
          <Truck/>
          <div>
            <h2>Create delivery support call from backend</h2>
            <p>Optional: if your backend has a route that creates call rooms, call it here.</p>
          </div>
        </div>
        <label>
          Create call API path
          <input value={createPath} onChange={(e) => setCreatePath(e.target.value)} placeholder="/delivery/support/call" />
        </label>
        <button className="primary-btn" disabled={creating} onClick={createRoomFromBackend}>{creating ? 'Creating...' : 'Create Call as Delivery'}</button>
      </section>

      {message && <div className="toast">{message}</div>}
    </main>
  );
}
