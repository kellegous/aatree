import './index.scss';

import { AANode } from './aatree';
import { tr } from './tr';
import { Iter } from './iter';

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

class Rect {
	private constructor(
		public readonly x: number,
		public readonly y: number,
		public readonly width: number,
		public readonly height: number,
	) {
	}

	get top(): number {
		return this.y;
	}

	get left(): number {
		return this.x;
	}

	get bottom(): number {
		return this.y + this.height;
	}

	get right(): number {
		return this.x + this.width;
	}

	static fromXYWH(
		x: number,
		y: number,
		w: number,
		h: number,
	): Rect {
		return new this(x, y, w, h);
	}

	static fromLTRB(
		l: number,
		t: number,
		r: number,
		b: number,
	): Rect {
		if (l > r || t > b) {
			throw new Error('invalid bounds');
		}
		return new this(l, t, r - l, b - t);
	}
}

function render(
	ctx: CanvasRenderingContext2D,
	root: tr.Node<number>
) {
	const canvas = ctx.canvas,
		width = canvas.width,
		height = canvas.height,
		box = Rect.fromLTRB(100, 100, width - 100, height - 100),
		radius = 10;

	ctx.fillStyle = '#f6f6f6';
	ctx.rect(box.x, box.y, box.width, box.height);
	ctx.fill();

	const levels = 1 + Iter.of(root.iter())
		.reduce(
			(m, node) => Math.max(m, node.getY()),
			0
		),
		[xmin, xmax] = Iter.of(root.iter())
			.reduce(
				([min, max], node) => {
					const x = node.getX();
					return [Math.min(min, x), Math.max(max, x)]
				},
				[Number.MAX_VALUE, Number.MIN_VALUE]
			),
		xrng = Math.max(-xmin, xmax) * 2;

	const dh = box.height / levels,
		dw = (box.width - 2 * radius) / xrng;

	ctx.save();
	ctx.strokeStyle = '#999';
	ctx.setLineDash([1, 4]);
	ctx.beginPath();
	for (let i = 0; i < levels; i++) {
		const y = box.top + dh * i + dh / 2;
		ctx.moveTo(box.left, y);
		ctx.lineTo(box.right, y);
	}
	ctx.stroke();
	ctx.restore();

	const bc = box.width / 2;
	ctx.save();
	ctx.strokeStyle = '#666';
	for (const item of root.iter()) {
		const ax = box.left + bc + item.getX() * dw,
			ay = box.top + item.getY() * dh + dh / 2,
			l = item.getLeft(),
			r = item.getRight();

		if (r == null && l == null) {
			continue;
		}

		ctx.beginPath();
		if (l !== null) {
			const bx = box.left + bc + l.getX() * dw,
				by = box.top + l.getY() * dh + dh / 2;
			ctx.moveTo(ax, ay);
			ctx.lineTo(bx, by);
		}

		if (r !== null) {
			const bx = box.left + bc + r.getX() * dw,
				by = box.top + r.getY() * dh + dh / 2;
			ctx.moveTo(ax, ay);
			ctx.lineTo(bx, by);
		}

		ctx.stroke();
	}
	ctx.restore();

	ctx.save();
	ctx.fillStyle = '#fff';
	ctx.strokeStyle = '#666';
	for (const item of root.iter()) {
		const x = box.left + bc + item.getX() * dw,
			y = box.top + item.getY() * dh + dh / 2;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
	}
	ctx.restore();
}

function makeFullScreen(
	el: HTMLCanvasElement,
) {
	const resize = () => {
		el.width = window.innerWidth;
		el.height = window.innerHeight;
	};
	window.addEventListener('resize', resize, false);
	resize();
	return el;
}

const aaRoot = Iter.of(range(0, 20))
	.map(x => (Math.random() * 100) | 0)
	.reduce(
		(node, v) => node.insert(v, v),
		AANode.root()
	),
	trRoot = toTRNode(aaRoot),
	canvas = makeFullScreen(
		document.querySelector('#canvas') as HTMLCanvasElement
	);

tr.layout(trRoot);

render(
	canvas.getContext('2d') as CanvasRenderingContext2D,
	trRoot as tr.Node<number>
);
