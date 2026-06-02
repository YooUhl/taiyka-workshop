import {
  Megaphone,
  Sheet,
  Sparkles,
  Database,
  Terminal,
  Layers,
  Dumbbell,
  FileCode,
  Palette,
  Telescope,
  MessageCircle,
  Phone,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type ProjectGroup = "client" | "own" | "in-delivery";

export type Project = {
  title: string;
  clientContext: string;
  tagline: string;
  context: string;
  build: string[];
  value: string;
  problem?: string;
  solution?: string;
  results?: string;
  stack: string[];
  status: string;
  group: ProjectGroup;
  icon: LucideIcon;
};

export const PROJECTS: Project[] = [
  {
    title: "Mass Cold Emailing Machine",
    clientContext:
      "Built first as an internal product, then delivered to external clients (Sales rep working for electricity company).",
    tagline:
      "AI cold-email engine and multi-user CRM that personalises every message at scale.",
    context:
      "Sending personalised cold emails at high volume is hard. Most tools either personalise well at low volume, or scale well with generic templates. The middle ground, which is high volume with genuine personalisation per prospect, needs three separate jobs done together: building a clean prospect list, researching and writing each email, and tracking replies in a CRM.",
    build: [
      "Build a prospect database from any target source (region, niche, sector)",
      "Enrich each company with legal data, business classification, and decision-maker information",
      "Find and SMTP-verify email addresses for each identified contact",
      "Research each prospect for personal and company context that supports the message",
      "Draft a personalised cold email per contact, ranked against the decision-maker roles defined for the niche",
      "Multi-user CRM with a kanban outreach board, a draft-review queue, and a funnel and reply-rate dashboard",
      "Sending through standard email infrastructure (personal mailbox or high-volume provider)",
      "Every stage is idempotent, safe to re-run without duplicate sends",
    ],
    value:
      "The system removes the need for three or four separate paid tools (prospecting, email finding, outreach automation, CRM). Each email is written using the full research record of the prospect, not just a first-name swap. Three operators run the whole outbound from one dashboard.",
    stack: [
      "n8n",
      "Apify",
      "Pappers API",
      "Dropcontact API",
      "Perplexity",
      "Claude API",
      "Supabase",
      "Next.js",
      "Gmail API",
      "Instantly.ai",
    ],
    status: "Live. Outreach campaign in progress.",
    group: "own",
    icon: Megaphone,
  },
  {
    title: "Order OPS for Leroy Remuel",
    clientContext:
      "Independent market gardener in New Caledonia, operating across multiple delivery locations.",
    tagline:
      "High-volume customer order app with real-time stock control, waitlist, SMS, and no-show enforcement.",
    problem:
      "The CEO was managing all orders manually in iPhone Notes, and the customer relationship manually through Messenger. With 100+ active customers per week to track this way, the time lost every week was significant.",
    solution: "Real-time customer order management.",
    results:
      "In 30 days, weekly order-management time dropped from 8+ hours to under 1 hour, measured by CEO time logs, with the mental load of tracking pending orders fully offloaded to the system.",
    context:
      "When weekly orders passed 100 customers, paper and spreadsheets stopped scaling. Without a live stock view, over-orders happened often. Customers who didn't show up still occupied delivery slots. At the end of each cycle, the team had no clear picture of what had been prepared, what had been sold, and what was left over.",
    build: [
      "Web app accessible only to the CEO, not to customers",
      "Automatically block orders when an article reaches its quota, and unblock them when a customer cancels",
      "Roll cancelled orders into a waitlist that re-allocates the slot to the next customer",
      "Route deliveries across multiple pickup points with per-customer tracking",
      "Send Messenger DM reminders the day before and the day of delivery, sorted by commune",
      "Track no-shows with a three-strike system that auto-blocks repeat offenders, with admin override and internal notes",
      "Export end-of-cycle accounting (prepared, sold, leftover) to Excel or PDF",
    ],
    value:
      "Over-orders are blocked automatically thanks to a live stock view. When a customer cancels, the slot is offered to the next person on the waitlist. Deliveries are routed across pickup points with per-customer tracking. Reminder SMS go out the day before and the day of delivery, sorted by commune. Repeat no-shows are blocked from booking again. End-of-cycle accounting takes one click instead of an afternoon.",
    stack: ["n8n", "Claude Code", "Supabase", "Facebook Graph API"],
    status: "Delivered.",
    group: "client",
    icon: Sheet,
  },
  {
    title: "Short Form Content Machine for Nuee.ch",
    clientContext:
      "Swiss tourism brand running a short-form video channel that showcases landscapes, residences, and locations across Switzerland.",
    tagline:
      "Photo-to-video pipeline that produces a finished TikTok-ready clip from raw input in under an hour.",
    problem:
      "Producing weekly short-form videos in-house took too many hours, while outsourcing drifted the brand voice and added cost.",
    solution: "One-hour AI video production pipeline.",
    context:
      "Running a regular short-form video channel takes a lot of time, between voiceover recording, video editing, music, and formatting. Doing it in-house every week is heavy. Outsourcing it usually creates two new problems: cost, and a voice that drifts away from the brand.",
    build: [
      "Watch a shared folder for new picture sets and narrative text dropped in by the client",
      "Generate an AI voiceover from the narrative text, using a cloned version of the client's own voice",
      "Turn the supplied pictures into short video clips using AI image-to-video generation",
      "Compose the final clip programmatically from the generated video segments, with cuts, transitions, and on-screen text",
      "Store the source files and final assets in a structured database",
      "Send a preview to the client for one-tap confirmation via a messaging bot",
      "On approval, publish the clip to social automatically",
    ],
    value:
      "A finished clip is ready in under an hour from raw input. The voiceover uses an AI clone of the client's own voice, so the brand tone stays consistent across every clip. The only manual steps left for the client are dropping the source files into Drive and approving the preview in Telegram.",
    stack: [
      "n8n",
      "Claude API",
      "ElevenLabs",
      "Creatomate",
      "Cloudinary",
      "Supabase",
      "Telegram Bot API",
    ],
    status: "Delivered.",
    group: "client",
    icon: Sparkles,
  },
  {
    title: "Prospect Database Builder for Kasano Construction",
    clientContext:
      "Construction company in New Zealand working on a cold outreach strategy.",
    tagline: "Automated prospect database builder targeting a specific niche.",
    problem:
      "The team was wasting too much time and money manually building their prospect database and finding contact details for each company. Hours every week spent on research instead of outreach.",
    solution: "Automated niche prospect database.",
    results:
      "A fully enriched prospect database of all local schools in New Zealand, with 35% of validated contact email addresses.",
    context:
      "The company wanted to run outbound sales toward a specific niche, local private schools in New Zealand. They had no clean list, no contact details, and no fast way to research each target. Buying a generic list would have wasted the budget on irrelevant contacts. Doing the research by hand would have taken weeks.",
    build: [
      "Scrape target sources for companies in the defined niche",
      "Add per-company research enrichment (industry data, recent activity, context the outbound team can use)",
      "Research and SMTP-verify email addresses for each identified contact",
      "Emit a structured database including company, contact, enrichment fields, and research notes",
      "Output is handed straight to the outbound team with no manual curation step",
    ],
    value:
      "What used to take weeks of manual research now runs as a scheduled job. The output is a structured prospect database, ready for the outbound team to use directly. Re-targeting a different niche only requires changing the configuration.",
    stack: [
      "n8n",
      "Apify",
      "Claude API",
      "Google Cloud",
      "Perplexity",
      "anymailfinder.io",
      "hunter.io",
    ],
    status: "Delivered.",
    group: "client",
    icon: Database,
  },
  {
    title: "Order OPS for Wilder NC",
    clientContext:
      "PlayStation hardware repair business in New Caledonia covering controllers, consoles, and parts.",
    tagline:
      "Order-management system from the market-gardener build, reshaped for a repair-job intake business.",
    problem:
      "The owner was running everything on paper. Repair intake, customer tracking, parts, and admin work were all done manually, eating hours every week.",
    solution: "Repair-job lifecycle tracking app.",
    results: "In 30 days, weekly admin work dropped significantly.",
    context:
      "The shop had the same operational shape as the earlier market-gardener build, with customer management on paper and no central tracking, but the lifecycle is different. Each repair is tracked per item, can last days or weeks, depends on parts availability, and needs customer updates at several stages.",
    build: [
      "Web app accessible only to the owner, not to customers",
      "Customer database with contact info, repair history, and per-item notes",
      "Repair job intake: device type, problem description, parts needed, estimated cost, and estimated delivery date",
      "Track each repair through its lifecycle: intake, diagnostic, parts ordered, repair in progress, ready for pickup",
      "Auto-notify the customer at each lifecycle step",
      "Parts inventory tracking with low-stock alerts",
      "Export accounting at the end of each period",
    ],
    value:
      "Customers and repair jobs are now managed from a single tool instead of memory and paper notebooks. Lost jobs, missed status updates, and forgotten customers no longer happen on a regular basis.",
    stack: ["Claude Code", "n8n", "Facebook Graph API"],
    status: "Delivered.",
    group: "client",
    icon: Terminal,
  },
  {
    title: "Showcase Website for Provence Élite Conciergerie",
    clientContext:
      "Seasonal-rental concierge service operating in Draguignan, Gulf of Saint-Tropez, Upper Var, and Côte d'Azur.",
    tagline: "Showcase website for the company.",
    problem: "New local service had no online presence.",
    solution: "Brochure site with contact form.",
    results: "Fully functional website delivered in less than 7 days.",
    context:
      "A new local services company needed an online presence to receive enquiries from property owners. They did not need a fully bespoke design, and did not want the ongoing maintenance that comes with a CMS like WordPress.",
    build: [
      "Single-page responsive website with sections for services, testimonials, and contact",
      "Contact form (name, email, phone, subject, message) writes each submission to a backend database as a structured record",
      "Enquiries reviewable and exportable from a dashboard",
      "Mobile-responsive, French copy, no CMS required",
    ],
    value:
      "The site is live at provenceeliteconciergerie.com. Single page, mobile-responsive, French copy, no CMS to maintain. Each enquiry is saved into Supabase as a structured record that can be searched and exported.",
    stack: ["Custom HTML/CSS", "Vercel", "Supabase"],
    status: "Delivered. Live at provenceeliteconciergerie.com.",
    group: "client",
    icon: Layers,
  },
  {
    title: "Gym Management Software for UFC Wallis",
    clientContext:
      "Uvea Futuna Corporation, a gym opening in Wallis and Futuna Islands.",
    tagline: "Custom gym management platform.",
    problem:
      "The gym is opening and has no software to run the operation.",
    solution: "Custom gym management platform.",
    context:
      "A new gym is opening in Wallis and Futuna, a French overseas territory. Internet connectivity is limited. Local rules and customs apply: RGPD, XPF currency, French-only UI, cash and card only. Off-the-shelf gym SaaS like Glofox or Mindbody does not fit the territory: pricing assumes mainland-Europe scale, the UI is not built for the local payment customs, and relying on a stable connection is not realistic.",
    build: [
      "One web application with two login roles: staff and member",
      "Member registration with photo capture",
      "Check-in via name search or tablet-camera QR scan, with no dedicated scanner required",
      "Billing in XPF, cash or card",
      "Six membership tiers from day pass to annual",
      "Role-based access for four staff functions",
      "KPI dashboards: daily revenue, active members, check-ins",
      "Member-facing app showing the unique ID and QR code on the home screen",
      "Phase 2: institutional accounts (schools, administrations, clubs), coaching packs, WhatsApp expiry reminders",
    ],
    value:
      "The gym is set to open with the full member workflow already running in software: registration, check-in, billing, role-based staff access, and reporting. The system is built to fit the territory's constraints (RGPD, XPF, limited connectivity, French-only) instead of being adapted from a generic SaaS.",
    stack: [],
    status: "In delivery. Proposal finalised, awaiting kick-off.",
    group: "in-delivery",
    icon: Dumbbell,
  },
  {
    title: "Quotes Management Agent for Local Garages",
    clientContext: "Automotive garages in France.",
    tagline: "AI-powered infrastructure that handles quote management.",
    problem:
      "Garage owners spend too many hours a week drafting and sending quotes. Late replies lose customers to competitors, and some quotes are skipped entirely.",
    solution: "AI-drafted quotes via Telegram approval.",
    context:
      "Independent garage owners spend roughly 12 hours a week handling customer quotes: taking the request, looking up parts, applying margins, formatting the quote, and following up with the customer. Quote requests come in after hours, by email, WhatsApp, web form, or in person. Owners often respond too late, and the customer has already gone to a competitor. In some cases, the quote is skipped entirely and the job is lost without the owner noticing.",
    build: [
      "Capture incoming quote requests automatically from multiple channels (email, messaging, web form, or owner-initiated entry)",
      "Research the requested parts, look up prices, apply the garage's margins, and produce a draft quote in the garage's format",
      "Send the draft to the owner via an interactive bot for one-tap approval or natural-language correction",
      "On approval, dispatch the quote to the customer automatically; on edit, re-draft with the change applied",
      "Owner retains full control over final pricing, while the system handles research, lookups, and formatting",
    ],
    value:
      "The target is to bring quote-management time from roughly 12 hours a week down to roughly 4 hours, within 30 days. Quotes can go out the same day instead of the following week, which avoids losing the customer to a competitor in the meantime. The owner stays in control of every quote that leaves the garage.",
    stack: [
      "n8n",
      "Claude API",
      "Telegram Bot API",
      "WhatsApp Business API",
      "Supabase",
      "Email infrastructure",
    ],
    status: "In progress. First 10-client cohort in active sales.",
    group: "client",
    icon: FileCode,
  },
  {
    title: "SLOP AI",
    clientContext:
      "Subscription-based product, on the way to becoming a full SaaS.",
    tagline: "A private AI visual studio.",
    problem:
      "Brands need a constant stream of studio-quality images and video, but studios are slow and DIY AI tools drift off-brand.",
    solution: "Managed AI visual studio.",
    context:
      "Brands running e-commerce or content-heavy product lines need a continuous pipeline of studio-quality images and video. Booking a photo studio for every shoot is slow and expensive. Asking the marketing team to run AI tools themselves leads to drifting brand voice, inconsistent style, and a lot of time spent prompting instead of shipping.",
    build: [
      "Private AI visual pipeline deployed and operated per brand",
      "Tuned to the brand's identity, palette, and style references upfront",
      "Generates studio-quality images and short video clips at scale",
      "Output ready in under a minute, no manual intervention required",
      "Assets delivered straight into the brand's existing workflow",
    ],
    value:
      "Brands receive a continuous pipeline of on-brand visual assets without managing AI tools internally or booking a studio per shoot. The pipeline is private, fully managed, and tuned to the brand's specific style, so output stays consistent over time.",
    stack: [
      "Claude Code",
      "Telegram API",
      "n8n",
      "AI Image generation models",
      "AI Video generation models",
    ],
    status: "In progress.",
    group: "client",
    icon: Palette,
  },
  {
    title: "Social Media Competitor Tracker",
    clientContext:
      "Internal tool. Powers content ideation for @manu_ai.to by surfacing what competitors and selected adjacent creators are posting in near real time.",
    tagline:
      "Tracks the latest content from competitors and reference creators to surface trending topics and content ideas.",
    context:
      "Coming up with consistent content while running a brand is hard. Ideas dry up because the creator is stuck in their own bubble. The fastest signal of what's working right now sits in what competitors and adjacent creators are actually posting, but reading that manually across multiple platforms every week eats hours and rarely gets done.",
    build: [
      "Pull the most recent posts from a defined list of competitors and selected reference creators across the main social platforms",
      "Run each post through Claude to extract the topic, format, and angle used",
      "Aggregate the trending subjects across the tracked set",
      "Surface a weekly digest of what's getting attention right now, with links to the original posts",
      "The tracked list is configuration-driven, so adding or swapping creators does not require touching the code",
    ],
    value:
      "Replaces an hour or two of weekly manual scrolling with a single digest. Content ideas come from current signal instead of stale instincts. The list of tracked creators is easy to update: change the configuration, and the system re-targets.",
    stack: ["n8n", "Claude Code", "Apify", "Facebook Graph API"],
    status: "Live.",
    group: "own",
    icon: Telescope,
  },
  {
    title: "Community Manager AI Agent",
    clientContext:
      "Internal product. Runs a social presence end-to-end across Instagram, Facebook, TikTok, and X/Twitter, covering content creation, publishing, comments, and DMs.",
    tagline:
      "AI agent that handles a brand's full social presence: creates content, publishes it, replies to comments, and manages incoming DMs.",
    context:
      "Maintaining a real social presence on multiple platforms takes time most operators don't have. Creating content, picking the right format, writing captions, scheduling posts, replying to comments and DMs: every step is manual, and every platform multiplies the work.",
    build: [
      "Connect to the brand's social accounts across Instagram, Facebook, TikTok, and X/Twitter",
      "Create content end-to-end (video, image, AI-generated visuals, or text), either original or inspired by sources tracked elsewhere",
      "Generate captions and meta descriptions tuned to each platform's format",
      "Schedule and publish posts on the chosen platforms automatically",
      "Read and reply to comments on published posts",
      "Read and reply to incoming DMs",
    ],
    value:
      "A solo operator or small team can run a real, consistent social presence across multiple platforms without spending hours every day on it. The agent stays on-brand because it's connected to the brand's existing context, not pulling from generic templates.",
    stack: [
      "n8n",
      "Claude API",
      "Meta Graph API",
      "TikTok API",
      "X/Twitter API",
      "AI image generation",
      "AI video generation",
      "Supabase",
    ],
    status: "In progress.",
    group: "own",
    icon: MessageCircle,
  },
  {
    title: "Phone AI Voice Assistant",
    clientContext:
      "Internal product. AI voice agent that handles customer service calls and appointment setting, with tone customisable per brand.",
    tagline:
      "AI voice agent that answers customer service calls and books appointments, with voice and personality customisable per brand.",
    context:
      "Most small businesses lose phone calls outside business hours or when the line is busy. A missed call is often a missed booking. Hiring a receptionist is overkill, voicemail loses the customer, and generic call-routing IVRs feel impersonal and frustrate the caller.",
    build: [
      "Answer incoming phone calls in real time, in a voice tuned to the brand",
      "Handle common customer service inquiries from a knowledge base provided per brand",
      "Set appointments by reading available slots and confirming with the caller",
      "Capture each call's summary and caller details to the brand's database",
      "Transcribe and store every call for review",
      "Tone, vocabulary, response style, and escalation rules customisable per brand",
    ],
    value:
      "A small business gets phone coverage outside business hours and during busy times without hiring staff. Callers reach a real-sounding voice that handles common cases and books appointments directly. Every call is captured as a structured record for follow-up.",
    stack: [
      "ElevenLabs",
      "Vapi.ai",
      "Claude API",
      "Gemini API",
      "n8n",
      "Claude Code",
      "Twilio",
      "Supabase",
    ],
    status: "In progress.",
    group: "own",
    icon: Phone,
  },
  {
    title: "Chat AI Customer Service Assistant",
    clientContext:
      "Internal product. AI agent that handles customer service inquiries and appointment setting across Messenger, WhatsApp, Instagram DMs, and Telegram, with tone customisable per brand.",
    tagline:
      "Chat AI agent that handles customer service and books appointments across multiple messaging platforms, with tone customisable per brand.",
    context:
      "Inbound customer messages on Messenger, WhatsApp, Instagram DMs, and Telegram pile up fast, especially outside business hours. Most small teams reply in batches, miss prospects between platforms, or paste the same answers all day. The customer feels the slowness; the team feels the load.",
    build: [
      "Connect to the brand's accounts on Messenger, WhatsApp, Instagram, and Telegram",
      "Reply to inbound messages in real time from a brand-specific knowledge base",
      "Handle common customer service inquiries automatically",
      "Set appointments by reading available slots and confirming with the customer",
      "Capture each conversation's summary and customer details to the brand's database",
      "Tone, vocabulary, response style, and escalation rules customisable per brand",
      "Hand off to a human operator on complex cases or detected escalations",
    ],
    value:
      "A small team can cover customer messaging across four or more platforms around the clock without scaling headcount. Customers get immediate replies on the platform they already use. Every conversation is captured as a structured record for follow-up.",
    stack: [
      "Claude API",
      "Gemini API",
      "n8n",
      "Claude Code",
      "Supabase",
      "Meta Graph API",
      "Telegram Bot API",
    ],
    status: "In progress.",
    group: "own",
    icon: Workflow,
  },
];

export function titleSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type StatusVariant = {
  label: "Live" | "In progress" | "In delivery" | "Delivered";
  pillClasses: string;
  dotClasses: string;
};

export function getStatusVariant(status: string): StatusVariant {
  const lower = status.toLowerCase();
  if (lower.startsWith("live")) {
    return {
      label: "Live",
      pillClasses:
        "bg-[#00A6FF]/10 text-[#0077cc] border border-[#00A6FF]/30",
      dotClasses: "bg-[#00A6FF]",
    };
  }
  if (lower.startsWith("in progress")) {
    return {
      label: "In progress",
      pillClasses: "bg-amber-50 text-amber-800 border border-amber-200",
      dotClasses: "bg-amber-600",
    };
  }
  if (lower.startsWith("signed") || lower.startsWith("in delivery")) {
    return {
      label: "In delivery",
      pillClasses: "bg-violet-50 text-violet-800 border border-violet-200",
      dotClasses: "bg-violet-600",
    };
  }
  return {
    label: "Delivered",
    pillClasses: "bg-slate-100 text-slate-600 border border-slate-200",
    dotClasses: "bg-slate-400",
  };
}
