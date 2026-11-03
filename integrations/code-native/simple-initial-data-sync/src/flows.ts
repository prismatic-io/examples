import { batchFlowTrigger, flow, util } from "@prismatic-io/spectral";
import axios from "axios";
import z from "zod";

const Post = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});
type Post = z.infer<typeof Post>;

const PostArray = z.array(Post);

/**
 * This cursor will be used to keep track of our position in the list of posts across multiple batches.
 * In this example, `startId` represents the numeric ID of the first post in the next batch to fetch,
 * and every post has a unique numeric ID that increments by 1.
 */
type PostCursor = { startId: number };

export const importPosts = flow({
  name: "Import Posts",
  stableKey: "import-posts",
  description:
    "Do an initial data sync of posts from a paginated API in batches and then process new posts sent via webhook in real time",

  /**
   * Process posts by passing them through `onExecution` in batches of 5. This means that `onExecution`
   * will be called once for every 5 posts fetched, and the `params.onTrigger.results.body.data` value
   * in `onExecution` will be an array of 5 posts.
   * The `concurrentBatchLimit` value of 3 means that up to 3 batches (15 posts) can be processed concurrently.
   * If more than 15 posts are fetched, the additional batches will wait until a processing slot is available.
   */
  batchConfig: { batchSize: 5, concurrentBatchLimit: 3 },

  // The `Post` and `PostCursor` types are used to type the `payload` and batch cursor information
  trigger: batchFlowTrigger<Post, PostCursor>({
    /**
     * This function will run whenever a new post is sent to our webhook URL, demonstrating how we can process
     * new data in real time as it's received.
     */
    onTrigger: async (context, payload) => {
      // `payload.paginationState` contains pagination information from the last time this function ran.
      const startId = util.types.toNumber(payload.paginationState?.startId, 0);

      // Get a batch of posts starting from `startId`
      const response = await axios.get<Post[]>(
        "https://jsonplaceholder.typicode.com/posts",
        {
          params: {
            _start: startId,
            _limit: 20, // Fetch 20 posts at a time
          },
        },
      );

      /**
       * Return the 20 posts we fetches and, if we fetched any posts, return a new `paginationState` with an
       * updated `startId` that is 20 higher than the previous `startId`. This will ensure that the next time `onDeploy`
       * runs, it will fetch the next batch of posts.
       * Otherwise, return `null` which will indicate that there are no more posts to fetch and the initial data sync is complete.
       */
      return {
        items: response.data,
        paginationState:
          response.data.length > 0
            ? { startId: startId + response.data.length }
            : null,
      };
    },
  }),

  /**
   * This function will be called regardless of whether the posts being processed came from the initial data sync in `onDeploy` or from the webhook in `onTrigger`.
   * So, it will either receive a batch of 5 posts from the initial data sync or a single post from the webhook, depending on the source of the posts being processed.
   */
  onExecution: async (context, params) => {
    // Ensure that we received an array of posts to process
    const posts = PostArray.parse(params.onTrigger.results.body.data);
    for (const post of posts) {
      // Simply log each post. You can extend this to do more complex processing as needed.
      context.logger.info(`Processing post ${post.id}: ${post.title}`);
    }
    return { data: posts };
  },
});

export default [importPosts];
