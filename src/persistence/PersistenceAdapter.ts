export interface PersistenceAdapter {
	load(): Promise<Record<string, string>>;
	save(data: Record<string, string>): Promise<void>;
}

export class LocalStorageAdapter implements PersistenceAdapter {
	private key: string;

	constructor(key: string = 'meld_deck_hotkeys') {
		this.key = key;
	}

	async load(): Promise<Record<string, string>> {
		const stored = localStorage.getItem(this.key);
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch (e) {
				console.error('Failed to parse hotkeys', e);
				return {};
			}
		}
		return {};
	}

	async save(data: Record<string, string>): Promise<void> {
		localStorage.setItem(this.key, JSON.stringify(data));
	}
}
