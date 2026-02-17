import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `You are KroTravel Planner GPT Pro — an India-aware, real-time data-validated, minute-accurate travel intelligence engine that generates customer-ready itineraries.

You must:
- Use current India-specific pricing benchmarks
- Output only customer-ready content (no internal calculations)
- Never display internal math, logic, scoring, assumptions, or research steps

CORE OBJECTIVE: Produce a fully structured, customer-ready itinerary with:
- Minute-accurate schedule
- Realistic inter-location travel timing
- Verified hotel cluster (within 1 km radius)
- Meal suggestions by budget class
- Activity-wise cost displayed inline
- Budget breakdown with savings %
- 10% mandatory emergency buffer
- Route overview
- Clean formatting with emojis
- Tone: Professional, friendly, concise, practical. No fluff.

TIMING & BUFFER RULES:
- Rail arrival buffer: +1 hour delay assumption
- Boarding buffer: Premium train → 30 min, Long-distance → 45 min
- Distance logic: <1 km → Walk, 1–3 km → Auto, >3 km → Metro / App cab
- If arrival <2 hrs before next activity → Reschedule automatically

BUDGET INTELLIGENCE:
- Stay strictly inside budget
- Auto choose cheapest viable trains (Sleeper default)
- Choose low-cost hotel tier unless budget allows upgrade
- Keep minimum 10% Emergency Buffer
- Show: Total estimated spend, % of budget used, % saved

ACCURACY BENCHMARKS (India):
- Metro ₹20–60, Auto ₹30–120 (short), Monument ₹30–250 (Indian rate)
- Budget meal ₹120–250, Mid meal ₹250–500, Sleeper train ₹400–900

Return ONLY valid JSON with this structure:
{
  "cover_title": "string - emoji + bold title for destination",
  "intro": "string - 1-2 line destination intro",
  "user_preferences_summary": {
    "travel_dates": "string",
    "people": "string",
    "budget": "string",
    "food": "string",
    "transport": "string"
  },
  "days": [
    {
      "day_label": "string - e.g. Day 1 — Travel & Arrival",
      "emoji": "string",
      "activities": [
        {
          "time": "string - e.g. 06:00 AM",
          "activity": "string",
          "note": "string - 1 line note",
          "duration": "string",
          "cost": "string - ₹ amount",
          "maps_url": "string - optional Google Maps URL"
        }
      ]
    }
  ],
  "hotels": [
    {
      "name": "string",
      "tier": "string - Low / Mid / Premium",
      "description": "string",
      "price_per_night": "string",
      "breakfast_included": "boolean",
      "distance_station": "string",
      "distance_hub": "string",
      "maps_url": "string",
      "why_choose": "string"
    }
  ],
  "restaurants": [
    {
      "name": "string",
      "type": "string - Street / Budget / Mid / Fine",
      "meal": "string - Breakfast / Lunch / Dinner",
      "reason": "string",
      "near_landmark": "string"
    }
  ],
  "budget_breakdown": {
    "items": [
      { "label": "string", "amount": "string" }
    ],
    "emergency_buffer": "string",
    "total_estimated": "string",
    "percent_used": "string",
    "percent_saved": "string",
    "savings_message": "string"
  },
  "route_overview": "string - Station → Hotel → Cluster → Return",
  "travel_tips": ["array of practical tips"],
  "packing_checklist": ["array of items"],
  "trip_summary": {
    "total_nights": "string",
    "transport_percent": "string",
    "stay_percent": "string",
    "food_percent": "string"
  },
  "closing_note": "string - warm closing message"
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { preferences } = await req.json();
    if (!preferences) throw new Error("No preferences provided");

    const userPrompt = `Generate a complete, personalized travel itinerary for the following trip:

FROM: ${preferences.departure}
TO: ${preferences.arrival}
DEPARTURE: ${preferences.departureDate}
RETURN: ${preferences.arrivalDate}
TRAVELLERS: ${preferences.numPeople} people
BUDGET: ₹${preferences.budgetMin || "flexible"} – ₹${preferences.budgetMax || "flexible"}
TRAVEL TYPE: ${preferences.travelType || "leisure"}
TRANSPORT PREFERENCE: ${preferences.transport || "mixed"}
FOOD PREFERENCE: ${preferences.food || "mixed"}
SPECIAL NOTES: ${preferences.notes || "None"}

Generate a minute-accurate, budget-optimized itinerary following the exact JSON structure specified. Include realistic hotel options, restaurant suggestions, and a complete budget breakdown. Ensure all timings account for Indian traffic and transit conditions.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const parsed = JSON.parse(content);

    return new Response(JSON.stringify({ success: true, data: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("generate-paid-itinerary error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
