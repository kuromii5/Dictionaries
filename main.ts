import * as XLSX from 'xlsx';
import { CA_Dictionary, Hashtype, OA_Dictionary } from "./dict";
import AVLTree from "./AVL";
import { find } from './TypeBT';
import { measureExecutionTime, generateRandomData, generateStrings } from "./functions";

const startLength = 2000;

function countCollisions(dict: CA_Dictionary): number {
    let count = 0;
    for (let i = 0; i < dict.length; i++) {
        if (dict.buckets[i] && dict.buckets[i].getLength() !== 0) {
            count += (dict.buckets[i].getLength() - 1);
        }
    }

    return count;
}

function main() {
    const OA_results: {length: number, time: number }[] = [];
    const CA_results: {length: number, time: number }[] = [];
    const Tree_results: {length: number, time: number }[] = [];

    const crc_results: {length: number, time: number, collisions: number }[] = [];
    const simple_results: {length: number, time: number, collisions: number }[] = [];
    const murmur_results: {length: number, time: number, collisions: number }[] = [];

    let lengths: number[] = [];
    for (let i = startLength; i <= 50000; i += 2000) lengths.push(i);

    // 1) using different hash functions and measuring insertion time in closed addressing dictionaries
    // 2) inserting elements in open addressing dictionary and avl tree
    // 3) measuring searching time for every element in o.a. dict and c.a. dict
    for (const length of lengths) {

        // 1)

        const randomData = generateStrings(length);
        const randomNumbers = generateRandomData(length);

        const ca_dict_crc = new CA_Dictionary(length, Hashtype.CRC);
        const ca_dict_simple = new CA_Dictionary(length, Hashtype.Simple);
        const ca_dict_murmur = new CA_Dictionary(length, Hashtype.Murmur);
        
        const crc_insert = measureExecutionTime(() => {
            for (const key of randomData) ca_dict_crc.insert(key, null);
        });
        
        const simple_insert = measureExecutionTime(() => {
            for (const key of randomData) ca_dict_simple.insert(key, null);
        });
        
        const murmur_insert = measureExecutionTime(() => {
            for (const key of randomData) ca_dict_murmur.insert(key, null);
        });
        
        const crc_collisions = countCollisions(ca_dict_crc);
        const simple_collisions = countCollisions(ca_dict_simple);
        const murmur_collisions = countCollisions(ca_dict_murmur);
        
        crc_results.push({length, time: crc_insert, collisions: crc_collisions});
        simple_results.push({length, time: simple_insert, collisions: simple_collisions});
        murmur_results.push({length, time: murmur_insert, collisions: murmur_collisions});
        
        // 2)

        const dict = new OA_Dictionary(length, Hashtype.Murmur);
        const avl = new AVLTree<number>();

        for (const value of randomNumbers) avl.insert(value);
        for (const key of randomData) dict.insert(key, null);

        // 3)

        const oa_search = measureExecutionTime(() => {
            for (const key of randomData) dict.search(key);
        });

        const ca_search = measureExecutionTime(() => {
            for (const key of randomData) ca_dict_murmur.search(key);
        });

        const avl_search = measureExecutionTime(() => {
            for (const value of randomNumbers) find(avl.root, value);
        });

        Tree_results.push({length, time: avl_search});
        OA_results.push({length, time: oa_search});
        CA_results.push({length, time: ca_search});
    }

    const compareHash = XLSX.utils.book_new();
    const crc = XLSX.utils.json_to_sheet(crc_results);
    const simple = XLSX.utils.json_to_sheet(simple_results);
    const murmur = XLSX.utils.json_to_sheet(murmur_results);
    XLSX.utils.book_append_sheet(compareHash, crc, 'CRC');
    XLSX.utils.book_append_sheet(compareHash, simple, 'SimpleHash');
    XLSX.utils.book_append_sheet(compareHash, murmur, 'MurmurHash');
    XLSX.writeFile(compareHash, 'hash_comparing.xlsx');

    const compareSearch = XLSX.utils.book_new();
    const oa = XLSX.utils.json_to_sheet(OA_results);
    const ca = XLSX.utils.json_to_sheet(CA_results);
    const avl = XLSX.utils.json_to_sheet(Tree_results);
    XLSX.utils.book_append_sheet(compareSearch, oa, 'OpenAddressing');
    XLSX.utils.book_append_sheet(compareSearch, ca, 'ClosedAddressing');
    XLSX.utils.book_append_sheet(compareSearch, avl, 'AVLTree');
    XLSX.writeFile(compareSearch, 'search_comparing.xlsx');
}

main();