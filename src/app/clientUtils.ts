export function toTitleCase(title?: string) {
  if (title !== undefined) {
    return title
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
}
