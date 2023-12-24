export type HashNode = {
    key: Object,
    value: Object | null | undefined,
    next?: HashNode,
}

export class LinkedList {
    private length: number
    public head?: HashNode
    public tail?: HashNode

    constructor() {
        this.length = 0
        this.head = this.tail = undefined
    }

    public append(key: Object | undefined, value: Object | null | undefined): void {
        const node = {key: key, value: value, next: undefined} as HashNode
        this.length++

        if (!this.tail) {
            this.head = this.tail = node
            return
        }

        this.tail.next = node
        this.tail = node
    }

    public removeFirst(): Object | null | undefined {
        if (!this.head) {
            console.log("list is empty.")
            return
        }

        return this.removeNode(this.head)
    }

    public removeAt(index: number): Object | null | undefined {
        const node = this.getAt(index)

        if(!node) {
            return undefined
        }

        return this.removeNode(node, index)
    }

    public removeAll(): void {
        let curr = this.head
        while(curr) {
            this.removeFirst()
            curr = curr?.next
        }
    }

    private removeNode(node: HashNode | undefined, index = -1): Object | null | undefined {
        this.length--
        if (this.length === 0) {
            const value = this.head?.value
            this.head = this.tail = undefined
            return value
        }
        
        if (this.head === node) {
            this.head = node?.next
            node = undefined
        } else if (this.tail === node) {
            let prev = this.getAt(this.length - 1) as HashNode
            prev.next = undefined
            this.tail = prev
        } else {
            let prev = this.getAt(index - 1) as HashNode
            prev.next = node?.next
        }

        return node?.value
    }

    public contains(key: Object | undefined): HashNode | undefined {
        let curr = this.head
        for (let i = 0; i < this.length; i++) {
            if (key === curr?.key) {
                return curr
            }
            curr = curr?.next
        }

        return undefined
    }

    public getLength(): number {
        return this.length
    }

    private getAt(index: number): HashNode | undefined {
        if (index < 0 || index > this.length - 1) {
            return undefined
        }

        let curr = this.head
        for (let i = 0; curr && i < index; i++) {
            curr = curr.next
        }
        return curr
    }
}