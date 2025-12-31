export const toTitleCase = (str = "") => {
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};


export default function formatDate(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB");
}
