import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { loginService } from "@/features/auth/services/auth.service";
import { apiFetch } from "@/services/api";
import { useAuthStore } from "@/store/auth.store";
import { AppError } from "@/utils/app-errors";

type FetchInit = { headers: Record<string, string>; body?: unknown; method?: string };

// Builds a minimal Response-like object for the mocked fetch.
function mockFetchResponse(opts: {
  ok?: boolean;
  status?: number;
  statusText?: string;
  json?: () => Promise<unknown>;
}) {
  return {
    ok: opts.ok ?? true,
    status: opts.status ?? 200,
    statusText: opts.statusText ?? "OK",
    json: opts.json ?? (async () => ({ status: "success" })),
  };
}

function lastCallInit(fetchMock: ReturnType<typeof vi.fn>): FetchInit {
  return fetchMock.mock.calls.at(-1)?.[1] as FetchInit;
}

beforeEach(() => {
  useAuthStore.setState({ token: null, user: null });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("apiFetch", () => {
  it("injects the bearer token and JSON content-type for object bodies", async () => {
    useAuthStore.setState({ token: "tok-123" });
    const fetchMock = vi.fn().mockResolvedValue(mockFetchResponse({}));
    vi.stubGlobal("fetch", fetchMock);

    await apiFetch("/users/login", { method: "POST", body: { email: "a@b.com" } });

    const init = lastCallInit(fetchMock);
    expect(init.headers.Authorization).toBe("Bearer tok-123");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.body).toBe(JSON.stringify({ email: "a@b.com" }));
  });

  it("omits the Authorization header when there is no token", async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockFetchResponse({}));
    vi.stubGlobal("fetch", fetchMock);

    await apiFetch("/products");

    const init = lastCallInit(fetchMock);
    expect(init.headers.Authorization).toBeUndefined();
  });

  it("sends FormData as-is without setting a Content-Type", async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockFetchResponse({}));
    vi.stubGlobal("fetch", fetchMock);

    const form = new FormData();
    form.append("name", "shirt");

    await apiFetch("/products", { method: "POST", body: form });

    const init = lastCallInit(fetchMock);
    expect(init.headers["Content-Type"]).toBeUndefined();
    expect(init.body).toBe(form);
  });

  it("returns undefined for 204 No Content responses without parsing JSON", async () => {
    const json = vi.fn(async () => {
      throw new Error("json() should not be called on 204");
    });
    const fetchMock = vi.fn().mockResolvedValue(mockFetchResponse({ status: 204, json }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await apiFetch("/categories/1", { method: "DELETE" });

    expect(result).toBeUndefined();
    expect(json).not.toHaveBeenCalled();
  });

  it("throws an authentication AppError on 401", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      mockFetchResponse({
        ok: false,
        status: 401,
        json: async () => ({ message: "Invalid credentials" }),
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiFetch("/users/login", { method: "POST", body: {} })).rejects.toMatchObject({
      message: "Invalid credentials",
      statusCode: 401,
      type: "authentication",
    });
  });

  // Regression: an expired token used to leave the admin on a dashboard where every request failed.
  it("ends the session when the API rejects the token it was sent", async () => {
    useAuthStore.setState({ token: "expired-token" });
    const fetchMock = vi.fn().mockResolvedValue(
      mockFetchResponse({
        ok: false,
        status: 401,
        json: async () => ({ message: "Your token has expired! Please log in again." }),
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiFetch("/products")).rejects.toMatchObject({ statusCode: 401 });

    expect(useAuthStore.getState().token).toBeNull();
  });

  it("keeps the session on errors that are not about the token", async () => {
    useAuthStore.setState({ token: "tok-123" });
    const fetchMock = vi
      .fn()
      .mockResolvedValue(mockFetchResponse({ ok: false, status: 403, json: async () => ({}) }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiFetch("/products", { method: "POST", body: {} })).rejects.toBeInstanceOf(
      AppError,
    );

    expect(useAuthStore.getState().token).toBe("tok-123");
  });

  it("throws an authorization AppError on 403", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      mockFetchResponse({
        ok: false,
        status: 403,
        json: async () => ({ message: "Forbidden" }),
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const error = await apiFetch("/users/me").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(AppError);
    expect((error as AppError).type).toBe("authorization");
  });
});

describe("loginService", () => {
  it("sends a phone payload when the identifier looks like an Egyptian phone number", async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockFetchResponse({}));
    vi.stubGlobal("fetch", fetchMock);

    await loginService({ identifier: "01012345678", password: "secret" });

    const init = lastCallInit(fetchMock);
    expect(JSON.parse(init.body as string)).toEqual({
      phone: "01012345678",
      password: "secret",
    });
  });

  it("sends an email payload for non-phone identifiers", async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockFetchResponse({}));
    vi.stubGlobal("fetch", fetchMock);

    await loginService({ identifier: "shamsmedhat1@gmail.com", password: "secret" });

    const init = lastCallInit(fetchMock);
    expect(JSON.parse(init.body as string)).toEqual({
      email: "shamsmedhat1@gmail.com",
      password: "secret",
    });
  });
});
