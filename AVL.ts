import { AVLNode } from "./TypeBT";

class AVLTree<T> {
    root: AVLNode<T> | null;

    constructor() {
        this.root = null;
    }

    public insert(key: T): void {
        this.root = this.insertNode(this.root, key);
    }

    public remove(key: T): void {
        this.root = this.removeNode(this.root, key);
    }

    private insertNode(root: AVLNode<T> | null, key: T): AVLNode<T> | null {
        const newNode: AVLNode<T> = {
            value: key,
            left: null,
            right: null,
            parent: null,
            height: 1,
        };
      
        if (root === null)
            return newNode;
      
        if (key < root.value)
            root.left = this.insertNode(root.left, key);
        else if (key > root.value)
            root.right = this.insertNode(root.right, key);
        else 
            return root;
      
        root.height = Math.max(this.getHeight(root.left), this.getHeight(root.right)) + 1;
        const balanceFactor = this.getBalanceFactor(root);
      
        if (balanceFactor > 1) {
            if (key < root.left!.value) {
                return this.rightRotate(root);
            } else {
                root.left = this.leftRotate(root.left);
                return this.rightRotate(root);
            }
        } else if (balanceFactor < -1) {
            if (key > root.right!.value) {
                return this.leftRotate(root);
            } else {
                root.right = this.rightRotate(root.right);
                return this.leftRotate(root);
            }
        }
      
        return root;
    }

    private removeNode(root: AVLNode<T> | null, key: T): AVLNode<T> | null {
        if (root === null) return root;

        if (key < root.value) {
            root.left = this.removeNode(root.left, key);
        } else if (key > root.value) {
            root.right = this.removeNode(root.right, key);
        } else {
            if (root.left === null || root.right === null) {
                root = root.left || root.right;
            } else {
                let temp = this.findSuccessor(root.right); 
                root.value = temp.value; 
                root.right = this.removeNode(root.right, temp!.value); 
            }
        }

        if (root === null) return root;

        root.height = Math.max(this.getHeight(root.left), this.getHeight(root.right)) + 1;
        const balance = this.getBalanceFactor(root);

        if (balance > 1) {
            if (key < root.left!.value) {
                return this.rightRotate(root);
            } else {
                root.left = this.leftRotate(root.left!);
                return this.rightRotate(root);
            }
        }

        if (balance < -1) {
            if (key > root.right!.value) {
                return this.leftRotate(root);
            } else {
                root.right = this.rightRotate(root.right!);
                return this.leftRotate(root.right);
            }
        }

        return root;
    }

    private findSuccessor(node: AVLNode<T>): AVLNode<T> { 
        let curr = node;
        while (curr.left != null) curr = curr.left; 
        return curr; 
    }

    private getHeight(node: AVLNode<T> | null): number {
        if (node === null) return 0;
        return node.height;
    }

    private rightRotate(node: AVLNode<T> | null): AVLNode<T> | null {
        if (node === null) return null;

        const newRoot = node.left;
        if (newRoot) {
            const T2 = newRoot.right;
            newRoot.right = node;
            node.left = T2;
    
            node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
            newRoot.height = Math.max(this.getHeight(newRoot.left), this.getHeight(newRoot.right)) + 1;
        }

        return newRoot;
    }

    private leftRotate(node: AVLNode<T> | null): AVLNode<T> | null {
        if (node === null) return null;

        const newRoot = node.right;
        if (newRoot) {
            const T2 = newRoot.left;
            newRoot.left = node;
            node.right = T2;
    
            node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
            newRoot.height = Math.max(this.getHeight(newRoot.left), this.getHeight(newRoot.right)) + 1;
        }

        return newRoot;
    }


    private getBalanceFactor(node: AVLNode<T> | null): number {
        if (node === null) return 0;
        return this.getHeight(node.left) - this.getHeight(node.right);
    }
}

export default AVLTree;