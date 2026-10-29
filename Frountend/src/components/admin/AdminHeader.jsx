
import { Bell, Menu, Search, UserRound } from "lucide-react";

// Provides the top navigation bar and mobile menu button.
export default function AdminHeader({ onMenuClick = () => {} }) {
  return (
    <header className="admin-header">
      <button
        type="button"
        className="admin-icon-button admin-menu-toggle"
        aria-label="Open navigation menu"
        onClick={onMenuClick}
      >
        <Menu size={22} />
      </button>

      <div className="admin-header-search">
        <Search size={18} />
        <input
          type="search"
          placeholder="Search medical equipment..."
          aria-label="Search admin panel"
        />
      </div>

      <div className="admin-header-actions">
        <button
          type="button"
          className="admin-icon-button"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={20} />
        </button>

        <div className="admin-user">
          <span className="admin-user-avatar">
            <UserRound size={21} />
          </span>
          <div>
            <strong>Admin Workspace</strong>
            <small>Management Panel</small>
          </div>
        </div>
      </div>
    </header>
  );
}