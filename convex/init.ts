import { api } from "./_generated/api";
import { internalMutation, type MutationCtx } from "./_generated/server";

const seedMessages = [
  ["Jonathas", "Bem Vindos ao nosso Chat!!!", 0],

] as const;

export default internalMutation({
  handler: async (ctx: MutationCtx) => {
    // If this project already has a populated database, do nothing
    const anyMessage = await ctx.db.query("messages").first();
    if (anyMessage) return;

    // If not, post each of the seed messages with the given delay
    let totalDelay = 0;
    for (const [author, body, delay] of seedMessages) {
      totalDelay += delay;
      await ctx.scheduler.runAfter(totalDelay, api.messages.send, {
        author,
        body,
      });
    }
  },
});
