// Shared DTOs mirroring backend verification responses — single source for frontend
export type Role = "client" | "freelancer" | "admin";

export type ConnectStatus = {
  id: string;
  email: string | null;
  role: string;
  stripeAccountId: string | null;
  stripeDetailsSubmitted: boolean;
  stripeChargesEnabled: boolean;
  stripePayoutsEnabled: boolean;
  stripeVerified: boolean;
  stripeVerifiedAt: string | null;
};

export type ClientPaymentStatus = {
  id: string;
  email: string | null;
  role: string;
  stripeCustomerId: string | null;
  stripeCardBrand: string | null;
  stripeCardLast4: string | null;
  stripePaymentVerified: boolean;
  stripePaymentVerifiedAt: string | null;
};

// Milestone escrow — amounts stored in cents (dollars in drafts)
export type MilestoneStatus = "unfunded" | "funded" | "submitted" | "approved" | "disputed" | "released";

export type Milestone = {
  id: string;
  title: string;
  description?: string | null;
  amount: number; // cents
  status: MilestoneStatus;
  createdAt: string;
  updatedAt: string;
  deliverables: string[];
  submissionNote?: string | null;
  submittedAt?: string | null;
};

export type MilestoneDraft = { title: string; description?: string; amount: number }; // dollars

export type EscrowQuote = { amount: number; feePercent: number; fee: number; freelancerReceives: number }; // cents

// Ratings — average stars + review count (embedded on lists, fetched for details)
export type RatingSummary = { average: number | null; count: number };

// Public client profile — powers the client details sheet (spend + reviews)
export type UserProfile = {
  id: string;
  name: string | null;
  image: string | null;
  role: Role;
  createdAt: string;
  clientProfile: { company: string | null; bio: string | null; location: string | null; website: string | null } | null;
  stats: { jobsPosted: number; contractsCompleted: number; totalSpent: number };
  rating: RatingSummary;
};

// Chat — contract thread message mirroring backend (text and/or file URLs)
export type ChatMessage = {
  id: string;
  contractId: string;
  senderId: string;
  body: string;
  attachments: string[];
  createdAt: string;
  sender: { id: string; name: string | null; image: string | null };
};

// AI proposal shortlist — fit score + rationale per bid (written by the Inngest job)
export type ProposalRecommendation = {
  proposalId: string;
  score: number; // 0-100
  summary: string;
  strengths: string[];
  concerns: string[];
};

// One job's shortlist — analyzed < total means a background run is still scoring bids
export type RecommendationBoard = {
  jobId: string;
  total: number;
  analyzed: number;
  truncated: boolean;
  model: string | null;
  updatedAt: string | null;
  recommendations: ProposalRecommendation[];
};

// AI cover-letter job — queued in Inngest, polled by the bid form until it is ready
export type ProposalDraftStatus = "none" | "queued" | "ready" | "failed";
export type ProposalDraft = {
  jobId: string;
  status: ProposalDraftStatus;
  coverLetter: string | null;
  model: string | null;
  error: string | null;
  updatedAt: string | null;
};

// Notifications inbox — mirrors backend Notification model (per-user, dropdown source)
export type Notification = {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  entity?: string | null;
  entityId?: string | null;
  data?: unknown;
  read: boolean;
  readAt?: string | null;
  createdAt: string;
};
