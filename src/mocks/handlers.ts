import { http, HttpResponse } from "msw";

export const handlers = [
  // Basic Health Check
  http.get("/api/health", () => {
    return HttpResponse.json({ status: "ok" });
  }),

  // Auth: Mock User Profile
  http.get("/api/users/profile", () => {
    return HttpResponse.json({
      id: "user-123",
      username: "TestUser",
      email: "test@example.com",
      role: "user",
    });
  }),
];
