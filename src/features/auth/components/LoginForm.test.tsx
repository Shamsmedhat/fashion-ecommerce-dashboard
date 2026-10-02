// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DEMO_CREDENTIALS } from "@/config/constants";
import i18n from "@/i18n";
import { LoginForm } from "./LoginForm";

const { login } = vi.hoisted(() => ({ login: vi.fn() }));

vi.mock("../hooks/use-login", () => ({
  useLogin: () => ({ isPending: false, login }),
}));

beforeEach(() => {
  login.mockClear();
});

describe("LoginForm", () => {
  it("opens pre-filled with the demo account so a reviewer can sign in directly", async () => {
    render(<LoginForm />);

    await userEvent.click(screen.getByRole("button", { name: i18n.t("login-submit") }));

    expect(login).toHaveBeenCalledWith(DEMO_CREDENTIALS);
  });

  it("does not submit without a password", async () => {
    render(<LoginForm />);

    await userEvent.clear(screen.getByLabelText(i18n.t("login-password-label")));
    await userEvent.click(screen.getByRole("button", { name: i18n.t("login-submit") }));

    expect(login).not.toHaveBeenCalled();
    expect(await screen.findByText(i18n.t("validation-password-required"))).toBeInTheDocument();
  });
});
