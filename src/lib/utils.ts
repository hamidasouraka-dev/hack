/**
 * Utility functions for the ArnaqueDetect application.
 */

/**
 * Removes markdown bold markers (**) from a string.
 */
export function cleanMarkdown(text: string): string {
  if (!text) return "";
  return text.replace(/\*\*/g, "");
}
