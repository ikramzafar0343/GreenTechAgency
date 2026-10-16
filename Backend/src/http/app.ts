import cors from "cors";
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { getAuth } from "../auth/auth.js";
import { getBackendEnv } from "../config/env.js";
import { toErrorBody } from "./errors.js";
import { adminMeRouter } from "../features/admin/routes.js";
import {
  adminBlogRouter,
  publicBlogRouter,
} from "../features/blog/routes.js";
import { adminMediaRouter } from "../features/media/routes.js";
import { publicMediaRouter } from "../features/media/publicServe.js";
import {
  adminPortfolioRouter,
  publicPortfolioRouter,
} from "../features/portfolio/routes.js";
import { publicRedirectsRouter } from "../features/redirects/routes.js";
import {
  adminSectionsRouter,
  publicSectionsRouter,
} from "../features/sections/routes.js";
import {
  adminServicesRouter,
  publicServicesRouter,
} from "../features/services/routes.js";
import { adminSubservicesRouter } from "../features/subservices/routes.js";
import {
  adminEnquiriesRouter,
  publicEnquiriesRouter,
} from "../features/enquiries/routes.js";
import {
  adminFaqRouter,
  publicFaqRouter,
} from "../features/faq/routes.js";
import {
  adminSiteDocumentsRouter,
  publicSiteDocumentsRouter,
} from "../features/siteDocuments/routes.js";
import {
  adminStatsRouter,
  publicStatsRouter,
} from "../features/stats/routes.js";
import {
  adminTestimonialsRouter,
  publicTestimonialsRouter,
} from "../features/testimonials/routes.js";
import { adminOpsRouter } from "../features/ops/routes.js";
import { employeeMeRouter } from "../features/employee/routes.js";

export function createApp() {
  const env = getBackendEnv();
  const app = express();

  app.disable("x-powered-by");

  app.use(
    cors({
      origin: [...env.frontendOrigins],
      credentials: true,
    }),
  );

  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true, service: "greentech-backend" });
  });

  // Better Auth must receive the raw body; mount before express.json().
  app.all("/api/auth/*splat", toNodeHandler(getAuth()));

  // VPS media files (no JSON body).
  app.use("/media", publicMediaRouter);

  app.use(express.json({ limit: "512kb" }));

  app.use("/api/services", publicServicesRouter);
  app.use("/api/blog", publicBlogRouter);
  app.use("/api/portfolio", publicPortfolioRouter);
  app.use("/api/sections", publicSectionsRouter);
  app.use("/api/redirects", publicRedirectsRouter);
  app.use("/api/faq", publicFaqRouter);
  app.use("/api/testimonials", publicTestimonialsRouter);
  app.use("/api/stats", publicStatsRouter);
  app.use("/api/site", publicSiteDocumentsRouter);
  app.use("/api/contact", publicEnquiriesRouter);

  app.use("/api/admin", adminMeRouter);
  app.use("/api/admin/services", adminServicesRouter);
  app.use("/api/admin/subservices", adminSubservicesRouter);
  app.use("/api/admin/blog", adminBlogRouter);
  app.use("/api/admin/portfolio", adminPortfolioRouter);
  app.use("/api/admin/sections", adminSectionsRouter);
  app.use("/api/admin/media", adminMediaRouter);
  app.use("/api/admin/faq", adminFaqRouter);
  app.use("/api/admin/testimonials", adminTestimonialsRouter);
  app.use("/api/admin/stats", adminStatsRouter);
  app.use("/api/admin/site", adminSiteDocumentsRouter);
  app.use("/api/admin/enquiries", adminEnquiriesRouter);
  app.use("/api/admin/ops", adminOpsRouter);
  app.use("/api/employee", employeeMeRouter);

  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      const { status, body } = toErrorBody(err);
      res.status(status).json(body);
    },
  );

  return app;
}
