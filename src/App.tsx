import { useState, useEffect, useMemo } from 'react';
import type { QRType, QRFormData, QRStyleOptions, HistoryItem } from './types/qr';
import { generateQRPayload, validateQRInput, getDefaultFormData } from './utils/qrPayload';
import { evaluateScanReliability } from './utils/scanReliability';
import { getHistory, saveToHistory, removeFromHistory, clearHistory } from './utils/storage';

import { Header } from './components/Header';
import { TypeSelector } from './components/TypeSelector';
import { FormInputs } from './components/FormInputs';
import { CustomizerTabs } from './components/Customizer/CustomizerTabs';
import { QRPreview } from './components/QRPreview';
import { ScanReliabilityMeter } from './components/ScanReliabilityMeter';
import { HistoryDrawer } from './components/HistoryDrawer';

const DEFAULT_STYLE: QRStyleOptions = {
  size: 300,
  margin: 3,
  errorCorrectionLevel: 'M',
  foregroundColor: '#0F172A',
  backgroundColor: '#FFFFFF',
  isTransparentBg: false,
  gradient: {
    type: 'none',
    color1: '#0F172A',
    color2: '#334155',
    rotation: 0,
  },
  dotsType: 'square',
  cornerSquareType: 'square',
  cornerDotType: 'square',
  useCustomCornerColors: false,
  cornerSquareColor: '',
  cornerDotColor: '',
  logoSize: 0.2,
  logoMargin: 2,
  hideDotsBehindLogo: true,
};

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [activeType, setActiveType] = useState<QRType>('url');
  const [formData, setFormData] = useState<QRFormData>(getDefaultFormData('url'));
  const [style, setStyle] = useState<QRStyleOptions>(DEFAULT_STYLE);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Update root html attribute for theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handle QR Type switch
  const handleTypeChange = (newType: QRType) => {
    setActiveType(newType);
    setFormData(getDefaultFormData(newType));
  };

  // Derive payload string & input validation
  const payload = useMemo(() => generateQRPayload(activeType, formData), [activeType, formData]);
  const validation = useMemo(() => validateQRInput(activeType, formData), [activeType, formData]);

  // Derive scan reliability score
  const reliability = useMemo(
    () => evaluateScanReliability(payload, style),
    [payload, style]
  );

  // Save to history helper
  const handleSaveToHistory = (previewDataUrl?: string) => {
    if (!payload || !validation.isValid) return;

    let title = 'QR Code';
    if (activeType === 'url') title = (formData as any).url || 'Website URL';
    else if (activeType === 'text') title = (formData as any).text?.substring(0, 25) || 'Plain Text';
    else if (activeType === 'email') title = (formData as any).email || 'Email Address';
    else if (activeType === 'phone') title = (formData as any).phone || 'Phone Number';
    else if (activeType === 'wifi') title = `Wi-Fi: ${(formData as any).ssid}` || 'Wi-Fi Network';

    const saved = saveToHistory({
      title,
      type: activeType,
      rawPayload: payload,
      formData,
      style,
      previewDataUrl,
    });

    setHistory(prev => [saved, ...prev.filter(h => h.id !== saved.id)]);
  };

  const handleRestoreFromHistory = (item: HistoryItem) => {
    setActiveType(item.type);
    setFormData(item.formData);
    setStyle(item.style);
    setIsCustomizing(true);
  };

  const handleDeleteHistory = (id: string) => {
    const updated = removeFromHistory(id);
    setHistory(updated);
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all customization settings to default?')) {
      setActiveType('url');
      setFormData(getDefaultFormData('url'));
      setStyle(DEFAULT_STYLE);
    }
  };

  const handleApplyPreset = (presetStyle: Partial<QRStyleOptions>) => {
    setStyle(prev => ({
      ...prev,
      ...presetStyle,
      gradient: presetStyle.gradient
        ? { ...prev.gradient, ...presetStyle.gradient }
        : prev.gradient,
    }));
  };

  return (
    <div className="app-layout">
      <Header
        theme={theme}
        onToggleTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onResetDefaults={handleResetDefaults}
      />

      <main className="main-content-grid">
        {/* Left Column: Preview & Readability Analysis */}
        <aside className="preview-section">
          <div className="sticky-preview-wrapper">
            <ScanReliabilityMeter reliability={reliability} />

            <QRPreview
              payload={payload}
              style={style}
              isValid={validation.isValid}
              onSaveToHistory={handleSaveToHistory}
              isCustomizing={isCustomizing}
              onToggleCustomizer={() => setIsCustomizing(prev => !prev)}
            />
          </div>
        </aside>

        {/* Right Column: Data Input & Customizer */}
        <section className="editor-section">
          {/* 1. Type Selector */}
          <TypeSelector activeType={activeType} onSelectType={handleTypeChange} />

          {/* 2. Dynamic Inputs */}
          <div className="card-panel">
            <FormInputs
              type={activeType}
              formData={formData}
              onChange={setFormData}
              errors={validation.errors}
            />
          </div>

          {/* 3. Customizer Accordion Tabs - Displayed when Customize Design toggle is active */}
          {isCustomizing && (
            <div className="customizer-wrapper-animated">
              <CustomizerTabs
                style={style}
                onChange={updated => setStyle(prev => ({ ...prev, ...updated }))}
                onApplyPreset={handleApplyPreset}
              />
            </div>
          )}
        </section>
      </main>

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onRestore={handleRestoreFromHistory}
        onDelete={handleDeleteHistory}
        onClearAll={handleClearHistory}
      />
    </div>
  );
}

export default App;
