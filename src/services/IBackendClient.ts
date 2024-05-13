export interface IBackendClient<T> {

    getAll(): Promise<T[]>;

    getById(id: number): Promise<T | null>;

    post(data: T): Promise<T>;

    put(id: number, data: T): Promise<T>;

    delete(id: number): Promise<void>;
    
}