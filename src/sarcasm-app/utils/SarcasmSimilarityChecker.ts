import natural from 'natural';

type SimilarityMethod = 'jaro-winkler-distance' | 'native' | 'cosine';

export default class SarcasmSimilarityChecker {
    public thresholdJaroWinklerDistance: number;
    public thresholdNative: number;
    public thresholdCosine: number;
    private similarityMethod: SimilarityMethod;

    constructor({
        similarityMethod = 'native',
        thresholdJaroWinklerDistance = 0.85,
        thresholdNative = 0.6,
        thresholdCosine = 0.8,
    }: {
        similarityMethod?: SimilarityMethod;
        thresholdJaroWinklerDistance?: number;
        thresholdNative?: number;
        thresholdCosine?: number;
    }) {
        this.thresholdJaroWinklerDistance = thresholdJaroWinklerDistance;
        this.thresholdNative = thresholdNative;
        this.similarityMethod = similarityMethod;
        this.thresholdCosine = thresholdCosine;
    }

    private logSimilarity = (
        newSarcasm: string,
        existingSarcasm: string,
        similarityScore: number,
        result: boolean,
    ) => {
        console.log(':::SarcasmSimilarityChecker:::isSimilar:::');
        console.log(
            JSON.stringify(
                {
                    newSarcasm,
                    existingSarcasm,
                    similarityScore,
                    result,
                    method: this.similarityMethod,
                },
                null,
                2,
            ),
        );
    };

    public normalizeString(str: string): string {
        return str.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    public checkSimilarityUsingJaroWinklerDistance = (
        sarcasmA: string,
        sarcasmB: string,
    ): number => {
        const jaroWinklerDistance = natural.JaroWinklerDistance(
            this.normalizeString(sarcasmA),
            this.normalizeString(sarcasmB),
        );

        return Number(jaroWinklerDistance.toFixed(2));
    };

    public checkSimilarityScoreCosine = (
        newSarcasm: string,
        existingSarcasm: string,
    ): number => {
        const cosineSimilarity = new CosineSimilarity();
        return cosineSimilarity.calculateSimilarity(
            newSarcasm,
            existingSarcasm,
        );
    };

    public checkSimilarityScoreNative = (
        newSarcasm: string,
        existingSarcasm: string,
    ): number => {
        const normalizedNewSarcasm = this.normalizeString(newSarcasm);
        const normalizedExistingSarcasm = this.normalizeString(existingSarcasm);

        const minLength = Math.min(
            normalizedNewSarcasm.length,
            normalizedExistingSarcasm.length,
        );

        let matchedCharacterAtSameIndex = 0;
        for (let i = 0; i < minLength; i++) {
            if (normalizedNewSarcasm[i] === normalizedExistingSarcasm[i]) {
                matchedCharacterAtSameIndex++;
            }
        }

        return Number((matchedCharacterAtSameIndex / minLength).toFixed(2));
    };

    public isSimilar = ({
        newSarcasm,
        existingSarcasm,
    }: {
        newSarcasm: string;
        existingSarcasm: string;
    }): boolean => {
        if (this.similarityMethod === 'jaro-winkler-distance') {
            const similarityScore =
                this.checkSimilarityUsingJaroWinklerDistance(
                    newSarcasm,
                    existingSarcasm,
                );
            const result = similarityScore >= this.thresholdJaroWinklerDistance;

            this.logSimilarity(
                newSarcasm,
                existingSarcasm,
                similarityScore,
                result,
            );

            return result;
        }

        if (this.similarityMethod === 'cosine') {
            const similarityScore = this.checkSimilarityScoreCosine(
                newSarcasm,
                existingSarcasm,
            );
            const result = similarityScore >= this.thresholdCosine;

            this.logSimilarity(
                newSarcasm,
                existingSarcasm,
                similarityScore,
                result,
            );

            return result;
        }

        const similarityScore = this.checkSimilarityScoreNative(
            newSarcasm,
            existingSarcasm,
        );
        const result = similarityScore >= this.thresholdNative;

        this.logSimilarity(
            newSarcasm,
            existingSarcasm,
            similarityScore,
            result,
        );

        return result;
    };

    public checkSimilarSarcasms = (
        newSarcasm: string,
        existingSarcasms: string[],
    ): {
        hasSimilarSarcasms: boolean;
        similarSarcasms: string[];
    } => {
        const similarSarcasms: string[] = [];

        existingSarcasms.forEach(existingSarcasm => {
            if (this.isSimilar({ newSarcasm, existingSarcasm })) {
                similarSarcasms.push(existingSarcasm);
            }
        });

        return {
            hasSimilarSarcasms: similarSarcasms.length > 0,
            similarSarcasms,
        };
    };
}

export class CosineSimilarity {
    tokenize(text: string): string[] {
        return text.split(/[^A-Za-z0-9]+/);
    }

    /** Convert strings into arrays (Tokenize to lower case) */
    getTokens(str: string): string[] {
        return this.tokenize(str)
            .filter(function (val) {
                if (!isNaN(+val)) return false;
                else return true;
            })
            .map(word => {
                return word.toLowerCase();
            });
    }

    /** Finds common word frequency */
    computeFrequency(arr: string[], commons: string[]): number[] {
        return commons.map(word => {
            return arr.reduce((f, element) => {
                if (element == word) return (f += 1);
                else return (f += 0);
            }, 0);
        });
    }

    /** Compute vector A.B */
    computeVectorAB(v1: number[], v2: number[]): number {
        return v1.reduce((sum, f, index) => {
            return (sum += f * (v2[index] ?? 0));
        }, 0);
    }

    /** Calculates ||a|| and ||b|| */
    absVector(v: number[]): number {
        return Math.sqrt(
            v.reduce((sum, f) => {
                return (sum += f * f);
            }, 0),
        );
    }

    /** Cosine Similarity */
    similarity(vAB: number, a: number, b: number): number {
        return vAB / (a * b);
    }

    calculateSimilarity(stringA: string, stringB: string): number {
        const arr1 = this.getTokens(stringA);
        const arr2 = this.getTokens(stringB);

        // Define Commons Array //
        const commons = arr1;

        // Word Frequency as Vectors //
        const v1 = this.computeFrequency(arr1, commons);
        const v2 = this.computeFrequency(arr2, commons);

        // Calculate Vector A.B //
        const vAB = this.computeVectorAB(v1, v2);

        // Abs Vector A and B //
        const a = this.absVector(v1);
        const b = this.absVector(v2);

        // Cosine Similarity //
        const similarity = this.similarity(vAB, a, b);
        return Number(similarity.toFixed(2));
    }
}
