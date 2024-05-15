export function capitalizeWords(input: string): string {
    return input.replace(/\b\w/g, (char: string) => char.toUpperCase());
}