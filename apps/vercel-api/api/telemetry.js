export default function telemetry(req, res) {
  if (req.method !== "POST") {
    // 405 Method Not Allowed — route exists but only POST is accepted (wrong verb).
    res.status(405).end();
    return;
  }
  req.resume();
  req.on("end", () => {
    // 204 No Content — request succeeded; no body needed (minimal “ping” response).
    res.status(204).end();
  });
}
