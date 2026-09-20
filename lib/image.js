export function getDirectImageUrl(url) {
  if (!url) return '';
  // Support various GDrive formats: /file/d/ID/view, /open?id=ID, etc
  const driveRegex = /drive\.google\.com\/.*(?:id=|d\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    // lh3.googleusercontent.com is the most robust CDN endpoint for GDrive images
    // It bypasses the third-party cookie blocks that often cause 403 Forbidden on the /thumbnail endpoint
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return url;
}
