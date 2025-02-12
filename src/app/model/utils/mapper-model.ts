export class MapperModel<T> {
	_target: any;

	constructor(type: { new(): T; }) {
		this._target = new type();
	}

	map(source) {
		Object.keys(this._target).forEach((key) => {
			const mappedKey = this._target.constructor[key]
			if (mappedKey) {
				this._target[key] = source[mappedKey];
			} else {
				this._target[key] = source[key];
			}
		});
		Object.keys(source).forEach((key) => {
			const targetKeys = Object.keys(this._target);
			if (targetKeys.indexOf(key) === -1) {
				this._target[key] = source[key];
			}
		});
		return this._target;
	}
}
