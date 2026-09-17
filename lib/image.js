export function getDirectImageUrl(url) {
  if (!url) return '';
  // Jika url adalah link Google Drive Share (view)
  const driveRegex = /drive\.google\.com\/file\/d\/([^\/]+)\/view/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url;
}
