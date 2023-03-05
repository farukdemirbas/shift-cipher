import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CipherService {
    private ignoredCharacters = ['\n'];
    private referenceFreqMap: Map<number, number> = new Map();

    private missPenalty = 10;

    constructor() { }

    public setReferenceFreqMap(freqMap: Map<number, number>) {
        this.referenceFreqMap = freqMap;
    }

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

    public decipher(txt: string, freqMap?: Map<number, number>, minK = -400, maxK = 400): string {
        freqMap ??= this.referenceFreqMap;
        const errorMap = new Map<number, number>();

        console.log(txt.substring(10));
        console.log(freqMap);

        // Scan for every K candidate in the given range, and store the error.
        for (let k = minK; k < maxK + 1; k++) {
            const candidateSource = this.cipher(txt, k);
            const candidateFreqMap = this.freqAnalysis(candidateSource);
            const error: number = this.getFreqError(candidateFreqMap, freqMap);
            errorMap.set(k, error);
        }

        // Return by ciphering with whichever key has the lowest error.
        const sortedMap = new Map([...errorMap.entries()].sort((a, b) => a[1] - b[1]));
        const key = sortedMap.keys().next().value;
        const result = this.cipher(txt, key);

        console.log([...sortedMap.values()]);

        return result;
    }

    private getFreqError(candidate: Map<number, number>, goal: Map<number, number>): number {
        let score = 0;

        // Take union of all keys.
        const allKeys = new Set([...candidate.keys(), ...goal.keys()]);

        for (const key of allKeys) {
            let diff = Math.abs((goal.get(key) ?? 0) - (candidate.get(key) ?? 0));
            if (!candidate.has(key) || !goal.has(key)) {
                diff *= this.missPenalty;
            }
            score += diff;
        }

        return score;
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
