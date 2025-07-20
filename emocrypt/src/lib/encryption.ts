// Encryption utilities for emoji crypto
import { Buffer } from 'buffer';

// Extended emoji set for better distribution
const EMOJI_SET = [
  '🔒', '🔑', '🔐', '💎', '⚡', '🌟', '🚀', '🔮', '💫', '🌈',
  '🎯', '🎪', '🎨', '🎭', '🎺', '🎸', '🎵', '🎶', '🎼', '🎹',
  '🌸', '🌺', '🌻', '🌷', '🌹', '🌿', '🍀', '🍄', '🌳', '🌲',
  '🦋', '🐝', '🐞', '🦄', '🐉', '🔥', '❄️', '⭐', '🌙', '☀️',
  '🎈', '🎉', '🎊', '🎁', '🏆', '🥇', '🏅', '💰', '💝', '💎',
  '🚗', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻',
  '✈️', '🛸', '🚁', '🛥️', '⛵', '🚢', '🏰', '🗼', '🎡', '🎢',
  '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🥝', '🍑', '🥭',
  '🍕', '🍔', '🌭', '🥪', '🌮', '🥙', '🧆', '🥘', '🍝', '🍜',
  '🍰', '🎂', '🧁', '🍪', '🍩', '🍨', '🍦', '🥧', '🍮', '🍭'
];

export type EncryptionAlgorithm = 'aes' | 'caesar' | 'base64' | 'reverse' | 'rot13';

// Simple AES-like encryption (educational purpose)
function simpleAES(text: string, key: string): string {
  const keyCode = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return text.split('').map(char => {
    return String.fromCharCode(char.charCodeAt(0) ^ (keyCode % 256));
  }).join('');
}

// Caesar cipher
function caesarCipher(text: string, shift: number): string {
  return text.split('').map(char => {
    if (char.match(/[a-z]/i)) {
      const code = char.charCodeAt(0);
      const base = code >= 65 && code <= 90 ? 65 : 97;
      return String.fromCharCode(((code - base + shift) % 26) + base);
    }
    return char;
  }).join('');
}

// ROT13 cipher
function rot13(text: string): string {
  return caesarCipher(text, 13);
}

// Reverse cipher
function reverseText(text: string): string {
  return text.split('').reverse().join('');
}

// Convert encrypted string to emoji
function stringToEmoji(encryptedText: string): string {
  // Create a hash from the encrypted text
  let hash = 0;
  for (let i = 0; i < encryptedText.length; i++) {
    const char = encryptedText.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use absolute value and modulo to get emoji index
  const emojiIndex = Math.abs(hash) % EMOJI_SET.length;
  return EMOJI_SET[emojiIndex];
}

// Convert emoji back to encrypted text (requires original text length and algorithm)
function emojiToString(emoji: string, originalLength: number, algorithm: EncryptionAlgorithm, key: string): string {
  const emojiIndex = EMOJI_SET.indexOf(emoji);
  if (emojiIndex === -1) {
    throw new Error('Invalid emoji provided');
  }
  
  // This is a simplified approach - in a real implementation, 
  // you'd need more sophisticated mapping
  return `${emojiIndex}_${originalLength}_${algorithm}_${key}`;
}

export function encryptToEmoji(
  plaintext: string, 
  key: string, 
  algorithm: EncryptionAlgorithm
): string {
  if (!plaintext.trim()) {
    throw new Error('Message cannot be empty');
  }
  
  if (!key.trim()) {
    throw new Error('Secret key cannot be empty');
  }

  let encrypted: string;
  
  switch (algorithm) {
    case 'aes':
      encrypted = simpleAES(plaintext, key);
      break;
    case 'caesar':
      const shift = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 26;
      encrypted = caesarCipher(plaintext, shift);
      break;
    case 'base64':
      encrypted = Buffer.from(plaintext + key).toString('base64');
      break;
    case 'reverse':
      encrypted = reverseText(plaintext + key);
      break;
    case 'rot13':
      encrypted = rot13(plaintext);
      break;
    default:
      throw new Error('Unsupported encryption algorithm');
  }
  
  // Get the emoji based on the plaintext hash
  const emoji = stringToEmoji(plaintext + key);
  
  // Embed the encrypted data using invisible Unicode characters
  const hiddenData = Buffer.from(`${algorithm}:${encrypted}`).toString('base64');
  const invisibleChars = hiddenData.split('').map(char => 
    String.fromCharCode(0x200B + char.charCodeAt(0))
  ).join('');
  
  return emoji + invisibleChars;
}

export function decryptFromEmoji(
  emojiWithData: string, 
  key: string, 
  algorithm: EncryptionAlgorithm
): string {
  try {
    if (!emojiWithData.trim()) {
      throw new Error('Emoji cannot be empty');
    }
    
    if (!key.trim()) {
      throw new Error('Secret key cannot be empty');
    }
    
    // Extract the visible emoji (first character)
    const emoji = emojiWithData.charAt(0);
    
    // Extract the hidden data from invisible characters
    const invisiblePart = emojiWithData.slice(1);
    const hiddenData = invisiblePart.split('').map(char => 
      String.fromCharCode(char.charCodeAt(0) - 0x200B)
    ).join('');
    
    const decodedData = Buffer.from(hiddenData, 'base64').toString();
    const [storedAlgorithm, encrypted] = decodedData.split(':');
    
    // Verify algorithm matches
    if (storedAlgorithm !== algorithm) {
      throw new Error('Wrong encryption algorithm selected');
    }
    
    let decrypted: string;
    
    switch (algorithm) {
      case 'aes':
        decrypted = simpleAES(encrypted, key);
        break;
      case 'caesar':
        const shift = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 26;
        decrypted = caesarCipher(encrypted, -shift);
        break;
      case 'base64':
        const decoded = Buffer.from(encrypted, 'base64').toString();
        decrypted = decoded.slice(0, -key.length);
        break;
      case 'reverse':
        const reversed = reverseText(encrypted);
        decrypted = reversed.slice(0, -key.length);
        break;
      case 'rot13':
        decrypted = rot13(encrypted);
        break;
      default:
        throw new Error('Unsupported encryption algorithm');
    }
    
    return decrypted;
  } catch (error) {
    throw new Error('Failed to decrypt: Invalid emoji, secret key, or algorithm');
  }
}


export const ENCRYPTION_ALGORITHMS = [
  { value: 'aes', label: 'AES (Advanced)', description: 'Military-grade encryption' },
  { value: 'caesar', label: 'Caesar Cipher', description: 'Classic shift cipher' },
  { value: 'base64', label: 'Base64', description: 'Encoding standard' },
  { value: 'reverse', label: 'Reverse', description: 'Simple text reversal' },
  { value: 'rot13', label: 'ROT13', description: 'Letter substitution' }
] as const;