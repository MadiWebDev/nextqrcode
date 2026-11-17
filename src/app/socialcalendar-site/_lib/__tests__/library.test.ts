// Built-in library tests: the idea library covers every industry with
// usable, specific content, and the template helpers fill placeholders
// without ever silently dropping copy.
import { describe, expect, it } from "vitest";
import { INDUSTRIES, LIBRARY_IDEAS } from "../../_data/ideas";
import {
  BUILTIN_TEMPLATES,
  applyTemplate,
  extractPlaceholders,
} from "../../_data/templates";

const EXPECTED_INDUSTRIES = [
  "Ecommerce",
  "Restaurants",
  "Real Estate",
  "Fitness",
  "Education",
  "SaaS",
  "Freelancers",
  "Agencies",
  "Fashion",
  "Beauty",
  "Travel",
  "Automotive",
  "Photography",
  "Healthcare Clinics",
  "Local Businesses",
  "Nonprofits",
  "Creators",
];

const PLATFORM_IDS = [
  "instagram",
  "facebook",
  "tiktok",
  "youtube",
  "youtube-shorts",
  "linkedin",
  "x",
  "pinterest",
  "threads",
];

const PILLARS = [
  "Educational",
  "Promotional",
  "Entertainment",
  "Community",
  "Behind the Scenes",
  "Testimonials",
  "Product Showcase",
  "Industry Insights",
];

const REQUIRED_TEMPLATE_CATEGORIES = [
  "Product Launch",
  "Testimonial",
  "Announcement",
  "FAQ",
  "Educational Carousel",
  "Giveaway",
  "Promotion",
  "Behind the Scenes",
  "Milestone",
  "Poll",
  "Event",
  "Seasonal",
  "UGC Request",
];

describe("INDUSTRIES", () => {
  it("lists exactly the 17 expected industries", () => {
    expect(INDUSTRIES).toEqual(EXPECTED_INDUSTRIES);
  });
});

