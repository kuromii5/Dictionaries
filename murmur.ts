export function murmurhash(key: string, seed: number): number {
    let remainder: number,
        bytes: number,
        h1: number,
        h1b: number,
        c1: number,
        c2: number,
        k1: number;

    // Calculate the number of remaining characters when divided by 4
    remainder = key.length & 3;

    // Calculate the number of full 4-byte blocks
    bytes = key.length - remainder;

    // Initialize hash values and constants
    h1 = seed;
    c1 = 0xcc9e2d51;
    c2 = 0x1b873593;

    let i = 0;

    // Process each 4-byte block in the key
    while (i < bytes) {
        // Extract a 4-byte block from the key (32-bit integer)
        k1 =
			// & 0xff to get least signigicant byte
            ((key.charCodeAt(i) & 0xff)) |
            ((key.charCodeAt(++i) & 0xff) << 8) |
            ((key.charCodeAt(++i) & 0xff) << 16) |
            ((key.charCodeAt(++i) & 0xff) << 24);
        ++i;

        // Perform bitwise operations to mix the bits of the block
        k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

        // Mix the block hash into the main hash
        h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
        h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
        h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }

    // Process the remaining characters in the key
    k1 = 0;

    switch (remainder) {
        case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
        case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
        case 1: k1 ^= (key.charCodeAt(i) & 0xff);
            // Perform bitwise operations to mix the bits of the remaining block
            k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;

            // Mix the remaining block hash into the main hash
            h1 ^= k1;
    }

    // Finalization steps to ensure a well-distributed hash value
    h1 ^= key.length;
    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= h1 >>> 16;

    // Ensure the result is an unsigned 32-bit integer
    return h1 >>> 0;
}