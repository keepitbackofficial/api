const SUPABASE_URL = "https://ljhnlmburyxsbdlxqyxe.supabase.co";

export default {
  async fetch(request) {
    const incomingUrl = new URL(request.url);
    const targetUrl = new URL(SUPABASE_URL);

    targetUrl.pathname = incomingUrl.pathname;
    targetUrl.search = incomingUrl.search;

    const headers = new Headers(request.headers);
    headers.set("host", targetUrl.hostname);

    const response = await fetch(
      new Request(targetUrl.toString(), {
        method: request.method,
        headers,
        body: ["GET", "HEAD"].includes(request.method)
          ? undefined
          : request.body,
        redirect: "manual"
      })
    );

    return response;
  }
};
