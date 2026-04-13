export interface DoseResult {
  calculated: string;
  unit: string;
  note?: string;
  isWeightBased: boolean;
}

/**
 * Parse a dosage string and calculate the actual dose for a given weight.
 * Supports patterns like:
 *   0.15g/10kg
 *   6ml/10kg
 *   4~5mg/10kg ※最大量10mg/10kg
 */
export function calculateDose(dosage: string, weightKg: number): DoseResult | null {
  // Pattern: number(~number)?unit/10kg
  const perKgPattern = /(\d+(?:\.\d+)?)(?:~(\d+(?:\.\d+)?))?([a-zA-Zµμ]+)\/10kg/gi;

  const matches = [...dosage.matchAll(perKgPattern)];
  if (matches.length === 0) return null;

  const results: string[] = [];
  const unit = matches[0][3];

  for (const match of matches) {
    const low = parseFloat(match[1]);
    const high = match[2] ? parseFloat(match[2]) : null;
    const multiplier = weightKg / 10;

    if (high !== null) {
      const calcLow = (low * multiplier).toFixed(2).replace(/\.?0+$/, '');
      const calcHigh = (high * multiplier).toFixed(2).replace(/\.?0+$/, '');
      results.push(`${calcLow}〜${calcHigh}${match[3]}`);
    } else {
      const calc = (low * multiplier).toFixed(2).replace(/\.?0+$/, '');
      results.push(`${calc}${match[3]}`);
    }
  }

  // Extract max dose note
  const maxMatch = dosage.match(/最大(?:量)?(\d+(?:\.\d+)?)([a-zA-Zµμ]+)\/回/);
  const note = maxMatch ? `最大 ${maxMatch[1]}${maxMatch[2]}/回` : undefined;

  return {
    calculated: results.join('／'),
    unit,
    note,
    isWeightBased: true,
  };
}

export function isWeightBasedDosage(dosage: string): boolean {
  return /\d+(?:\.\d+)?[a-zA-Zµμ]+\/10kg/i.test(dosage);
}

export function isAgeBased(dosage: string): boolean {
  return /[歳才]/.test(dosage) && !isWeightBasedDosage(dosage);
}
