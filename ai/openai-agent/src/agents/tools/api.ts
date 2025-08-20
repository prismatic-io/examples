import { tool } from "@openai/agents";
import { z } from "zod";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

const getCurrentUserInfo = tool({
  name: "get_current_user_info",
  description: "Get the info of the currently logged in user",
  parameters: z.object({}),
  async execute() {
    const response = await fetch(`${API_BASE_URL}/users/1`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.statusText}`);
    }
    return await response.json();
  },
});

const getPosts = tool({
  name: "get_users_posts",
  description: "Get all the posts of the current user",
  parameters: z.object({}),
  async execute() {
    const response = await fetch(`${API_BASE_URL}/posts?userId=1`);
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }
    return await response.json();
  },
});

const getPost = tool({
  name: "get_post",
  description: "Get a specific post by ID",
  parameters: z.object({
    postId: z.number().describe("The ID of the post to retrieve"),
  }),
  async execute({ postId }) {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }
    return await response.json();
  },
});

const createPost = tool({
  name: "create_post",
  description: "Create a new post",
  needsApproval: true,
  parameters: z.object({
    title: z.string().describe("The title of the post"),
    body: z.string().describe("The body content of the post"),
  }),
  async execute({ title, body }) {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      body: JSON.stringify({
        title,
        body,
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to create post: ${response.statusText}`);
    }
    return await response.json();
  },
});

const updatePost = tool({
  name: "update_post",
  description: "Update an existing post",
  needsApproval: true,
  parameters: z.object({
    postId: z.number().describe("The ID of the post to update"),
    title: z.string().describe("The new title of the post"),
    body: z.string().describe("The new body content of the post"),
  }),
  async execute({ postId, title, body }) {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: "PUT",
      body: JSON.stringify({
        id: postId,
        title,
        body,
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to update post: ${response.statusText}`);
    }
    return await response.json();
  },
});

const getPostComments = tool({
  name: "get_post_comments",
  description: "Get all comments for a specific post",
  parameters: z.object({
    postId: z.number().describe("The ID of the post to get comments for"),
  }),
  async execute({ postId }) {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);
    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.statusText}`);
    }
    return await response.json();
  },
});

const apiTools = {
  getCurrentUserInfo,
  getPosts,
  getPost,
  createPost,
  updatePost,
  getPostComments,
};

export default apiTools;
