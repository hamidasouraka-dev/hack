/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RiskLevel = 'CRITIQUE' | 'ÉLEVÉ' | 'MOYEN' | 'FAIBLE';

export interface ScamAnalysis {
  risk_score: number;
  risk_level: RiskLevel;
  type_arnaque: string;
  resume: string;
  indices_detectes: string[];
  analyse_detaillee: string;
  action_immediate: string[];
  conseils_prevention: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
