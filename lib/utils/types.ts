/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */ 

export function isArray(value: unknown): value is Array<unknown> {
    return Array.isArray(value);
}

export function isUndefined(value: unknown): value is undefined {
    return typeof value === 'undefined';
}

export function isObject(value: unknown): value is Record<string, unknown> {
    return !!value && typeof value === 'object' && value.constructor === Object;
}

export function equals(lhs: unknown, rhs: unknown) {
    if (lhs === rhs || (lhs !== lhs && rhs !== rhs)) {
        return true;
    }

    if (!lhs || !rhs) {
        return false;
    }

    if (isArray(lhs) && isArray(rhs)) {
        if (lhs.length !== rhs.length) {
            return false;
        }

        for (let i = 0; i < lhs.length; i++) {
            if (!equals(lhs[i], rhs[i])) {
                return false;
            }
        }

        return true;
    } else if (isObject(lhs) && isObject(rhs)) {
        const lhsKeys = Object.keys(lhs);

        if (lhsKeys.length !== Object.keys(rhs).length) {
            return false;
        }

        for (const key of lhsKeys) {
            if (!equals(lhs[key], rhs[key])) {
                return false;
            }
        }

        return true;
    }

    return false;
}