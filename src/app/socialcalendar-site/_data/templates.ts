/**
 * Built-in caption templates for the Social Media Calendar.
 *
 * Captions are complete, ready-to-adapt copy — not lorem ipsum. Fill the
 * {{placeholders}} with real details (see extractPlaceholders /
 * applyTemplate below) and adjust the voice to the brand before posting.
 */

import type { ContentType } from "../_lib/types";

export interface BuiltinTemplate {
  id: string;
  name: string;
  category: string;
  caption: string;
  contentType: ContentType;
  notes: string;
}

export const BUILTIN_TEMPLATES: BuiltinTemplate[] = [
  {
    id: "tpl-product-launch",
    name: "Product Launch Announcement",
    category: "Product Launch",
    caption:
      "It's here. Meet {{product}} — built for {{audience}} who are tired of {{pain_point}}.\n\n{{product}} gives you {{benefit_1}}, {{benefit_2}} and {{benefit_3}}, for {{price}}.\n\nAvailable now at {{website}}. {{cta}}",
    contentType: "announcement",
    notes: "Post on launch morning with a clean product photo or demo clip. Pin it for the first week and answer every sizing / shipping / how-it-works question in the comments the same day.",
  },
  {
    id: "tpl-product-launch-waitlist",
    name: "Coming Soon / Waitlist Teaser",
    category: "Product Launch",
    caption:
      "Something new is landing at {{brand}} on {{date}}.\n\nWe can't show you {{product}} yet — but if {{teaser_hint}} sounds like your problem, you'll want to be first in line.\n\nJoin the waitlist at {{website}} and waitlist members shop 24 hours before everyone else. {{cta}}",
    contentType: "image",
    notes: "Use a cropped, shadowed or detail-only image — never the full product. Post 5-7 days before launch, then follow with the full launch template on the day.",
  },
  {
    id: "tpl-testimonial-quote",
    name: "Customer Testimonial Quote",
    category: "Testimonial",
    caption:
      "\"{{quote}}\" — {{customer_name}}, {{customer_detail}}\n\n{{customer_name}} came to {{brand}} for {{original_problem}}, and this is what changed: {{result}}.\n\nWant the same result? {{cta}} — details at {{website}}.",
    contentType: "image",
    notes: "Only use a real quote, with the customer's permission, and keep their words unedited except for length. A photo of the customer (or their result) outperforms a branded quote card.",
  },
  {
    id: "tpl-announcement-general",
    name: "General Announcement",
    category: "Announcement",
    caption:
      "Big news from {{brand}}: {{announcement}}.\n\nWhat this means for you: {{what_changes}}. When it starts: {{date}}. Anything you need to do: {{action_needed}}.\n\nFull details at {{website}}. Questions? Ask us below — we're answering all day. {{cta}}",
    contentType: "announcement",
    notes: "Lead with the news itself, not the build-up. If the announcement affects existing customers (prices, hours, policies), say what changes for them before saying why you're excited.",
  },
  {
    id: "tpl-faq-answer",
    name: "FAQ Answer Post",
    category: "FAQ",
    caption:
      "You ask, we answer: \"{{question}}\"\n\nShort answer: {{short_answer}}.\n\nThe detail: {{detail}}. This applies to {{applies_to}} — if your situation is different, message us and we'll give you a straight answer for your case.\n\nMore FAQs at {{website}}. {{cta}}",
    contentType: "text",
    notes: "Take the question word-for-word from a real DM, email or comment — real wording is what people search for. Save good answers into a highlight or guide so they keep working.",
  },
  {
    id: "tpl-educational-carousel",
    name: "Educational Carousel (Myth / Fact)",
    category: "Educational Carousel",
    caption:
      "{{number}} things people get wrong about {{topic}} — slide {{number}} is the expensive one.\n\nMyth: {{myth}}. Fact: {{fact}}.\n\nSwipe through, save this for when you need it, and send it to {{person_who_needs_it}}.\n\nWant the full guide? It's free at {{website}}. {{cta}}",
    contentType: "carousel",
    notes: "One myth per slide, fact directly underneath — never make readers reach the last slide for the first answer. End the carousel with a recap slide so savers get the whole lesson in one screenshot.",
  },
  {
    id: "tpl-giveaway",
    name: "Giveaway / Competition",
    category: "Giveaway",
    caption:
      "GIVEAWAY: Win {{prize}} (worth {{price}}) from {{brand}}.\n\nTo enter:\n1. Follow {{account}}\n2. Like this post\n3. Comment {{entry_prompt}} and tag {{tag_requirement}}\n\nEntries close {{date}} at {{time}}. The winner is drawn at random and announced here on {{announcement_date}}. Full terms at {{website}}.",
    contentType: "image",
    notes: "Check the platform's promotion rules and your local laws before posting, state eligibility clearly in the full terms, and never require a purchase where that would make the draw unlawful. Announce the winner publicly on the promised date.",
  },
  {
    id: "tpl-promotion-offer",
    name: "Limited-Time Promotion",
    category: "Promotion",
    caption:
      "{{offer}} at {{brand}} — from today until {{date}}.\n\nGet {{discount_detail}} on {{product}} with code {{code}} at {{website}}. That's {{price}} instead of {{original_price}}.\n\nWhen it's gone, it's gone: {{stock_note}}. {{cta}}",
    contentType: "image",
    notes: "State the real end date and real stock position — false urgency destroys trust and can breach advertising rules. Remind once midway and once on the final day, not daily.",
  },
  {
    id: "tpl-behind-the-scenes",
    name: "Behind the Scenes",
    category: "Behind the Scenes",
    caption:
      "Behind the scenes at {{brand}}: this is {{process}} — the part of {{product}} you never see.\n\nIt takes {{time_taken}}, {{people_involved}} people, and one step everyone gets wrong the first time: {{hard_step}}.\n\nThe finished result is at {{website}}. {{cta}}",
    contentType: "reel",
    notes: "Film the real process, mess included — a polished 'behind the scenes' fools nobody. Narrate what each step is for, not just what it is, so viewers learn why the product costs what it costs.",
  },
  {
    id: "tpl-milestone-celebration",
    name: "Milestone Celebration",
    category: "Milestone",
    caption:
      "We just hit {{milestone}} — and {{brand}} started with {{origin_detail}}.\n\nTo everyone who {{support_action}}: thank you. This number is really {{what_it_represents}}.\n\nTo say thanks properly: {{thank_you_offer}} at {{website}} until {{date}}. {{cta}}",
    contentType: "image",
    notes: "Make the milestone about the customers, not the trophy: name what the number represents in their lives (meals served, homes found, classes taught) rather than only followers or revenue.",
  },
  {
    id: "tpl-poll-engagement",
    name: "This or That Poll",
    category: "Poll",
    caption:
      "Settle a debate at {{brand}} HQ: {{option_a}} or {{option_b}}?\n\nTeam {{person_a}} swears by {{option_a}} because {{reason_a}}. Team {{person_b}} says {{option_b}} wins on {{reason_b}}.\n\nVote below — the loser {{forfeit}} on {{date}}. {{cta}}",
    contentType: "poll",
    notes: "Pick a genuinely divisive, low-stakes question your audience has opinions about, and always return with the result and the forfeit — a poll with no follow-up trains people not to vote next time.",
  },
  {
    id: "tpl-event-invitation",
    name: "Event Invitation",
    category: "Event",
    caption:
      "You're invited: {{event_name}} at {{location}} on {{date}}, {{time}}.\n\nExpect {{highlight_1}}, {{highlight_2}} and {{highlight_3}} — plus {{bonus_for_attendees}} for everyone who comes.\n\nTickets / RSVP: {{website}}. Spaces are limited to {{capacity}}, so {{cta}}.",
    contentType: "event",
    notes: "Create the platform event listing as well as the post, so people get reminders. Post the invitation twice — once when booking opens and once 48 hours before — with a photo from a previous edition if you have one.",
  },
  {
    id: "tpl-seasonal-greeting-offer",
    name: "Seasonal Campaign",
    category: "Seasonal",
    caption:
      "{{seasonal_greeting}} from all of us at {{brand}}.\n\nFor {{season}}, we've put together {{seasonal_product}} — made for {{seasonal_use_case}}, at {{price}} until {{date}}.\n\nOrder by {{order_deadline}} for delivery in time for {{occasion}}. Shop at {{website}}. {{cta}}",
    contentType: "image",
    notes: "Name the real order-by deadline for delivery before the occasion — it is the most useful fact in the post. Keep religious and cultural references accurate and respectful for the specific occasion.",
  },
  {
    id: "tpl-ugc-request",
    name: "UGC Request / Share Your Photo",
    category: "UGC Request",
    caption:
      "Show us your {{product}} in the wild.\n\nPost your photo or video with {{hashtag}} and tag {{account}} — every {{day}} we feature our favourite, and this month's featured creator wins {{incentive}}.\n\nNeed inspiration? See the gallery at {{website}}. By tagging us you give {{brand}} permission to repost with credit. {{cta}}",
    contentType: "image",
    notes: "State the repost permission plainly, as the caption does, and always credit the creator when you feature them. Feature the first entries fast and visibly so others believe the series is real.",
  },
  {
    id: "tpl-last-chance-reminder",
    name: "Last Chance / Ending Soon",
    category: "Last Chance",
    caption:
      "Last chance: {{offer}} ends tonight, {{date}}, at {{time}}.\n\nAfter that, {{product}} goes back to {{original_price}} — no extensions, no exceptions.\n\nOrder now at {{website}} with code {{code}}. {{cta}}",
    contentType: "story",
    notes: "Only use this if the offer genuinely ends — one fake 'last chance' costs more trust than the extra sales are worth. A Stories countdown sticker makes the deadline concrete.",
  },
  {
    id: "tpl-product-tip",
    name: "Product Tip / Get More From It",
    category: "Product Tip",
    caption:
      "Already own {{product}}? You're probably missing {{hidden_feature}}.\n\nHere's how: {{step_1}}, then {{step_2}}, then {{step_3}}. It takes {{time_taken}} and it's the difference between {{before_result}} and {{after_result}}.\n\nMore tips like this at {{website}}. {{cta}}",
    contentType: "video",
    notes: "Post-purchase content is the most under-used retention tool there is. Pick a feature your support tickets prove owners overlook, and film it on the real product, not a render.",
  },
  {
    id: "tpl-community-spotlight",
    name: "Community / Customer Spotlight",
    category: "Community Spotlight",
    caption:
      "Spotlight on {{spotlight_name}}.\n\n{{spotlight_name}} {{achievement}} — and did it {{how_detail}}. Our favourite part of their story: {{favourite_detail}}.\n\nShow them some love in the comments, and read their full story at {{website}}. Want to be featured? {{cta}}",
    contentType: "image",
    notes: "Get the person's approval of the exact wording before posting, and let them correct the details — it is their story. Tag them so their own audience discovers the feature too.",
  },
  {
    id: "tpl-meet-the-team",
    name: "Meet the Team / New Joiner",
    category: "Meet the Team",
    caption:
      "Meet {{team_member_name}}, our new {{role}} at {{brand}}.\n\n{{team_member_name}} joins us from {{background}} and will be {{responsibility}} — so if you {{customer_situation}}, they're your person.\n\nTheir one non-negotiable: {{personal_detail}}. Say hello below, or meet them at {{location}}. {{cta}}",
    contentType: "image",
    notes: "A real photo at work beats a corporate headshot. Include the practical detail customers actually need — what this person now handles and how to reach them — not just fun facts.",
  },
  {
    id: "tpl-question-prompt",
    name: "Ask the Audience Question Prompt",
    category: "Question Prompt",
    caption:
      "Genuine question for {{audience}}: {{question}}\n\nAt {{brand}} we're split — some of us say {{answer_a}}, others swear it's {{answer_b}}.\n\nTell us yours below, and tell us why. We'll share the results (and what we're changing because of them) on {{date}}. {{cta}}",
    contentType: "text",
    notes: "Ask something you genuinely want the answer to and report back on the promised date, including any change you make — that follow-through is what turns a prompt into a community habit.",
  },
  {
    id: "tpl-sale-event-live",
    name: "Live Shopping / Live Demo Invite",
    category: "Event",
    caption:
      "Going LIVE: join {{host_name}} from {{brand}} on {{date}} at {{time}} for a live demo of {{product}}.\n\nWe'll cover {{demo_topic_1}} and {{demo_topic_2}}, answer your questions in real time, and there's an exclusive live-only offer: {{live_offer}}.\n\nSet your reminder at {{website}}. {{cta}}",
    contentType: "live",
    notes: "Announce at least 48 hours ahead and again an hour before. Prepare the two demo topics and three likely questions in advance — live silence while you think is where viewers leave.",
  },
];

/**
 * Placeholder keys used in a caption, e.g. "{{product}}" -> "product".
 * Unique, in order of first appearance. Whitespace inside the braces
 * is ignored, so "{{ product }}" yields "product".
 */
export function extractPlaceholders(caption: string): string[] {
  const seen = new Set<string>();
  const keys: string[] = [];
  const pattern = /\{\{\s*([^{}]+?)\s*\}\}/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(caption)) !== null) {
    const key = match[1].trim();
    if (key.length > 0 && !seen.has(key)) {
      seen.add(key);
      keys.push(key);
    }
  }
  return keys;
}

/**
 * Replace every {{key}} in `caption` with values[key]. Placeholders
 * with no matching value are left untouched, so a partially filled
 * template stays visibly unfinished rather than silently blank.
 */
export function applyTemplate(
  caption: string,
  values: Record<string, string>,
): string {
  return caption.replace(
    /\{\{\s*([^{}]+?)\s*\}\}/g,
    (whole: string, rawKey: string): string => {
      const key = rawKey.trim();
      const value = values[key];
      return value !== undefined ? value : whole;
    },
  );
}
