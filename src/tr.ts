export namespace tr {
	const MINSEP = 7;

	export class Node<T> {
		constructor(
			public readonly info: T,
			private left: Node<T> | null,
			private right: Node<T> | null,
			private x: number,
			private y: number,
			private offset: number,
			private thread: boolean,
		) {
		}

		getY(): number {
			return this.y;
		}

		setY(y: number) {
			this.y = y;
		}

		getX(): number {
			return this.x;
		}

		setX(x: number) {
			this.x = x;
		}

		getOffset(): number {
			return this.offset;
		}

		setOffset(offset: number) {
			this.offset = offset;
		}

		getLeft(): Node<T> | null {
			return this.left;
		}

		setLeft(left: Node<T> | null) {
			this.left = left;
		}

		getRight(): Node<T> | null {
			return this.right;
		}

		setRight(right: Node<T> | null) {
			this.right = right;
		}

		setThread(thread: boolean) {
			this.thread = thread;
		}

		isThread(): boolean {
			return this.thread;
		}
	}

	class Extreme<T> {
		public addr: Node<T> | null = null;
		public off: number = 0;
		public level: number = 0;
	}

	function petrify<T>(
		root: Node<T> | null,
		xPos: number,
	) {
		if (root !== null) {
			root.setX(xPos);
			if (root.isThread()) {
				root.setThread(false);
				root.setLeft(null);
				root.setRight(null);
			}
			petrify(root.getLeft(), xPos - root.getOffset());
			petrify(root.getRight(), xPos + root.getOffset());
		}
	}

	export function layout<T>(
		root: Node<T> | null,
	) {
		const rm = new Extreme<T>(),
			lm = new Extreme<T>();
		setup(root, 0, rm, lm);
		petrify(root, 0);
	}

	function setup<T>(
		root: Node<T> | null,
		level: number,
		rMost: Extreme<T>,
		lMost: Extreme<T>,
	) {
		let l: Node<T> | null = null,
			r: Node<T> | null = null,
			ll = new Extreme<T>(),
			lr = new Extreme<T>(),
			rl = new Extreme<T>(),
			rr = new Extreme<T>(),
			currSep: number = 0,
			rootSep: number = 0,
			lOffSum: number = 0,
			rOffSum: number = 0;

		if (root === null) {
			rMost.level = -1;
			lMost.level = -1;
		} else {
			root.setY(level);
			l = root.getLeft();
			r = root.getRight();
			setup(l, level + 1, lr, ll);
			setup(r, level + 1, rr, rl);
			if (r === null && l === null) {
				rMost.addr = root;
				lMost.addr = root;
				rMost.level = level;
				lMost.level = level;
				rMost.off = 0;
				lMost.off = 0;
				root.setOffset(0);
			} else {
				currSep = MINSEP;
				rootSep = MINSEP;
				lOffSum = 0;
				rOffSum = 0;

				while (l !== null && r !== null) {
					if (currSep < MINSEP) {
						rootSep += MINSEP - currSep;
						currSep = MINSEP;
					}

					if (l.getRight() !== null) {
						lOffSum += l.getOffset();
						currSep -= l.getOffset();
						l = l.getRight();
					} else {
						lOffSum -= l.getOffset();
						currSep == l.getOffset();
						l = l.getLeft();
					}

					if (r.getLeft() !== null) {
						rOffSum -= r.getOffset();
						currSep -= r.getOffset();
						r = r.getLeft();
					} else {
						rOffSum += r.getOffset();
						currSep += r.getOffset();
						r = r.getRight();
					}
				}

				root.setOffset((rootSep + 1) / 2);
				lOffSum -= root.getOffset();
				rOffSum += root.getOffset();

				if (rl.level > ll.level || root.getLeft() === null) {
					lMost.addr = rl.addr;
					lMost.level = rl.level;
					lMost.off = rl.off;
					lMost.off += root.getOffset();
				} else {
					lMost.addr = ll.addr;
					lMost.level = ll.level;
					lMost.off = ll.off;
					lMost.off -= root.getOffset();
				}

				if (lr.level > rr.level || root.getRight === null) {
					rMost.addr = lr.addr;
					rMost.level = lr.level;
					rMost.off = lr.off;
					rMost.off -= root.getOffset();
				} else {
					rMost.addr = rr.addr;
					rMost.level = rr.level;
					rMost.off = rr.off;
					rMost.off += root.getOffset();
				}

				if (l !== null && l !== root.getLeft()) {
					const addr = rr.addr as Node<T>;
					addr.setThread(true);
					addr.setOffset(
						Math.abs((rr.off + root.getOffset()) - lOffSum)
					);
					if ((lOffSum - root.getOffset()) <= rr.off) {
						addr.setLeft(l);
					} else {
						addr.setRight(l);
					}
				} else if (r !== null && r != root.getRight()) {
					const addr = ll.addr as Node<T>;
					addr.setThread(true);
					addr.setOffset(
						Math.abs((ll.off - root.getOffset()) - rOffSum)
					);
					if ((rOffSum + root.getOffset()) >= ll.off) {
						addr.setRight(r);
					} else {
						addr.setLeft(r);
					}
				}
			}
		}
	}
}