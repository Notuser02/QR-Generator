import type { QRStyleOptions, ReliabilityResult } from '../types/qr';

function hexToRGB(hex: string): { r: number; g: number; b: number } | null {
  if (!hex) return null;
  let cleanHex = hex.trim().replace(/^#/, '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  if (cleanHex.length !== 6) return null;
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function calculateContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRGB(color1);
  const rgb2 = hexToRGB(color2);
  if (!rgb1 || !rgb2) return 1;

  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);

  const max = Math.max(lum1, lum2);
  const min = Math.min(lum1, lum2);

  return (max + 0.05) / (min + 0.05);
}

export function evaluateScanReliability(
  payload: string,
  style: QRStyleOptions
): ReliabilityResult {
  const warnings: string[] = [];
  const tips: string[] = [];
  let score = 100;

  if (!payload) {
    return {
      score: 0,
      status: 'critical',
      contrastRatio: 0,
      warnings: ['No data payload supplied.'],
      tips: ['Enter valid URL, text, or content to generate QR code.'],
    };
  }

  const bgColor = style.isTransparentBg ? '#FFFFFF' : style.backgroundColor;

  // 1. Contrast Ratio Analysis (checks primary color & gradient stops)
  let primaryFg = style.foregroundColor;
  let minContrast = calculateContrastRatio(primaryFg, bgColor);

  if (style.gradient.type !== 'none') {
    const contrast1 = calculateContrastRatio(style.gradient.color1, bgColor);
    const contrast2 = calculateContrastRatio(style.gradient.color2, bgColor);
    minContrast = Math.min(contrast1, contrast2);
    primaryFg = style.gradient.color1;
  }

  if (minContrast < 2.5) {
    warnings.push(`Critical contrast ratio (${minContrast.toFixed(1)}:1). Scanners will fail to distinguish modules from background.`);
    score -= 45;
  } else if (minContrast < 4.5) {
    warnings.push(`Low contrast ratio (${minContrast.toFixed(1)}:1). May fail under poor lighting or on budget phone cameras.`);
    score -= 25;
  } else if (minContrast < 7.0) {
    tips.push(`Slightly reduced contrast ratio (${minContrast.toFixed(1)}:1). Increase color contrast for 100% scanning speed.`);
    score -= 5;
  } else {
    tips.push(`High contrast ratio (${minContrast.toFixed(1)}:1). Complies with WCAG ISO scannability standards.`);
  }

  // 2. Corner Eye Finder Pattern Contrast Check
  if (style.useCustomCornerColors) {
    if (style.cornerSquareColor) {
      const frameContrast = calculateContrastRatio(style.cornerSquareColor, bgColor);
      if (frameContrast < 3.0) {
        warnings.push(`Finder pattern frame has very low contrast (${frameContrast.toFixed(1)}:1). Cameras will fail to locate QR boundaries.`);
        score -= 25;
      }
    }
    if (style.cornerDotColor) {
      const centerContrast = calculateContrastRatio(style.cornerDotColor, bgColor);
      if (centerContrast < 3.0) {
        warnings.push(`Finder pattern center dot contrast is poor (${centerContrast.toFixed(1)}:1).`);
        score -= 15;
      }
    }
  }

  // 3. Inverted Colors Check (Light Foreground on Dark Background)
  const fgRgb = hexToRGB(primaryFg);
  const bgRgb = hexToRGB(bgColor);
  if (fgRgb && bgRgb) {
    const fgLum = getRelativeLuminance(fgRgb);
    const bgLum = getRelativeLuminance(bgRgb);
    if (fgLum > bgLum) {
      warnings.push('Inverted color scheme detected (light modules on dark background). Hardware barcode scanners and older mobile apps will fail to scan.');
      score -= 20;
    }
  }

  // 4. Logo Area vs Error Correction Recovery Capacity
  if (style.logoUrl) {
    const eclCapacities: Record<string, number> = { L: 0.07, M: 0.15, Q: 0.25, H: 0.30 };
    const maxCapacity = eclCapacities[style.errorCorrectionLevel] || 0.15;
    // Area ratio ~ logoSize^2
    const logoAreaRatio = style.logoSize * style.logoSize;

    if (logoAreaRatio > maxCapacity) {
      warnings.push(
        `Logo covers ~${Math.round(logoAreaRatio * 100)}% area, which exceeds Error Correction Level '${style.errorCorrectionLevel}' capacity (${Math.round(maxCapacity * 100)}%). Upgrade ECL to 'H' (High).`
      );
      score -= 30;
    } else if (style.errorCorrectionLevel === 'L') {
      warnings.push("Error Correction Level is set to 'L' (7%). Logos require at least 'Q' (25%) or 'H' (30%) to guarantee recovery.");
      score -= 15;
    }
  }

  // 5. Data Density & Matrix Size Check
  if (payload.length > 300) {
    warnings.push(`Extremely dense payload (${payload.length} chars). Modules are tiny; print size must be at least 4x4 cm.`);
    score -= 15;
    tips.push('Use URL shorteners or shorter text to increase dot size and scanning distance.');
  } else if (payload.length > 150) {
    tips.push('Moderate data length. Suitable for standard print sizes (min 2.5 cm).');
  }

  // 6. ISO Quiet Zone / Margin Check
  if (style.margin === 0) {
    warnings.push('Quiet zone margin is 0. ISO 18004 specification requires at least 4 modules of quiet zone to prevent surrounding visual interference.');
    score -= 25;
  } else if (style.margin < 2) {
    tips.push('Margin is narrow. Standard recommendation is 2 to 4 quiet zone modules.');
  }

  // Final Score Clamping & Status Determination
  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  let status: ReliabilityResult['status'] = 'excellent';
  if (finalScore < 50) {
    status = 'critical';
  } else if (finalScore < 75) {
    status = 'warning';
  } else if (finalScore < 90) {
    status = 'good';
  }

  return {
    score: finalScore,
    status,
    contrastRatio: Math.round(minContrast * 10) / 10,
    warnings,
    tips,
  };
}
