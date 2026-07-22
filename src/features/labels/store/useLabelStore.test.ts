import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "../../../lib/axios";
import { useLabelStore } from "./useLabelStore";
import type { ITaskLabel } from "../types";

vi.mock("../../../lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const label: ITaskLabel = {
  _id: "label-1",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  user: "user-1",
  name: "Urgent",
  color: "red",
};

const resetLabelStore = () => {
  useLabelStore.setState({
    labelLoading: false,
    error: null,
    labels: [],
    currentLabel: null,
  });
};

describe("useLabelStore", () => {
  beforeEach(() => {
    vi.mocked(axios.get).mockReset();
    vi.mocked(axios.post).mockReset();
    vi.mocked(axios.patch).mockReset();
    vi.mocked(axios.delete).mockReset();
    resetLabelStore();
  });

  it("toggles labelLoading on and off around a successful fetch", async () => {
    let loadingDuringRequest: boolean | undefined;
    vi.mocked(axios.get).mockImplementationOnce(async () => {
      loadingDuringRequest = useLabelStore.getState().labelLoading;
      return { data: { data: [label] } };
    });

    await useLabelStore.getState().getLabels();

    expect(loadingDuringRequest).toBe(true);
    expect(useLabelStore.getState().labelLoading).toBe(false);
    expect(useLabelStore.getState().labels).toEqual([label]);
  });

  it("sets an error message and clears loading when the fetch fails", async () => {
    vi.mocked(axios.get).mockRejectedValueOnce(new Error("Network error"));

    await useLabelStore.getState().getLabels();

    expect(useLabelStore.getState().error).toBe("Network error");
    expect(useLabelStore.getState().labelLoading).toBe(false);
    expect(useLabelStore.getState().labels).toEqual([]);
  });

  it("clears a previous error at the start of the next action", async () => {
    useLabelStore.setState({ error: "Failed to fetch labels" });
    vi.mocked(axios.get).mockResolvedValueOnce({ data: { data: [label] } });

    await useLabelStore.getState().getLabels();

    expect(useLabelStore.getState().error).toBeNull();
  });

  it("prepends a newly created label", async () => {
    useLabelStore.setState({ labels: [label] });
    const newLabel: ITaskLabel = { ...label, _id: "label-2", name: "Low" };
    vi.mocked(axios.post).mockResolvedValueOnce({ data: { data: newLabel } });

    await useLabelStore.getState().createLabel({ name: "Low", color: "blue" });

    expect(useLabelStore.getState().labels).toEqual([newLabel, label]);
  });

  it("removes a label on delete", async () => {
    useLabelStore.setState({ labels: [label] });
    vi.mocked(axios.delete).mockResolvedValueOnce({});

    await useLabelStore.getState().deleteLabel(label._id);

    expect(useLabelStore.getState().labels).toEqual([]);
  });
});
