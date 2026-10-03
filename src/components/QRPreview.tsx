import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import confetti from 'canvas-confetti';
import type { QRStyleOptions } from '../types/qr';
import { Download, Copy, Check, FileCode, Sparkles, Image as ImageIcon, Sliders } from 'lucide-react';

interface QRPreviewProps {
  payload: string;
  style: QRStyleOptions;
  isValid: boolean;
  onSaveToHistory: (previewDataUrl?: string) => void;
  isCustomizing: boolean;
  onToggleCustomizer: () => void;
}

export const QRPreview: React.FC<QRPreviewProps> = ({
  payload,
  style,
  isValid,
  onSaveToHistory,
  isCustomizing,
  onToggleCustomizer,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  
  const [downloadScale, setDownloadScale] = useState<number>(2); // 2x default (600px)
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Initialize & Update QRCodeStyling instance
  useEffect(() => {
    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling({
        width: style.size,
        height: style.size,
        data: payload || 'https://example.com',
        margin: style.margin,
        qrOptions: {
          errorCorrectionLevel: style.errorCorrectionLevel,
        },
        image: style.logoUrl,
        imageOptions: {
          hideBackgroundDots: style.hideDotsBehindLogo,
          imageSize: style.logoSize,
          margin: style.logoMargin,
        },
        dotsOptions: {
          type: style.dotsType,
          color: style.gradient.type === 'none' ? style.foregroundColor : undefined,
          gradient:
            style.gradient.type !== 'none'
              ? {
                  type: style.gradient.type,
                  rotation: (style.gradient.rotation * Math.PI) / 180,
                  colorStops: [
                    { offset: 0, color: style.gradient.color1 },
                    { offset: 1, color: style.gradient.color2 },
                  ],
                }
              : undefined,
        },
        backgroundOptions: {
          color: style.isTransparentBg ? 'transparent' : style.backgroundColor,
        },
        cornersSquareOptions: {
          type: style.cornerSquareType,
          color: style.useCustomCornerColors
            ? style.cornerSquareColor || style.foregroundColor
            : style.gradient.type === 'none'
            ? style.foregroundColor
            : undefined,
        },
        cornersDotOptions: {
          type: style.cornerDotType,
          color: style.useCustomCornerColors
            ? style.cornerDotColor || style.foregroundColor
            : style.gradient.type === 'none'
            ? style.foregroundColor
            : undefined,
        },
      });

      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        qrCodeRef.current.append(containerRef.current);
      }
    } else {
      qrCodeRef.current.update({
        width: style.size,
        height: style.size,
        data: payload || 'https://example.com',
        margin: style.margin,
        qrOptions: {
          errorCorrectionLevel: style.errorCorrectionLevel,
        },
        image: style.logoUrl,
        imageOptions: {
          hideBackgroundDots: style.hideDotsBehindLogo,
          imageSize: style.logoSize,
          margin: style.logoMargin,
        },
        dotsOptions: {
          type: style.dotsType,
          color: style.gradient.type === 'none' ? style.foregroundColor : undefined,
          gradient:
            style.gradient.type !== 'none'
              ? {
                  type: style.gradient.type,
                  rotation: (style.gradient.rotation * Math.PI) / 180,
                  colorStops: [
                    { offset: 0, color: style.gradient.color1 },
                    { offset: 1, color: style.gradient.color2 },
                  ],
                }
              : undefined,
        },
        backgroundOptions: {
          color: style.isTransparentBg ? 'transparent' : style.backgroundColor,
        },
        cornersSquareOptions: {
          type: style.cornerSquareType,
          color: style.useCustomCornerColors
            ? style.cornerSquareColor || style.foregroundColor
            : style.gradient.type === 'none'
            ? style.foregroundColor
            : undefined,
        },
        cornersDotOptions: {
          type: style.cornerDotType,
          color: style.useCustomCornerColors
            ? style.cornerDotColor || style.foregroundColor
            : style.gradient.type === 'none'
            ? style.foregroundColor
            : undefined,
        },
      });
    }
  }, [payload, style]);

  const fireCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#00F2FE', '#4FACFE', '#F97316', '#10B981'],
    });
  };

  const handleDownloadPNG = async () => {
    if (!qrCodeRef.current || !isValid) return;
    setIsExporting(true);

    try {
      // Temporarily scale up for high-resolution PNG download
      const targetSize = style.size * downloadScale;
      qrCodeRef.current.update({ width: targetSize, height: targetSize });

      await qrCodeRef.current.download({
        name: `qr-code-${Date.now()}`,
        extension: 'png',
      });

      // Revert display size
      qrCodeRef.current.update({ width: style.size, height: style.size });

      // Save to history with thumbnail
      capturePreviewDataUrl(url => onSaveToHistory(url));

      fireCelebration();
    } catch (err) {
      console.error('Download PNG failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadSVG = async () => {
    if (!qrCodeRef.current || !isValid) return;
    setIsExporting(true);

    try {
      await qrCodeRef.current.download({
        name: `qr-code-${Date.now()}`,
        extension: 'svg',
      });

      capturePreviewDataUrl(url => onSaveToHistory(url));
      fireCelebration();
    } catch (err) {
      console.error('Download SVG failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  const capturePreviewDataUrl = (callback: (url: string) => void) => {
    if (!qrCodeRef.current) return;
    qrCodeRef.current.getRawData('png').then(blob => {
      if (blob) {
        const reader = new FileReader();
        reader.onloadend = () => callback(reader.result as string);
        reader.readAsDataURL(blob);
      }
    });
  };

  const handleCopyImage = async () => {
    if (!qrCodeRef.current || !isValid) return;
    try {
      const blob = await qrCodeRef.current.getRawData('png');
      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob as Blob }),
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2500);
      } else {
        alert('Image copying is not supported on this browser. Try downloading PNG instead.');
      }
    } catch (err) {
      console.error('Failed to copy image to clipboard', err);
    }
  };

  const handleCopyText = async () => {
    if (!payload) return;
    try {
      await navigator.clipboard.writeText(payload);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <div className="preview-card-container">
      <div className="preview-card-header">
        <div className="preview-title-box">
          <Sparkles size={18} className="sparkle-icon" />
          <h3 className="preview-card-title">Real-time Preview</h3>
        </div>

        <div className="preview-header-actions">
          <button
            type="button"
            className={`edit-toggle-btn ${isCustomizing ? 'active' : ''}`}
            onClick={onToggleCustomizer}
            title={isCustomizing ? 'Hide design options' : 'Customize presets, colors, shapes, logo & options'}
          >
            <Sliders size={16} />
            <span>{isCustomizing ? 'Hide Options' : 'Customize Design'}</span>
          </button>
          {!isValid && <span className="preview-error-badge">Fix inputs</span>}
        </div>
      </div>

      {/* Canvas Wrapper */}
      <div
        className="qr-canvas-frame"
        style={{
          background: style.isTransparentBg
            ? 'repeating-conic-gradient(#CBD5E1 0% 25%, #F1F5F9 0% 50%) 50% / 16px 16px'
            : style.backgroundColor,
        }}
      >
        <div ref={containerRef} className="qr-canvas-holder" />
      </div>

      {/* Export Action Controls */}
      <div className="export-controls">
        <div className="resolution-selector">
          <label className="resolution-label">Resolution:</label>
          <div className="resolution-buttons">
            <button
              type="button"
              className={`res-btn ${downloadScale === 1 ? 'active' : ''}`}
              onClick={() => setDownloadScale(1)}
            >
              1x ({style.size}px)
            </button>
            <button
              type="button"
              className={`res-btn ${downloadScale === 2 ? 'active' : ''}`}
              onClick={() => setDownloadScale(2)}
            >
              2x ({style.size * 2}px)
            </button>
            <button
              type="button"
              className={`res-btn ${downloadScale === 4 ? 'active' : ''}`}
              onClick={() => setDownloadScale(4)}
            >
              4x ({style.size * 4}px)
            </button>
          </div>
        </div>

        <div className="download-btn-group">
          <button
            type="button"
            className="primary-download-btn"
            onClick={handleDownloadPNG}
            disabled={!isValid || isExporting}
          >
            <Download size={18} />
            <span>Download PNG</span>
          </button>

          <button
            type="button"
            className="secondary-download-btn"
            onClick={handleDownloadSVG}
            disabled={!isValid || isExporting}
            title="Download Vector SVG for High Precision Printing"
          >
            <FileCode size={18} />
            <span>SVG</span>
          </button>
        </div>

        <div className="copy-btn-group">
          <button
            type="button"
            className="action-chip-btn"
            onClick={handleCopyImage}
            disabled={!isValid}
          >
            {copiedImage ? <Check size={16} className="text-success" /> : <ImageIcon size={16} />}
            <span>{copiedImage ? 'Image Copied!' : 'Copy Image'}</span>
          </button>

          <button
            type="button"
            className="action-chip-btn"
            onClick={handleCopyText}
            disabled={!payload}
          >
            {copiedText ? <Check size={16} className="text-success" /> : <Copy size={16} />}
            <span>{copiedText ? 'Payload Copied!' : 'Copy QR Payload'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
