const SUPABASE_URL = "https://ljhnlmburyxsbdlxqyxe.supabase.co";

export default {
  async fetch(request) {
    const incomingUrl = new URL(request.url);
    const targetUrl = new URL(SUPABASE_URL);

    // Preserve the original path and query parameters
    targetUrl.pathname = incomingUrl.pathname;
    targetUrl.search = incomingUrl.search;

    // Forward the request to Supabase
    const headers = new Headers(request.headers);

    // Avoid forwarding headers tied to the custom hostname
    headers.delete("host");

    const proxyRequest = new Request(targetUrl.toString(), {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method)
        ? undefined
        : request.body,
      redirect: "manual"
    });

    const response = await fetch(proxyRequest);

    // Return the Supabase response
    const responseHeaders = new Headers(response.headers);

    // Prevent redirects from exposing the original Supabase hostname
    const location = responseHeaders.get("location");

    if (location) {
      try {
        const redirectUrl = new URL(location);

        if (redirectUrl.hostname === new URL(SUPABASE_URL).hostname) {
          redirectUrl.hostname = incomingUrl.hostname;
          redirectUrl.protocol = incomingUrl.protocol;
          responseHeaders.set("location", redirectUrl.toString());
        }
      } catch {
        // Leave non-URL Location headers unchanged
      }
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  }
};
