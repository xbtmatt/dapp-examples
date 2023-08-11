import { HexString } from "aptos";

export type MoveRef = {
    self: HexString;
};

export type ExtendRef = MoveRef;

export type DeleteRef = MoveRef;

export type TableWithLength = {
    inner: {
        handle: HexString;
    };
    length: number;
};

export type Option<T> = {
    vec: Array<T>; // always of size 0 or 1
};

export type SmartTable = {
    buckets: TableWithLength;
    level: number;
    num_buckets: number;
    size: number;
    split_load_threshold: number;
    target_bucket_size: number;
};

export type BigVector = {
    buckets: TableWithLength;
    end_index: number;
    bucket_size: number;
};

export type SmartVector<T> = {
    inline_vector: Array<T>;
    big_vec: Option<BigVector>;
    bucket_size: Option<number>;
    inline_capacity: Option<number>;
};

export type MintConfiguration = {
    collection_name: string;
    collection_addr: HexString;
    max_supply: number;
    token_base_name: string;
    minting_enabled: boolean;
    extend_ref: ExtendRef;
    delete_ref: DeleteRef;
    token_uris: SmartVector<string>;
    metadata_table: SmartTable;
};

export type TokenMetadata = {
    description: Array<string>;
    property_keys: Array<String>;
    property_values: Array<Array<number>>;
    property_types: Array<String>;
};

export type TierInfo = {
    tierName: string;
    openToPublic: boolean;
    price: number;
    startTimestamp: Date;
    endTimestamp: Date;
    perUserLimit: number;
};
