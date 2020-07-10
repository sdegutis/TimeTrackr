/**
 * @param {string} method
 * @param {string} url
 * @param {object} body
 */
export async function request(method, url, body) {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });
    return await response.json();
  }
  catch (err) {
    return { err };
  }
}
