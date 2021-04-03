
export class linkedListNode<T> {
	public data: T;
	public next: linkedListNode<T> | null;

	constructor (data: T, next: linkedListNode<T> | null = null) {
		this.data = data;
		this.next = next;
	}

}

export class linkedList<T> {
	public head: linkedListNode<T> | null = null;
	public tail: linkedListNode<T> | null = null;
	public size: number = 0;

	public push (value: T): boolean {
		if (!this.tail) return false;

		const tmp = this.tail;
		this.tail = new linkedListNode(value);
		tmp.next = this.tail;
		this.size++;

		return true;
	}

	public pop (): T | null {
		if(!this.head) return null;

		const tmpValue = this.head.data;
		this.head = this.head.next;
		this.size--;

		return tmpValue;
	}

	public isEmpty (): boolean {
		return !this.head;
	}

}

export default linkedList;
