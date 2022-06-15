import rateLimit from "express-rate-limit";

// Limit the amount of requests allowed from a single IP
export default function runApiLimitMiddleware(req, res, max?, ms?) {
  const apiLimiter = rateLimit({
    windowMs: ms || 30 * 60 * 1000, // refreshes every 30 min by default
    max: max || 5, // maximum 5 requests
    keyGenerator: function (req) {
      // Since NextJS req doesn't have a req.ip property, we have
      // to extract the IP manually with this code
      return (
        (req.headers["x-real-ip"] as string) ||
        (req.socket.remoteAddress as string)
      );
    },
  });

  return new Promise((resolve, reject) => {
    apiLimiter(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}
