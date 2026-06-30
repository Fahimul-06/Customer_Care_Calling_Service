import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="app-shell center-screen">
      <section className="glass-card narrow text-center">
        <h1>Page not found</h1>
        <p>The customer care calling page you requested does not exist.</p>
        <Link className="primary-btn" to="/">Back to calling dashboard</Link>
      </section>
    </main>
  );
}
