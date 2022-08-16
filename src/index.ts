import { AANode } from './aatree';
import { tr } from './tr';

function* range(
	a: number = 0,
	b: number = Number.MAX_VALUE,
	s: number = 1,
): Iterable<number> {
	for (let i = a; i < b; i += s) {
		yield i;
	}
}

function buildAATree(iter: Iterable<number>): AANode<number, number> {
	let root = AANode.root<number, number>();
	for (const key of iter) {
		root = root.insert(key, key);
	}
	return root;
}

function toTRNode<K, V>(root: AANode<K, V>): tr.Node<K> | null {
	if (root.isNil()) {
		return null;
	}

	return new tr.Node<K>(
		root.key,
		toTRNode(root.getLeft()),
		toTRNode(root.getRight()),
		0,
		0,
		0,
		false);
}

const aaRoot = buildAATree(range(1, 11)),
	trRoot = toTRNode(aaRoot);
console.log(aaRoot, trRoot);

tr.layout(trRoot);
// const tree = new AATree<number, number>();
// for (let i = 1; i <= 10; i++) {
// 	tree.insert(i, i);
// }
// console.log(tree);