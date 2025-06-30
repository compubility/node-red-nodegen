export function toTitleCase(input: string): string {
    return input
        // split on any group of spaces, underscores or dashes
        .split(/[\s_-]+/)
        // capitalize each chunk
        .map(word => {
            if (word.length === 0) return "";
            return word[0].toUpperCase() + word.slice(1).toLowerCase();
        })
        // rejoin with spaces, filtering out any empty strings
        .filter(Boolean)
        .join("");
}
