export function getDirectImageUrl(url) {
  if (!url) return '';
  // Support various GDrive formats: /file/d/ID/view, /open?id=ID, etc
  const driveRegex = /drive\.google\.com\/.*(?:id=|d\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    // Thumbnail endpoint is often much more reliable for embedding images from Google Drive
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
  }
  return url;
}
