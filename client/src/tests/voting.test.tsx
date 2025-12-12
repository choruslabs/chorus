import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Routes, Route } from "react-router";
import ConversationPage from "../app/core/conversation";

import * as api from "../components/api/conversation";
import * as baseApi from "../components/api/base";

describe("Voting behavior", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.restoreAllMocks();
    queryClient = new QueryClient();
  });

  it("disables buttons during vote mutation and fetches new comment", async () => {
    vi.spyOn(api, "getConversationIdByFriendlyName")
      .mockResolvedValue("123");

    vi.spyOn(api, "getConversation")
      .mockResolvedValue({
        id: "123",
        name: "Mock Conversation",
        description: "A mock",
      });

    const getNextCommentMock = vi
      .spyOn(api, "getNextComment")
      .mockResolvedValue({
        comment: { id: "c1", content: "First comment" },
        num_votes: 0
      })

    const createVoteMock = vi
      .spyOn(api, "createVote")
      .mockImplementation(
        () => new Promise((res) => setTimeout(() => res({}), 200)),
      );

    vi.spyOn(baseApi, "getApi").mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/conversation/123"]}>
          <Routes>
            <Route
              path="/conversation/:conversationId"
              element={<ConversationPage />}
              />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
    
    // First comment appears
    expect(await screen.findByText("First comment")).toBeInTheDocument();

    const agreeButton = screen.getByRole("button", { name: "Agree" });
    const disagreeButton = screen.getByRole("button", { name: "Disagree" });
    const skipButton = screen.getByRole("button", { name: "Skip" });

    // buttons initially enabled
    expect(agreeButton).not.toBeDisabled();
    expect(disagreeButton).not.toBeDisabled();
    expect(skipButton).not.toBeDisabled();

    // the next comment fetched should be "Second comment"
    getNextCommentMock.mockResolvedValueOnce({
      comment: { id: "c2", content: "Second comment" },
      num_votes: 0,
    });

    // click a vote button
    fireEvent.click(agreeButton);

    // buttons disabled during mutation
    await waitFor(() => {
      expect(agreeButton).toBeDisabled();
      expect(disagreeButton).toBeDisabled();
      expect(skipButton).toBeDisabled();
    });

    // wait for mutation + refetch
    await waitFor(() => expect(createVoteMock).toHaveBeenCalledOnce());
    await waitFor(() => expect(getNextCommentMock).toHaveBeenCalledTimes(2));

    // second comment appears
    expect(await screen.findByText("Second comment")).toBeInTheDocument();

    // buttons re-enabled
    expect(screen.getByRole("button", { name: "Agree" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Disagree" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Skip" })).not.toBeDisabled();
  });
});
