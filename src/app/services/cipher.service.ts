import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CipherService {

    private ignoredCharacters = ['\n'];

    constructor() { }

    public cipher(source: string, kValue: number): string {
        let result = "";

        for (const char of source) {
            const newChar = this.cipherChar(char, kValue);
            result = result.concat(newChar);
        }

        return result;
    }

    /**
     * Perform frequency analysis.
     * @param txt Source text to analyze.
     * @param normalized: Whether to normalize the frequencies where the total adds up to 1.
     * @returns A map containing pairs: (charcode -> frequency), sorted descending.
     */
    public freqAnalysis(txt: string, normalized: boolean = true): Map<number, number> {
        let map = new Map<number, number>();
        for (const char of txt) {
            if (this.ignoredCharacters.includes(char)) {
                continue;
            }
            const charCode = char.charCodeAt(0);
            map = this.incrementKey(map, charCode, 1);
        }

        // Sort by values descending.
        const sortedMap = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
        const normalizedMap = this.normalizeFreqMap(sortedMap);
        return normalizedMap;
    }

    public normalizeFreqMap(map: Map<number, number>): Map<number, number> {
        const normalizedMap = new Map<number, number>();
        let sumOfValues = 0;
        const keyCount = map.size;
        for (const pair of map.entries()) {
            sumOfValues += pair[1];
        }
        for (const pair of map.entries()) {
            normalizedMap.set(pair[0], pair[1] / sumOfValues)
        }
        return normalizedMap;
    }

    /**
     * Creates a histogram-like user-friendly string that represents the frequency map.
     * @param map The map to scan.
     * @param symbol The symbol used for each line. Default is '#'.
     * @param horizontalCharLimit No line will exceed this limit.
     * @returns A user-friendly string representation of the given frequency map.
     */
    public freqMapStringify(map: Map<number, number>, symbol: string = '#', horizontalCharLimit: number = 40): string {
        let result = "";

        // Make sure no line exceeds the horizontal space limit.
        // (But use as many symbols as possible, so the chart looks full.)
        const maxValue = map.values().next().value;
        const symbolCount = horizontalCharLimit / maxValue;

        for (const pair of map.entries()) {
            const character = String.fromCharCode(pair[0]);
            const lineLength = Math.floor(pair[1] * symbolCount);
            let line = symbol.repeat(lineLength);
            if (line.length === 0) {
                line = '.';
            }
            result += `${character}: ${line}\n`;
        }

        return result;
    }

    /**
     * Increments the value of the given key by the given amount.
     * @param map The map to operate on.
     * @param key The key.
     */
    private incrementKey(map: Map<any, number>, key: any, incrementStep: number = 1): Map<any, number> {
        if (!map.has(key) || map.get(key) == null) {
            map.set(key, incrementStep);
        }
        else {
            const newVal = map.get(key)! + incrementStep;
            map.set(key, newVal);
        }
        return map;
    }

    private cipherChar(source: string, kValue: number): string {
        const charCode = source.charCodeAt(0);
        const result = String.fromCharCode(charCode + kValue);
        return result;
    }
}
