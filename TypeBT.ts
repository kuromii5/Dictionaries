export type AVLNode<T> = {
    value: T;
    left: AVLNode<T> | null;
    right: AVLNode<T> | null;
    parent: AVLNode<T> | null;
    height: number;
}

export function find<T, N extends AVLNode<T>>(root: N | null, key: T): N | null {
    let curr = root as N;

    while (curr) {
        if (curr.value === key) {
            return curr;
        } else if (key > curr.value) {
            curr = curr.right as N;
        } else {
            curr = curr.left as N;
        }
    }

    return null;
}