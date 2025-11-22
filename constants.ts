import { ReferralTier } from './types';

export const ACTIVATION_FEE = 300;
export const SALARY_TARGET = 3000; // Internal logic target
export const SALARY_AMOUNT = 60000;

// The algorithm defined: 80, 35, 25, 15, 10, 3...
export const REFERRAL_STRUCTURE: ReferralTier[] = [
  { level: 1, amount: 80, description: "Direct Referral" },
  { level: 2, amount: 35, description: "Generation 2" },
  { level: 3, amount: 25, description: "Generation 3" },
  { level: 4, amount: 15, description: "Generation 4" },
  { level: 5, amount: 10, description: "Generation 5" },
];

// Generate levels 6-15 (3 Taka)
for (let i = 6; i <= 15; i++) {
  REFERRAL_STRUCTURE.push({
    level: i,
    amount: 3,
    description: `Generation ${i}`
  });
}

// Generate levels 16-35 (2 Taka)
for (let i = 16; i <= 35; i++) {
  REFERRAL_STRUCTURE.push({
    level: i,
    amount: 2,
    description: `Generation ${i}`
  });
}