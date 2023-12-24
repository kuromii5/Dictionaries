import { LinkedList } from "./LinkedList";
import { murmurhash } from "./murmur";
import { crc32 } from "./crc";
import { simpleHash } from "./simpleHash";

export enum Hashtype {
    Simple,
    Murmur,
    CRC,
}

class Item {
    key: Object | null;
    value: Object | null | undefined;
    occupied: boolean;

    constructor(key: Object, value: Object | null | undefined) {
        this.key = key;
        this.value = value;
        this.occupied = true;
    }
}

// Closed addressing
export class CA_Dictionary {
    length: number;
    capacity: number;
    hashType: Hashtype;
    buckets: LinkedList[];

    constructor(capacity: number, hashtype: Hashtype) {
        this.length = 0;
        this.capacity = capacity;
        this.hashType = hashtype;
        this.buckets = new Array(capacity);
        for (var i=0; i < this.capacity; i++){
            this.buckets[i] = new LinkedList();
        }
    }

    private hash(key: Object): number {
        let hashable_key: string = key.toString();
        let hashCode: number;

        switch (this.hashType) {
            case 0:
                hashCode = simpleHash(hashable_key);
                break;
            case 1:
                hashCode = murmurhash(hashable_key, 727);
                break;
            case 2: 
                hashCode = crc32(hashable_key);
                break;
            default: hashCode = 0;
        }

        return hashCode = Math.abs(hashCode % this.capacity);
    }

    public insert(key: Object, value: Object | null | undefined) {
        const hash = this.hash(key);
        const node = this.buckets[hash].contains(key);

        if (node !== undefined) {
            node.value = value;
            return;
        }

        this.buckets[hash].append(key, value);
        this.length++;
    }

    public get(key: Object): Object | null | undefined {
        const hash = this.hash(key);
        return this.buckets[hash].contains(key)?.value;
    }

    public search(key: Object): boolean {
        const value = this.get(key);
        if (value) return true;
        return false;
    }

    public remove(key: Object): Object | null | undefined {
        const hash = this.hash(key);
        let curr = this.buckets[hash]?.head;
        let count = 0;

        while (curr && key !== curr?.key) {
            count++;
            curr = curr?.next;
        }

        if (key === curr?.key) {
            this.length--;
            return this.buckets[hash].removeAt(count);
        }
        return undefined
    }

    public clear() {
        for (let i = 0; i < this.capacity; i++) {
            this.buckets[i].removeAll();
        }
        this.length = 0;
    }

    public items() {
        let items = new Array();
        for (let i = 0; i < this.capacity; i++) {
            let curr = this.buckets[i].head;
            while (curr) {
                items.push([curr.key, curr.value]);
                curr = curr.next;
            }
        }

        return items;
    }
}

// Open addressing (linear probing)
export class OA_Dictionary {
    length: number;
    capacity: number;
    hashType: Hashtype;
    buckets: Item[];

    constructor(capacity: number, hashtype: Hashtype) {
        this.length = 0;
        this.capacity = capacity;
        this.hashType = hashtype;
        this.buckets = [];
    }

    private hash(key: Object): number {
        let hashable_key: string = key.toString();
        let hashCode: number;

        switch (this.hashType) {
            case 0:
                hashCode = simpleHash(hashable_key);
                break;
            case 1:
                hashCode = murmurhash(hashable_key, 727);
                break;
            case 2: 
                hashCode = crc32(hashable_key);
                break;
            default: hashCode = 0;
        }

        return hashCode = Math.abs(hashCode % this.capacity);
    }

    public insert(key: Object, value: Object | null | undefined) {
        let hash = this.hash(key);
        let cell = this.buckets[hash];

        if (this.length === this.capacity) {
            console.log("The table is full!");
            return;
        }

        while (cell?.occupied) {
            if (cell.key === key) {
                cell.value = value;
                return;
            } 

            hash = (hash + 1) % this.capacity;
            cell = this.buckets[hash];
        }

        this.buckets[hash] = new Item(key, value);
        this.length++;
    }

    public get(key: Object): Object | null | undefined {
        let hash = this.hash(key);
        let count = 0;

        while (count < this.capacity) {
            if (this.buckets[hash]?.key === key) {
                return this.buckets[hash]?.value;
            }

            hash = (hash + 1) % this.capacity;
            count++;
        }

        return undefined;
    }

    public search(key: Object): boolean {
        const value = this.get(key);
        if (value) return true
        return false;
    }

    public remove(key: Object): Object | null | undefined {
        let hash = this.hash(key);
        let count = 0;

        while (count < this.capacity) {
            if (this.buckets[hash]?.key === key) {
                return this.delete(hash);
            }
            
            hash = (hash + 1) % this.capacity;
            count++;
        }

        return undefined;
    }

    private delete(pos: number): Object | null | undefined {
        this.length--;
        this.buckets[pos].key = null;
        const value = this.buckets[pos].value;
        this.buckets[pos].value = null;
        this.buckets[pos].occupied = false;
        return value;
    }

    public clear() {
        for (let i = 0; i < this.capacity; i++) {
            this.buckets[i].key = null;
            this.buckets[i].value = null;
            this.buckets[i].occupied = false;
        }
        this.length = 0;
    }

    public items() {
        let items = new Array();
        for (let i = 0; i < this.capacity; i++) {
            if (this.buckets[i].occupied) {
                items.push([this.buckets[i]?.key, this.buckets[i]?.value]);
            }
        }

        return items;
    }
}