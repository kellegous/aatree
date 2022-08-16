export class AANode<K, V> {
	private left: AANode<K, V>;
	private right: AANode<K, V>;

	constructor(
		private level: number,
		left: AANode<K, V> | null,
		right: AANode<K, V> | null,
		public readonly key: K,
		public readonly val: V,
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
			return new AANode<K, V>(1, NIL, NIL, key, val);
		} else if (this.key < key) {
			this.right = this.right.insert(key, val);
		} else {
			this.left = this.left.insert(key, val);
		}
		return this.skew().split();
	}

	isNil(): boolean {
		return this === NIL;
	}

	private skew(): AANode<K, V> {
		let root: AANode<K, V> = this;
		if (root.level !== 0) {
			if (root.left.level === root.level) {
				const save: AANode<K, V> = root;
				root = root.left;
				save.left = root.right;
				root.right = save;
			}
			root.right = root.right.skew();
		}
		return root;
	}

	private split(): AANode<K, V> {
		let root: AANode<K, V> = this;
		if (root.right.level === root.level && root.level !== 0) {
			const save: AANode<K, V> = root;
			root = root.right;
			save.right = root.left;
			root.left = save;
			root.level++;
			root.right = root.right.split();
		}
		return root;
	}

	static root<K, V>(): AANode<K, V> {
		return NIL;
	}
}

const NIL = new AANode<any, any>(0, null, null, null, null);

