import { writable } from "svelte/store";
import { storage, type StorageItemKey } from "wxt/storage";

export const storage_version = 1;
export const storage_key = `__db_v${storage_version}__`;

export type StorageArea = "local" | "session" | "sync" | "managed";

export class MyStorage<Types extends Record<string, unknown> = Record<string, unknown>> {
    private readonly prefix: string;
    private readonly area: StorageArea;
    constructor(prefix = "", area: StorageArea = "local") {
        this.prefix = prefix;
        this.area = area;
    }
    private get_key<K extends keyof Types & string>(key: K) {
        return `${this.area}:${this.prefix}${key}` as StorageItemKey;
    }
    private parse<K extends keyof Types & string>(value: string | null) {
        try {
            return value === null || value === "" ? undefined : (JSON.parse(value) as Types[K]);
        } catch (error) {
            return;
        }
    }
    private stringify<K extends keyof Types & string>(value: Types[K] | undefined) {
        try {
            return value === undefined ? "" : JSON.stringify(value);
        } catch (error) {
            return "";
        }
    }
    public async get<K extends keyof Types & string>(key: K) {
        return this.parse<K>(await storage.getItem(this.get_key<K>(key)));
    }
    public async get_all() {
        const obj = await storage.snapshot(this.area);
        return obj;
    }
    public async set<K extends keyof Types & string>(key: K, value: Types[K] | undefined) {
        await storage.setItem(this.get_key<K>(key), this.stringify<K>(value));
    }
    public async remove<K extends keyof Types & string>(key: K) {
        await storage.removeItem(this.get_key<K>(key));
    }
    public async remove_all() {
        const obj = await this.get_all();
        await storage.removeItems(Object.keys(obj).map((x) => ({ key: x as StorageItemKey })));
    }
    public on_change<K extends keyof Types & string>(
        key: K,
        cb: (old_value: Types[K] | undefined, new_value: Types[K] | undefined) => void,
    ) {
        const destroy = storage.watch<string>(this.get_key<K>(key), async (n, o) => {
            const old_value = this.parse<K>(o);
            const new_value = this.parse<K>(n);
            cb(old_value, new_value);
        });
        return destroy;
    }
    public store<K extends keyof Types & string>(key: K, initial: Types[K] | undefined = undefined) {
        const store = writable<Types[K] | undefined>();
        (async () => {
            const value = await this.get<K>(key);
            store.set(value === undefined ? initial : value);
            let first = true;
            store.subscribe(async (value) => {
                if (first) {
                    first = false;
                } else {
                    await this.set<K>(key, value);
                }
            });
            this.on_change<K>(key, (_old_value, new_value) => {
                store.set(new_value);
            });
        })();
        return store;
    }
    public $state<K extends keyof Types & string>(key: K, initial?: Types[K]) {
        let state = $state<Types[K] | undefined>();
        let init = false;
        $effect(() => {
            if (init) {
                this.set<K>(key, state);
            }
        });
        const promise = (async () => {
            const value = await this.get<K>(key);
            state = value === undefined ? initial : value;
            init = true;
            this.on_change<K>(key, (_old_value, new_value) => {
                state = new_value;
            });
        })();
        return {
            get value() {
                return state;
            },
            set value(new_value) {
                state = new_value;
            },
            promise,
        };
    }
}
