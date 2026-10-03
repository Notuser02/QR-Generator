import React from 'react';
import { QrCode, Sun, Moon, History, RefreshCw } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  onResetDefaults: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onOpenHistory,
  historyCount,
  onResetDefaults,
}) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-logo">
          <div className="logo-icon-wrapper">
            <QrCode className="logo-icon" size={26} />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">QR Studio</h1>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="header-btn"
            onClick={onResetDefaults}
            title="Reset all settings to default"
          >
            <RefreshCw size={18} />
            <span className="btn-text">Reset</span>
          </button>

          <button
            type="button"
            className="header-btn history-btn"
            onClick={onOpenHistory}
            title="View Recently Generated QR Codes"
          >
            <History size={18} />
            <span className="btn-text">History</span>
            {historyCount > 0 && <span className="history-badge">{historyCount}</span>}
          </button>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} className="sun-icon" /> : <Moon size={20} className="moon-icon" />}
          </button>
        </div>
      </div>
    </header>
  );
};
