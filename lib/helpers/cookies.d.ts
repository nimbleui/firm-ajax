declare type Options = {
    expires?: number;
    path?: string;
    domain?: string;
    secure?: boolean;
};
export declare function setCookie(name: string, value: string, options?: Options): void;
export declare function getCookie(key: string): string;
export declare function removeCookie(name: string): void;
export {};
