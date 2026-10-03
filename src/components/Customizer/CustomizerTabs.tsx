import React from 'react';
import type { QRStyleOptions } from '../../types/qr';
import { PresetsTab } from './PresetsTab';
import { ColorsTab } from './ColorsTab';
import { PatternsTab } from './PatternsTab';
import { LogoTab } from './LogoTab';
import { OptionsTab } from './OptionsTab';
import { Sparkles, Palette, Grid, Image, Sliders, type LucideIcon } from 'lucide-react';

interface CustomizerTabsProps {
  style: QRStyleOptions;
  onChange: (updated: Partial<QRStyleOptions>) => void;
  onApplyPreset: (presetStyle: Partial<QRStyleOptions>) => void;
}

type TabId = 'presets' | 'colors' | 'patterns' | 'logo' | 'options';

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'presets', label: 'Presets', icon: Sparkles },
  { id: 'colors', label: 'Colors & Fill', icon: Palette },
  { id: 'patterns', label: 'Shapes & Eyes', icon: Grid },
  { id: 'logo', label: 'Logo Overlay', icon: Image },
  { id: 'options', label: 'Size & ECL', icon: Sliders },
];

export const CustomizerTabs: React.FC<CustomizerTabsProps> = ({
  style,
  onChange,
  onApplyPreset,
}) => {
  const [activeTab, setActiveTab] = React.useState<TabId>('presets');

  return (
    <div className="customizer-card">
      <div className="customizer-tabs-nav">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`customizer-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span className="tab-btn-label">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="customizer-tab-body">
        {activeTab === 'presets' && (
          <PresetsTab currentStyle={style} onApplyPreset={onApplyPreset} />
        )}
        {activeTab === 'colors' && <ColorsTab style={style} onChange={onChange} />}
        {activeTab === 'patterns' && <PatternsTab style={style} onChange={onChange} />}
        {activeTab === 'logo' && <LogoTab style={style} onChange={onChange} />}
        {activeTab === 'options' && <OptionsTab style={style} onChange={onChange} />}
      </div>
    </div>
  );
};
