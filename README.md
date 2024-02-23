# Multi-Type Static Dictionary based on HashTable in TypeScript #

## About this project ##

This is my fourth study project in A&DS course, where I've decided to create an Open-Addressing and Closed-Addressing Dictionary on TypeScript and test them out.
I've measured the insertion speed of Dictionary compared to AVL tree and also tested some different hashing functions.

## Dictionary ##

Dictionary elements can be absolutely everything, key and value are Objects, so you can put almost everything in them. ***But I think it's not very safe...***
I've included A linked list from my previous project to implement Closed-Addressing Dict. You can check it [Here](https://github.com/kuromii5/Doubly-Linked_List)
The pair is represented as "Item" class, where you can see 3 fields - key, value, occupied. The third says about existing pair in dictionary slot.

Both dictionaries have the next methods:

* insert - inserts element in dictionary
* get - gets element by key
* search - searches element by key
* remove - removes element by key
* clear - removes all pairs in dictionary
* items - returns list of pairs

## Comparing and testing hashing functions ##

In main.ts file we are testing our dictionaries. I have some functions to fill them with random data (strings and numbers), function to count collisions (to compare hashing functions).
After all measurements we are exporting our results to .xlsx files.
There are hashing functions implemented:

* murmurhash
* simpleHash (simple custom hashing function)
* crc32

To compare the execution speed of insert/delete functions I used my previous projects and chose AVL tree. You can find original project [Here](https://github.com/kuromii5/Binary_Trees)

## Known Issues ##
***honestly it's unknown***
I've noticed that I'm not checking the length of dictionary in Closed-Addressing implementation, so it can work wrong, because the dictionary will contain more elements than we can (exceed capacity).
