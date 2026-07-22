import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "@/lib/axios";
import { useSupportStore } from "./useSupportStore";
import type { IFeedback } from "../types";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

const feedback: IFeedback = {
  _id: "feedback-1",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  user: "user-1",
  feedbackType: "bug",
  description: "Something broke",
  status: "open",
};

const resetSupportStore = () => {
  useSupportStore.setState({
    feedbacks: [],
    totalPages: 0,
    loading: false,
    error: null,
    feedback: null,
  });
};

describe("useSupportStore", () => {
  beforeEach(() => {
    vi.mocked(axios.get).mockReset();
    vi.mocked(axios.post).mockReset();
    vi.mocked(axios.patch).mockReset();
    resetSupportStore();
  });

  it("sets loading around updateFeedback and merges the patch into the list", async () => {
    useSupportStore.setState({ feedbacks: [feedback] });
    let loadingDuringRequest: boolean | undefined;
    vi.mocked(axios.patch).mockImplementationOnce(async () => {
      loadingDuringRequest = useSupportStore.getState().loading;
      return {};
    });

    await useSupportStore
      .getState()
      .updateFeedback(feedback._id, { status: "closed" });

    expect(loadingDuringRequest).toBe(true);
    expect(useSupportStore.getState().loading).toBe(false);
    expect(useSupportStore.getState().feedbacks[0]).toMatchObject({
      _id: feedback._id,
      status: "closed",
    });
  });

  it("clears a previous error at the start of the next fetch", async () => {
    useSupportStore.setState({ error: "Failed to fetch feedbacks" });
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: { data: [feedback], totalPages: 1 },
    });

    await useSupportStore.getState().getFeedbacks();

    expect(useSupportStore.getState().error).toBeNull();
    expect(useSupportStore.getState().feedbacks).toEqual([feedback]);
  });

  it("records an error message without toasting when a fetch fails", async () => {
    vi.mocked(axios.get).mockRejectedValueOnce(new Error("Request failed"));

    await useSupportStore.getState().getFeedbacks();

    expect(useSupportStore.getState().error).toBe("Request failed");
    expect(useSupportStore.getState().loading).toBe(false);
  });

  it("returns the fetched feedback from getFeedbackById", async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({ data: { data: feedback } });

    const result = await useSupportStore.getState().getFeedbackById(feedback._id);

    expect(result).toEqual(feedback);
    expect(useSupportStore.getState().feedback).toEqual(feedback);
  });
});
