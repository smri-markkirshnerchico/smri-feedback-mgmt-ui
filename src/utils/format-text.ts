export function fTextNullable(text: string|null) {
  return text?.trim() ? text : null;
}