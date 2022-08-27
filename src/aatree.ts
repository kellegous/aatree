export class AANode<K, V> {
	private left: AANode<K, V>;
	private right: AANode<K, V>;

	constructor(
		public readonly key: K,
		public readonly val: V,
		private level: number,
		left: AANode<K, V> | null = null,
		right: AANode<K, V> | null = null,
	) {
		this.left = left ?? this;
		this.right = right ?? this;
	}

	getLeft(): AANode<K, V> {
		return this.left;
	}

	getRight(): AANode<K, V> {
		return this.right;
	}

	insert(key: K, val: V): AANode<K, V> {
		if (this.isNil()) {
			return new AANode<K, V>(key, val, 1, NIL, NIL);
		} else if (key < this.key) {
			this.left = this.left.insert(key, val);
		} else if (key > this.key) {
			this.right = this.right.insert(key, val);
		} else {
			// TODO(knorton): fixme
			throw new Error(`key ${key} exists`);
		}
		return this.skew().split();
	}

	isNil(): boolean {
		return this === NIL;
	}

	private skew(): AANode<K, V> {
		if (this.left.level === this.level) {
			const q = this.left;
			this.left = q.right;
			q.right = this;
			return q;
		}
		return this;
	}

	private split(): AANode<K, V> {
		if (this.right.right.level === this.level) {
			const q = this.right;
			this.right = q.left;
			q.left = this;
			q.level++;
			return q;
		}
		return this;
	}

	static root<K, V>(): AANode<K, V> {
		return NIL;
	}
}

const NIL = new AANode<any, any>(null, null, 0);

