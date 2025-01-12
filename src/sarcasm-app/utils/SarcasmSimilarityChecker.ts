import natural from "natural";

type SimilarityMethod = 'jaro-winkler-distance' | 'native';

export default class SarcasmSimilarityChecker {
    public thresholdJaroWinklerDistance: number;
    public thresholdNative: number;
    private similarityMethod: SimilarityMethod;

    constructor({ similarityMethod = 'native', thresholdJaroWinklerDistance = 0.85, thresholdNative = 0.60 }: {
        similarityMethod?: SimilarityMethod;
        thresholdJaroWinklerDistance?: number;
        thresholdNative?: number;
    }) {
        this.thresholdJaroWinklerDistance = thresholdJaroWinklerDistance;
        this.thresholdNative = thresholdNative;
        this.similarityMethod = similarityMethod;
    }

    private logSimilarity = (newSarcasm: string, existingSarcasm: string, similarityScore: number, result: boolean) => {
        console.log(':::SarcasmSimilarityChecker:::isSimilar:::');
        console.log(JSON.stringify({
            newSarcasm,
            existingSarcasm,
            similarityScore,
            result,
            method: this.similarityMethod
        }, null, 2));
    }

    public normalizeString(str: string): string {
        return str.toLowerCase().replace(/[^a-z0-9]/g, '');
    };

    public checkSimilarityUsingJaroWinklerDistance = (sarcasmA: string, sarcasmB: string): number => {
        const jaroWinklerDistance = natural.JaroWinklerDistance(this.normalizeString(sarcasmA), this.normalizeString(sarcasmB));

        return Number(jaroWinklerDistance.toFixed(2));
    }

    public checkSimilarityScoreNative = (newSarcasm: string, existingSarcasm: string): number => {
        const normalizedNewSarcasm = this.normalizeString(newSarcasm);
        const normalizedExistingSarcasm = this.normalizeString(existingSarcasm);

        const minLength = Math.min(normalizedNewSarcasm.length, normalizedExistingSarcasm.length);

        let matchedCharacterAtSameIndex = 0;
        for (let i = 0; i < minLength; i++) {
            if (normalizedNewSarcasm[i] === normalizedExistingSarcasm[i]) {
                matchedCharacterAtSameIndex++;
            }
        }

        return Number((matchedCharacterAtSameIndex / minLength).toFixed(2));
    };

    public isSimilar = ({ newSarcasm, existingSarcasm }: { newSarcasm: string, existingSarcasm: string }): boolean => {
        if (this.similarityMethod === 'jaro-winkler-distance') {
            const similarityScore = this.checkSimilarityUsingJaroWinklerDistance(newSarcasm, existingSarcasm);
            const result = similarityScore >= this.thresholdJaroWinklerDistance;

            this.logSimilarity(newSarcasm, existingSarcasm, similarityScore, result);

            return result;
        }

        const similarityScore = this.checkSimilarityScoreNative(newSarcasm, existingSarcasm);
        const result = similarityScore >= this.thresholdNative;

        this.logSimilarity(newSarcasm, existingSarcasm, similarityScore, result);

        return result;
    }

    public checkSimilarSarcasms = (newSarcasm: string, existingSarcasms: string[]): {
        hasSimilarSarcasms: boolean;
        similarSarcasms: string[];
    } => {
        const similarSarcasms: string[] = [];

        existingSarcasms.forEach((existingSarcasm) => {
            if (this.isSimilar({ newSarcasm, existingSarcasm })) {
                similarSarcasms.push(existingSarcasm);
            }
        });

        return {
            hasSimilarSarcasms: similarSarcasms.length > 0,
            similarSarcasms
        }
    };
}