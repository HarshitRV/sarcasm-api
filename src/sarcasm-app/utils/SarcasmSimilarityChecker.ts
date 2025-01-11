import natural from "natural";

export default class SarcasmSimilarityChecker {
    public threshold: number;

    constructor(threshold: number = 0.60) {
        this.threshold = threshold;
    }

    private normalizeString = (str: string): string => {
        return str.toLowerCase().trim();
    };

    public checkSimilarity = (sarcasmA: string, sarcasmB: string): number => {
        const jaroWinklerDistance = natural.JaroWinklerDistance(this.normalizeString(sarcasmA), this.normalizeString(sarcasmB));

        return jaroWinklerDistance;
    }

    public isSimilar = (commentA: string, commentB: string): boolean => {
        const similarityScore = this.checkSimilarity(commentA, commentB).toFixed(2);

        const result = Number(similarityScore) >= this.threshold;

        console.log(':::SarcasmSimilarityChecker:::isSimilar:::');
        console.log(JSON.stringify({
            commentA,
            commentB,
            similarityScore,
            result
        }, null, 2));

        return result;
    }

    public checkSimilarSarcasms = (newSarcasm: string, existingSarcasms: string[]): {
        hasSimilarSarcasms: boolean;
        similarSarcasms: string[];
    } => {
        const similarSarcasms: string[] = [];

        existingSarcasms.forEach((sarcasm) => {
            if (this.isSimilar(newSarcasm, sarcasm)) {
                similarSarcasms.push(sarcasm);
            }
        });

        return {
            hasSimilarSarcasms: similarSarcasms.length > 0,
            similarSarcasms
        }
    };
}