describe("LIBRARY_IDEAS", () => {
  it("has at least 68 ideas, with at least 4 per industry", () => {
    expect(LIBRARY_IDEAS.length).toBeGreaterThanOrEqual(68);
    for (const industry of INDUSTRIES) {
      const count = LIBRARY_IDEAS.filter(
        (idea) => idea.industry === industry,
      ).length;
      expect(count, `ideas for ${industry}`).toBeGreaterThanOrEqual(4);
    }
  });

  it("only uses industries from the INDUSTRIES list", () => {
    for (const idea of LIBRARY_IDEAS) {
      expect(INDUSTRIES).toContain(idea.industry);
    }
  });

  it("has unique ids", () => {
    const ids = LIBRARY_IDEAS.map((idea) => idea.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every idea a non-empty hook, CTA and description", () => {
    for (const idea of LIBRARY_IDEAS) {
      expect(idea.title.trim().length, idea.id).toBeGreaterThan(0);
      expect(idea.description.trim().length, idea.id).toBeGreaterThan(0);
      expect(idea.hook.trim().length, idea.id).toBeGreaterThan(0);
      expect(idea.cta.trim().length, idea.id).toBeGreaterThan(0);
      expect(idea.format.trim().length, idea.id).toBeGreaterThan(0);
    }
  });

  it("gives every idea 3-6 hashtags, none carrying a '#' prefix", () => {
    for (const idea of LIBRARY_IDEAS) {
      expect(idea.hashtags.length, idea.id).toBeGreaterThanOrEqual(3);
      expect(idea.hashtags.length, idea.id).toBeLessThanOrEqual(6);
      for (const tag of idea.hashtags) {
        expect(tag.trim().length, idea.id).toBeGreaterThan(0);
        expect(tag.startsWith("#"), `${idea.id}: ${tag}`).toBe(false);
      }
    }
  });

  it("uses only known platform ids, pillars and difficulty levels", () => {
    for (const idea of LIBRARY_IDEAS) {
      expect(PLATFORM_IDS, idea.id).toContain(idea.platformId);
      expect(PILLARS, idea.id).toContain(idea.pillar);
      expect(["easy", "medium", "advanced"], idea.id).toContain(
        idea.difficulty,
      );
    }
  });

  it("varies platforms, pillars and difficulty across the library", () => {
    expect(new Set(LIBRARY_IDEAS.map((idea) => idea.platformId)).size)
      .toBeGreaterThanOrEqual(7);
    expect(new Set(LIBRARY_IDEAS.map((idea) => idea.pillar)).size)
      .toBeGreaterThanOrEqual(7);
    expect(new Set(LIBRARY_IDEAS.map((idea) => idea.difficulty)).size).toBe(3);
  });
});

describe("BUILTIN_TEMPLATES", () => {
  it("has at least 16 templates with unique ids", () => {
    expect(BUILTIN_TEMPLATES.length).toBeGreaterThanOrEqual(16);
    const ids = BUILTIN_TEMPLATES.map((template) => template.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers at least 13 distinct categories, including every required one", () => {
    const categories = new Set(
      BUILTIN_TEMPLATES.map((template) => template.category),
    );
    expect(categories.size).toBeGreaterThanOrEqual(13);
    for (const category of REQUIRED_TEMPLATE_CATEGORIES) {
      expect(categories.has(category), category).toBe(true);
    }
  });

  it("gives every template complete copy and notes", () => {
    for (const template of BUILTIN_TEMPLATES) {
      expect(template.name.trim().length, template.id).toBeGreaterThan(0);
      expect(template.caption.trim().length, template.id).toBeGreaterThan(0);
      expect(template.notes.trim().length, template.id).toBeGreaterThan(0);
      expect(template.contentType.trim().length, template.id).toBeGreaterThan(
        0,
      );
    }
  });

  it("uses at least 2 placeholders in most templates", () => {
    const withTwoOrMore = BUILTIN_TEMPLATES.filter(
      (template) => extractPlaceholders(template.caption).length >= 2,
    );
    expect(withTwoOrMore.length).toBeGreaterThan(
      BUILTIN_TEMPLATES.length / 2,
    );
  });

  it("round-trips: filling every placeholder leaves no {{...}} behind", () => {
    for (const template of BUILTIN_TEMPLATES) {
      const values: Record<string, string> = {};
      for (const key of extractPlaceholders(template.caption)) {
        values[key] = "filled";
      }
      const filled = applyTemplate(template.caption, values);
      expect(filled, template.id).not.toContain("{{");
      expect(filled, template.id).toContain("filled");
    }
  });
});

describe("extractPlaceholders", () => {
  it("returns unique keys in order of first appearance", () => {
    expect(
      extractPlaceholders(
        "Meet {{product}} from {{brand}} — {{product}} is here, see {{website}}",
      ),
    ).toEqual(["product", "brand", "website"]);
  });

  it("returns an empty array when there are no placeholders", () => {
    expect(extractPlaceholders("A caption with nothing to fill in.")).toEqual(
      [],
    );
    expect(extractPlaceholders("")).toEqual([]);
  });

  it("ignores whitespace inside the braces", () => {
    expect(extractPlaceholders("Hi {{ name }}, welcome")).toEqual(["name"]);
  });
});

describe("applyTemplate", () => {
  it("replaces known placeholders with their values", () => {
    expect(
      applyTemplate("Meet {{product}} at {{website}}", {
        product: "Trail Mug",
        website: "shop.example.com",
      }),
    ).toBe("Meet Trail Mug at shop.example.com");
  });

  it("replaces every occurrence of a repeated placeholder", () => {
    expect(applyTemplate("{{brand}} says hi from {{brand}}", { brand: "Acme" }))
      .toBe("Acme says hi from Acme");
  });

  it("leaves unknown placeholders untouched", () => {
    expect(
      applyTemplate("Meet {{product}} — only {{price}} this week", {
        product: "Trail Mug",
      }),
    ).toBe("Meet Trail Mug — only {{price}} this week");
  });

  it("leaves the caption unchanged when no values are supplied", () => {
    const caption = "Win {{prize}} from {{brand}}";
    expect(applyTemplate(caption, {})).toBe(caption);
  });
});
