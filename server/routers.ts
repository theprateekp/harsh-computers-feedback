import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getFeedbackRows, insertFeedback } from "./db";

const feedbackInput = z.object({
  customerName: z.string().trim().max(120).optional(),
  customerContact: z.string().trim().max(160).optional(),
  rating: z.number().int().min(1).max(5),
  npsScore: z.number().int().min(0).max(10),
  serviceType: z.string().trim().min(2).max(80),
  comment: z.string().trim().max(2000).optional(),
  tags: z.array(z.string().trim().max(60)).max(8).default([]),
  source: z.enum(["google-qr", "direct", "landing", "counter"]).default("direct"),
  followUp: z.boolean().default(false),
});

export function deriveSentiment(rating: number, comment = "") {
  const positiveWords = ["good", "great", "excellent", "fast", "helpful", "reasonable", "best", "thank", "nice", "quality", "support"];
  const negativeWords = ["bad", "slow", "poor", "expensive", "late", "issue", "problem", "delay", "unhappy", "worst"];
  const normalized = comment.toLowerCase();
  const positiveHits = positiveWords.filter((word) => normalized.includes(word)).length;
  const negativeHits = negativeWords.filter((word) => normalized.includes(word)).length;
  if (negativeHits > positiveHits || rating <= 2) return "negative" as const;
  if (positiveHits > 0 || rating >= 4) return "positive" as const;
  return "neutral" as const;
}

export function getNpsBucket(score: number) {
  if (score >= 9) return "promoters" as const;
  if (score >= 7) return "passives" as const;
  return "detractors" as const;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  feedback: router({
    submit: publicProcedure.input(feedbackInput).mutation(async ({ input }) => {
      const sentiment = deriveSentiment(input.rating, input.comment);
      const id = await insertFeedback({
        ...input,
        customerName: input.customerName || null,
        customerContact: input.customerContact || null,
        comment: input.comment || null,
        sentiment,
        tags: input.tags.join(","),
        followUp: input.followUp ? 1 : 0,
      });
      return { id, sentiment, npsBucket: getNpsBucket(input.npsScore) };
    }),
    summary: protectedProcedure.query(async () => {
      const rows = await getFeedbackRows();
      const total = rows.length;
      const avgRating = total ? rows.reduce((sum, row) => sum + row.rating, 0) / total : 0;
      const promoters = rows.filter((row) => row.npsScore >= 9).length;
      const detractors = rows.filter((row) => row.npsScore <= 6).length;
      const nps = total ? Math.round(((promoters - detractors) / total) * 100) : 0;
      const sentiment = {
        positive: rows.filter((row) => row.sentiment === "positive").length,
        neutral: rows.filter((row) => row.sentiment === "neutral").length,
        negative: rows.filter((row) => row.sentiment === "negative").length,
      };
      const tagCounts = rows.flatMap((row) => (row.tags || "").split(",").filter(Boolean)).reduce<Record<string, number>>((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {});
      const serviceCounts = rows.reduce<Record<string, number>>((acc, row) => {
        acc[row.serviceType] = (acc[row.serviceType] || 0) + 1;
        return acc;
      }, {});
      const trend = Array.from({ length: 7 }, (_, index) => {
        const day = new Date();
        day.setHours(0, 0, 0, 0);
        day.setDate(day.getDate() - (6 - index));
        const next = new Date(day);
        next.setDate(next.getDate() + 1);
        const dayRows = rows.filter((row) => row.createdAt >= day && row.createdAt < next);
        return {
          label: day.toLocaleDateString("en-IN", { weekday: "short" }),
          count: dayRows.length,
          rating: dayRows.length ? Number((dayRows.reduce((sum, row) => sum + row.rating, 0) / dayRows.length).toFixed(1)) : 0,
        };
      });
      return {
        total,
        avgRating: Number(avgRating.toFixed(1)),
        nps,
        promoters,
        passives: rows.filter((row) => row.npsScore >= 7 && row.npsScore <= 8).length,
        detractors,
        followUps: rows.filter((row) => row.followUp === 1 && row.status !== "closed").length,
        sentiment,
        tagCounts,
        serviceCounts,
        trend,
        recent: rows.slice(0, 12),
      };
    }),
    exportRows: adminProcedure.query(async () => getFeedbackRows()),
  }),
});

export type AppRouter = typeof appRouter;
