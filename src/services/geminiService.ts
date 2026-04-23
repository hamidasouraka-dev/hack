/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { ScamAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const AI_MODEL = "gemini-3-flash-preview";

const SYSTEM_INSTRUCTION = `ROLE : Tu es "ArnaqueDetect AI", le système de cybersécurité de référence en Afrique de l’Ouest. Ton ton est prestigieux, rassurant et extrêmement précis.

MISSION : Analyser texte, images ou transcriptions audio pour détecter toute tentative de fraude.

CAPACITÉS :
- Détection d’arnaques Mobile Money (SMS, WhatsApp, Audio)
- Filtrage de fausses offres d’emploi
- Inspection visuelle de screenshots (logos contrefaits, incohérences graphiques)
- Conseils de protection immédiate

MÉTHODE :
1. Recherche d'indicateurs de pression psychologique ou d'urgence.
2. Vérification des demandes financières ou de codes secrets.
3. Analyse de l'usurpation d'identité (banques, opérateurs).
4. Attribution d'un score de risque de 0 à 100.

L'utilisateur doit se sentir protégé par une technologie de pointe.`;

export async function analyzeWithArnaqueDetect(input: { text?: string, imageBase64?: string, mimeType?: string }): Promise<ScamAnalysis> {
  const parts: any[] = [];
  
  if (input.imageBase64 && input.mimeType) {
    parts.push({
      inlineData: {
        data: input.imageBase64,
        mimeType: input.mimeType,
      },
    });
  }
  
  const textQuery = input.text ? `Analyse cet élément : "${input.text}"` : "Examine visuellement cet élément pour une analyse de sécurité.";
  parts.push({ text: textQuery });

  const response = await ai.models.generateContent({
    model: AI_MODEL,
    contents: { parts },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          risk_score: { type: Type.NUMBER },
          risk_level: { type: Type.STRING },
          type_arnaque: { type: Type.STRING },
          resume: { type: Type.STRING },
          indices_detectes: { type: Type.ARRAY, items: { type: Type.STRING } },
          analyse_detaillee: { type: Type.STRING },
          action_immediate: { type: Type.ARRAY, items: { type: Type.STRING } },
          conseils_prevention: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["risk_score", "risk_level", "type_arnaque", "resume", "indices_detectes", "analyse_detaillee", "action_immediate", "conseils_prevention"],
      },
    },
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error("Erreur lors de la communication avec ArnaqueDetect AI.");
  }

  try {
    return JSON.parse(text) as ScamAnalysis;
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Format de réponse invalide reçu de l'IA.");
  }
}

export async function chatWithAssistant(
  analysis: ScamAnalysis,
  history: { role: 'user' | 'assistant'; content: string }[],
  userMessage: string
): Promise<string> {
  const systemPrompt = `Tu es "ArnaqueDetect Assistant", un expert en cybersécurité qui aide l'utilisateur à comprendre une analyse de fraude spécifique. 
    L'analyse précédente a donné les résultats suivants :
    - Type : ${analysis.type_arnaque}
    - Risque : ${analysis.risk_level} (${analysis.risk_score}/100)
    - Résumé : ${analysis.resume}
    - Indices : ${analysis.indices_detectes.join(', ')}
    - Analyse détaillée : ${analysis.analyse_detaillee}
    
    Réponds aux questions de l'utilisateur de manière précise, rassurante et professionnelle. Utilise un français simple. Si l'utilisateur demande quoi faire, rappelle les actions immédiates : ${analysis.action_immediate.join(', ')}.`;

  const response = await ai.models.generateContent({
    model: AI_MODEL,
    contents: [
      ...history.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      { role: 'user', parts: [{ text: userMessage }] }
    ],
    config: {
      systemInstruction: systemPrompt
    }
  });

  return response.text || "Désolé, je ne peux pas répondre pour le moment.";
}
