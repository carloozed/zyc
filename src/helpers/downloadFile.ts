/**
 * Fetches a file and hands it to the browser as a download under the given
 * name. Cross-origin URLs ignore the `download` attribute, so the blob route
 * is the only way to force a download for those. Falls back to opening the
 * URL in a new tab if the fetch fails (e.g. no CORS headers).
 */
export async function downloadFile(url: string, filename: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(url, '_blank');
  }
}
