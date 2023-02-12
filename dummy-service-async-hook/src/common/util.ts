import crypto from 'crypto';
import { readFileSync } from 'fs';
import { isObject } from 'lodash';
import { IIamToken } from './iam-token/IIamToken';
import { Env } from '../env';
import { createLogger } from "./logger";
//import config from '../../src/dependencyRegistry.json';

const log = createLogger(__filename);
/**
 * @function
 * Get System admin data from iam Jwt token
 * @param {Partial<IIamToken>} iamToken - iam jwt token
 * @returns ISystemAdmin - system admin data
 */
export function getSystemAdminData(iamToken: Partial<IIamToken>): any {
    if (iamToken) {
        return {
            userId: iamToken.uid,
            tenantId: iamToken.zid,
            language: iamToken.language,
            locale: iamToken.locale
        };
    } else {

    }
}

/**
 * @function
 * Create hash from a string
 * @todo replace crypto package, because it's deprecated. Ref: https://www.npmjs.com/package/crypto
 * @param  {string} input - a string
 * @returns string - hash
 */
export function createHash(input: string): string {
    //! crypto package is deprecated. ref: https://www.npmjs.com/package/crypto
    return crypto.createHash('md5').update(input).digest('hex');
}

/**
 * @function
 * get k8s service account token
 * @returns string - k8s service account token
 */
export function getServiceAccount(): string {
    return readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/token', 'utf-8');
}

/**
 * @function
 * trim all irrelevant properties and sort to have consistent object for consistent hash
 * relevantProperties  : list of properties which will be considered while parsing id,type etc
 * relevantObjectNodes : list of nodes which will be considered while parsing example target,usageContext etc
 * @param  {any} inputObject
 * @param  {string[]} relevantProperties
 * @param  {string[]} relevantObjectNodes
 */
export function trimAndSortObject(inputObject: any, relevantProperties: string[], relevantObjectNodes: string[]) {
    let object = JSON.parse(JSON.stringify(inputObject));
    object = parse(object);
    return object;

    function parse(object: any) {
        // sorting is needed to calculate consistent hash, we might have properties in any order in payload
        if (typeof object === 'object' && object && object.length === undefined) { // not an array
            object = Object.fromEntries(
                Object.entries(object).sort());
        }
        let propertyName: keyof typeof object;
        for (propertyName in object) {
            const propertyValue = object[propertyName];
            if (propertyValue === null
                || propertyValue === undefined
                || Object.keys(propertyValue).length === 0) {
                delete object[propertyName];
            }
            if ((!relevantProperties.includes(propertyName) && typeof propertyValue != 'object')) {
                delete object[propertyName];
            }
            if (typeof propertyValue === 'object') {
                if (!relevantObjectNodes.includes(propertyName)) {
                    delete object[propertyName];
                } else {
                    object[propertyName] = parse(propertyValue);
                }
            }
        }
        return object;
    }
}

/**
 * @function
 * remove empty label , labelText , id etc
 * @param  {any} object
 */
export function removeEmptyProperties(object: any) {
    /* */
    parse(object);
    return object;

    function parse(object: any) {
        let propertyName: keyof typeof object;
        for (propertyName in object) {
            const propertyValue = object[propertyName];
            if (!propertyValue) {
                delete object[propertyName];
            }
            if (typeof propertyValue === 'object'
                && propertyValue !== null
                && propertyValue !== undefined) {
                parse(propertyValue);
            }
        }
    }
}

/**
 * Util function to process large loop without blocking node's main and single thread
 * @param  {Array<any>} array - array of data
 * @param  {IFunc} func - executable function for each item in the array
 * @param  {number=1000} batchLimit - batch limit to process no of data in the single execution
 * @returns Promise
 */
interface IFunc {
    (array: Array<any>, index: number): void
}
export function processLargeLoop(array: Array<any>, func: IFunc, batchLimit: number = 1000): Promise<void> {
    let arrIndex = 0;
    const chunk = batchLimit;

    return new Promise((resolve, reject) => {
        const doInChunk = () => {
            let count = chunk;
            while (count && arrIndex < array.length) {
                try {
                    func(array, arrIndex);
                } catch (err) {
                    reject(err);
                }
                arrIndex++;
                count--;
            }
            if (arrIndex < array.length) {
                setTimeout(doInChunk, 0);
            } else {
                resolve();
            }
        };
        doInChunk();
    });
}


/**
 * @function
 * Stringify an object safely by removing cyclic dependency
 * @param  {any} object - an object
 * @returns string - stringify object
 */
export function safeObjectStringify(object: any): string {
    const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key: any, value: any) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return;
                }
                seen.add(value);
            }
            return value;
        };
    };
    if (isObject(object)) {
        return JSON.stringify(object, getCircularReplacer());
    } else {
        return undefined;
    }
}


/**
 * @function
 * parses all keys in dependency config and returns flat list of type + label
 * @returns array of [ { type : label }]
 */
export function getTypes() {
    const typeList: { type: string; label: string; }[] = [];

    return typeList;
}

// parse key and collect all types + labels
function _parseKeyForTypes(element: { type: any; label: any; parent: any; }, listParsed: { type: string; label: string; }[]) {
    const type = element.type;
    const label = element.label;
    listParsed.push({
        type: type,
        label: label
    });
    if (element.parent)
        _parseKeyForTypes(element.parent, listParsed);
}