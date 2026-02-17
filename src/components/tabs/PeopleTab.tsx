import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { personas, lookingForTags } from "@/data/summit";
import { Search, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Profile {
  id: string;
  device_id: string;
  persona: string | null;
  interests: string[];
  whatsapp: string | null;
  working_on: string | null;
  looking_for: string[];
}

const PAGE_SIZE = 50;

function useProfiles(filters: {
  search: string;
  persona: string | null;
  lookingForFilter: string[];
  limit: number;
}) {
  return useQuery({
    queryKey: ["profiles", filters],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select("*")
        .not("whatsapp", "is", null)
        .neq("whatsapp", "")
        .order("updated_at", { ascending: false })
        .limit(filters.limit);

      if (filters.persona) {
        query = query.eq("persona", filters.persona);
      }

      if (filters.search) {
        query = query.ilike("working_on", `%${filters.search}%`);
      }

      if (filters.lookingForFilter.length > 0) {
        query = query.overlaps("looking_for", filters.lookingForFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as Profile[]) || [];
    },
    staleTime: 30_000,
  });
}

export default function PeopleTab() {
  const [search, setSearch] = useState("");
  const [personaFilter, setPersonaFilter] = useState<string | null>(null);
  const [lookingForFilter, setLookingForFilter] = useState<string[]>([]);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const { data: profiles, isLoading } = useProfiles({
    search,
    persona: personaFilter,
    lookingForFilter,
    limit,
  });

  const toggleLookingFor = useCallback((id: string) => {
    setLookingForFilter((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    setLimit(PAGE_SIZE);
  }, []);

  const personaKeys = Object.keys(personas);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold font-heading">👥 Attendee Directory</h2>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setLimit(PAGE_SIZE); }}
          placeholder="Search by what people are working on..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Persona filter */}
      <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <button
          onClick={() => { setPersonaFilter(null); setLimit(PAGE_SIZE); }}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            personaFilter === null
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          All
        </button>
        {personaKeys.map((key) => {
          const p = personas[key];
          return (
            <button
              key={key}
              onClick={() => { setPersonaFilter(personaFilter === key ? null : key); setLimit(PAGE_SIZE); }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                personaFilter === key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {p.icon} {p.label}
            </button>
          );
        })}
      </div>

      {/* Looking for filter */}
      <div className="flex flex-wrap gap-1.5">
        {lookingForTags.map((tag) => {
          const selected = lookingForFilter.includes(tag.id);
          return (
            <button
              key={tag.id}
              onClick={() => toggleLookingFor(tag.id)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all ${
                selected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-muted-foreground/50"
              }`}
            >
              {tag.label}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {isLoading && (
        <div className="text-sm text-muted-foreground text-center py-8">Loading...</div>
      )}

      {!isLoading && (!profiles || profiles.length === 0) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">No attendees found matching your filters.</p>
        </div>
      )}

      <div className="space-y-3">
        {profiles?.map((profile, i) => {
          const personaInfo = profile.persona ? personas[profile.persona] : null;
          const whatsappNum = profile.whatsapp?.replace(/\D/g, "");
          const whatsappLink = whatsappNum
            ? `https://wa.me/91${whatsappNum}`
            : null;

          return (
            <motion.div
              key={profile.id}
              className="p-4 rounded-xl bg-card border border-border"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {/* Persona badge */}
                  {personaInfo && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground mb-2">
                      {personaInfo.icon} {personaInfo.label}
                    </span>
                  )}

                  {/* Working on */}
                  {profile.working_on && (
                    <p className="text-sm font-medium text-foreground line-clamp-2">{profile.working_on}</p>
                  )}

                  {/* Looking for tags */}
                  {profile.looking_for && profile.looking_for.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {profile.looking_for.map((tagId) => {
                        const tag = lookingForTags.find((t) => t.id === tagId);
                        return tag ? (
                          <span
                            key={tagId}
                            className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium"
                          >
                            {tag.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                {/* WhatsApp button */}
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Chat
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Load more */}
      {profiles && profiles.length >= limit && (
        <div className="text-center">
          <button
            onClick={() => setLimit((prev) => prev + PAGE_SIZE)}
            className="px-6 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
