import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "../../../lib/axios";
import { useAgentStore } from "./useAgentStore";

vi.mock("../../../lib/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

const resetAgentStore = () => {
  useAgentStore.setState({ loading: false, error: null, messages: [] });
};

describe("useAgentStore sendMessage", () => {
  beforeEach(() => {
    vi.mocked(axios.post).mockReset();
    resetAgentStore();
  });

  it("unwraps a nested { data: { reply } } payload", async () => {
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: { data: { reply: "Here you go" } },
    });

    await useAgentStore.getState().sendMessage("hi");

    const messages = useAgentStore.getState().messages;
    expect(messages[messages.length - 1]).toMatchObject({
      text: "Here you go",
      isUser: false,
    });
  });

  it("falls back to a flat payload when there is no nested data field", async () => {
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: { message: "Flat reply" },
    });

    await useAgentStore.getState().sendMessage("hi");

    const messages = useAgentStore.getState().messages;
    expect(messages[messages.length - 1].text).toBe("Flat reply");
  });

  it("stringifies a non-string reply instead of rendering [object Object]", async () => {
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: { data: { content: { summary: "done" } } },
    });

    await useAgentStore.getState().sendMessage("hi");

    const messages = useAgentStore.getState().messages;
    expect(messages[messages.length - 1].text).toBe(
      JSON.stringify({ summary: "done" }, null, 2),
    );
  });

  it("shows a placeholder when the response has no reply text at all", async () => {
    vi.mocked(axios.post).mockResolvedValueOnce({ data: { data: {} } });

    await useAgentStore.getState().sendMessage("hi");

    const messages = useAgentStore.getState().messages;
    expect(messages[messages.length - 1].text).toBe(
      "I received a response, but it did not include a reply.",
    );
  });

  it("records an error message as an agent reply when the request fails", async () => {
    vi.mocked(axios.post).mockRejectedValueOnce(new Error("Agent unreachable"));

    await useAgentStore.getState().sendMessage("hi");

    const state = useAgentStore.getState();
    expect(state.error).toBe("Agent unreachable");
    expect(state.messages[state.messages.length - 1]).toMatchObject({
      text: "Agent unreachable",
      isUser: false,
    });
  });
});
