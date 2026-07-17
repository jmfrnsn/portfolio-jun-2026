import { ApiError } from "./errors";

export function assertOrnamentAdmin(request: Request) {
  const secret = process.env.ORNAMENT_ADMIN_SECRET?.trim();

  if (!secret) {
    throw new ApiError(
      "ORNAMENT_ADMIN_SECRET is not configured",
      503,
      "MISSING_ENV",
    );
  }

  const authorization = request.headers.get("authorization");
  const bearer = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : null;
  const headerSecret = request.headers.get("x-ornament-admin-secret")?.trim();

  if (bearer === secret || headerSecret === secret) {
    return;
  }

  throw new ApiError("Admin secret required", 401, "UNAUTHORIZED");
}
