export function simpleHash(key: string): number {
    let hash = 0;
  
    if (key.length === 0) return hash;
  
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
  
    return hash;
}