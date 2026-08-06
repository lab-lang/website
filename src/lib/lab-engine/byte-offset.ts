/**
 * lab-ide-wasm reports spans as UTF-8 byte offsets, but every editor and DOM
 * API works in UTF-16 code units. The playground is edit-capable, so these
 * are real conversions rather than an ASCII-only shortcut.
 */

const encoder = new TextEncoder()

export function utf16IndexToByteOffset(text: string, index: number): number {
  const clamped = Math.max(0, Math.min(index, text.length))
  return encoder.encode(text.slice(0, clamped)).length
}

export function byteOffsetToUtf16Index(text: string, offset: number): number {
  if (offset <= 0) return 0

  // Iterate by code point (not UTF-16 code unit) so a surrogate pair is
  // measured as one character, matching how Rust counts UTF-8 scalar values.
  let byteCount = 0
  let utf16Index = 0
  for (const character of text) {
    if (byteCount >= offset) return utf16Index
    byteCount += encoder.encode(character).length
    utf16Index += character.length
  }
  return text.length
}
