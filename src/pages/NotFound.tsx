import { Link } from 'react-router'

export function NotFound() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">Return to Today</Link>
    </div>
  )
}
