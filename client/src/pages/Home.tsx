import { FormEvent, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, CheckCircle2, Clock3, ExternalLink, MapPin, Phone, QrCode, Send, ShieldCheck, Star, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { FEEDBACK_TAGS, SERVICE_OPTIONS, SHOP } from "@shared/business";

const ratingLabels = ["Not happy", "Could be better", "It was okay", "Really good", "Excellent"];

export default function Home() {
  const submitFeedback = trpc.feedback.submit.useMutation();
  const [rating, setRating] = useState(5);
  const [npsScore, setNpsScore] = useState(10);
  const [serviceType, setServiceType] = useState<string>(SERVICE_OPTIONS[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>(["Helpful staff"]);
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [comment, setComment] = useState("");
  const [followUp, setFollowUp] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const source = useMemo(() => new URLSearchParams(window.location.search).get("source") === "google-qr" ? "google-qr" as const : "landing" as const, []);

  const scrollToFeedback = () => document.getElementById("feedback")?.scrollIntoView({ behavior: "smooth" });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await submitFeedback.mutateAsync({
        rating,
        npsScore,
        serviceType,
        customerName: customerName || undefined,
        customerContact: customerContact || undefined,
        comment: comment || undefined,
        tags: selectedTags,
        followUp,
        source,
      });
      setSubmitted(true);
      toast.success("Thanks — your feedback is now part of the shop's daily improvement loop.");
    } catch {
      toast.error("We couldn't save that just now. Please try once more.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f3ee] text-[#17221b]">
      <header className="sticky top-0 z-30 border-b border-[#173427]/10 bg-[#f5f3ee]/90 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-5">
          <a href="#top" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#173427] text-[#d9f36d] shadow-sm"><Wrench className="h-4 w-4" /></div>
            <div className="leading-tight"><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#50655b]">Harsh Computers</p><p className="font-serif text-lg font-semibold tracking-tight">Feedback hub</p></div>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium text-[#50655b] md:flex"><a href="#services" className="transition hover:text-[#173427]">Services</a><a href="#feedback" className="transition hover:text-[#173427]">Share feedback</a><a href="#visit" className="transition hover:text-[#173427]">Visit us</a></nav>
          <div className="flex items-center gap-2"><a className="hidden rounded-full px-3 py-2 text-sm font-semibold text-[#173427] transition hover:bg-[#e8e9df] sm:inline-flex" href={SHOP.phoneHref}><Phone className="mr-2 h-4 w-4" />Call shop</a><Link href="/dashboard"><Button className="rounded-full bg-[#173427] px-4 text-[#f7f9ef] hover:bg-[#294e3d]">Owner login <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link></div>
        </div>
      </header>

      <main id="top">
        <section className="container grid gap-10 pb-16 pt-12 lg:grid-cols-[1.03fr_0.97fr] lg:items-center lg:pb-24 lg:pt-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b8c986] bg-[#e9efcf] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#31543c]"><span className="h-2 w-2 rounded-full bg-[#87a53a]" /> Pune's local repair partner</div>
            <h1 className="max-w-xl font-serif text-5xl leading-[0.98] tracking-[-0.055em] text-[#173427] sm:text-6xl">Every repair deserves a better <span className="text-[#77952c]">after-care loop.</span></h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-[#5a6b62]">Tell the team what worked, what could be smoother, and what you need next. A quick note helps Harsh Computers keep service fast, fair, and human.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button onClick={scrollToFeedback} className="h-12 rounded-full bg-[#d7ef6d] px-6 font-bold text-[#173427] shadow-[0_12px_30px_rgba(125,151,49,0.2)] hover:bg-[#c9e65d]">Share your feedback <ArrowUpRight className="ml-2 h-4 w-4" /></Button><a href={SHOP.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center rounded-full border border-[#173427]/15 px-6 font-semibold text-[#31543c] transition hover:bg-white">See Google profile <ExternalLink className="ml-2 h-4 w-4" /></a></div>
            <div className="mt-9 flex flex-wrap items-center gap-5 text-sm text-[#5a6b62]"><span className="inline-flex items-center gap-2"><Star className="h-4 w-4 fill-[#c99436] text-[#c99436]" /><strong className="text-[#173427]">{SHOP.rating}</strong> from {SHOP.reviewCount} Google reviews</span><span className="hidden h-4 w-px bg-[#173427]/20 sm:block" /><span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#77952c]" /> Honest, private feedback</span></div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] bg-[#173427] p-5 text-[#f7f9ef] shadow-[0_22px_70px_rgba(23,52,39,0.22)] sm:p-7">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#d7ef6d]/15 blur-3xl" /><div className="absolute -bottom-20 -left-8 h-48 w-48 rounded-full bg-[#5b8363]/40 blur-3xl" />
            <div className="relative"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b7cfa3]">The shop pulse</p><h2 className="mt-3 font-serif text-3xl tracking-tight">Built for real conversations.</h2></div><div className="rounded-2xl border border-white/15 bg-white/10 p-3"><QrCode className="h-6 w-6 text-[#d7ef6d]" /></div></div><div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-5"><div className="flex items-end justify-between"><div><p className="text-sm text-[#b7cfa3]">Google profile rating</p><p className="mt-1 text-5xl font-semibold tracking-tight">{SHOP.rating}<span className="ml-2 text-2xl text-[#d7ef6d]">★</span></p></div><div className="text-right text-sm text-[#c6d5c8]"><p>{SHOP.reviewCount} public reviews</p><p className="mt-1 text-[#d7ef6d]">Thank you, Pune.</p></div></div></div><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-white/10 bg-[#284c3c] p-4"><p className="text-2xl font-semibold">10–8:30</p><p className="mt-1 text-xs text-[#b7cfa3]">Mon–Sat hours</p></div><div className="rounded-2xl border border-white/10 bg-[#284c3c] p-4"><p className="text-2xl font-semibold">1 min</p><p className="mt-1 text-xs text-[#b7cfa3]">to share feedback</p></div></div><p className="mt-6 text-sm leading-6 text-[#c6d5c8]">Scan the QR at the counter to review on Google, or leave a private note here so the team can act quickly.</p></div>
          </div>
        </section>

        <section id="services" className="border-y border-[#173427]/10 bg-[#ebe9e0]"><div className="container py-14"><div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#77952c]">What we help with</p><h2 className="mt-3 max-w-sm font-serif text-4xl leading-tight tracking-[-0.04em] text-[#173427]">Small fixes. Big peace of mind.</h2></div><p className="max-w-xl text-base leading-7 text-[#5a6b62]">From a laptop that will not boot to a phone setup that should just work, Harsh Computers combines practical repair guidance with straightforward pricing.</p></div><div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["01", "Laptop repair", "Diagnostics, hardware fixes, cleaning, and setup."], ["02", "Mobile repair", "Practical support for everyday phone issues."], ["03", "Sales & accessories", "Useful devices and essentials without the noise."], ["04", "After-care", "Clear answers and a feedback loop that sticks."]].map(([number, title, copy]) => <div key={number} className="rounded-2xl border border-[#173427]/10 bg-[#f5f3ee] p-5 transition hover:-translate-y-1 hover:shadow-lg"><p className="text-xs font-bold tracking-[0.15em] text-[#9aaa5e]">{number}</p><h3 className="mt-8 text-lg font-semibold text-[#173427]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#68766e]">{copy}</p></div>)}</div></div></section>

        <section id="feedback" className="container grid gap-12 py-16 lg:grid-cols-[0.74fr_1.26fr] lg:py-24">
          <div className="lg:pt-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#77952c]">Private feedback form</p><h2 className="mt-3 max-w-md font-serif text-4xl leading-tight tracking-[-0.04em] text-[#173427]">Help the team keep the good, fix the friction.</h2><p className="mt-5 max-w-md leading-7 text-[#5a6b62]">Your note goes to the shop team, not a public wall. Be as specific as you like — repair details help the team learn faster.</p><div className="mt-8 space-y-4 text-sm text-[#4f6257]"><div className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#77952c]" /><span>Ratings are captured as a simple 1–5 service signal.</span></div><div className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#77952c]" /><span>NPS shows whether customers would recommend the shop.</span></div><div className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#77952c]" /><span>Optional follow-up lets the team close the loop.</span></div></div></div>
          <div className="rounded-[2rem] border border-[#173427]/10 bg-white p-5 shadow-[0_20px_60px_rgba(23,52,39,0.08)] sm:p-8">
            {submitted ? <div className="flex min-h-[520px] flex-col items-center justify-center text-center"><div className="grid h-16 w-16 place-items-center rounded-full bg-[#e8f1c7] text-[#64821f]"><CheckCircle2 className="h-8 w-8" /></div><h3 className="mt-6 font-serif text-3xl text-[#173427]">Feedback received.</h3><p className="mt-3 max-w-sm leading-7 text-[#637269]">Thank you for helping Harsh Computers make every visit better. If you would like to share your experience publicly, you can leave an honest Google review too.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><a href={SHOP.mapsUrl} target="_blank" rel="noreferrer"><Button className="rounded-full bg-[#173427] text-white hover:bg-[#294e3d]">Open Google profile <ExternalLink className="ml-2 h-4 w-4" /></Button></a><Button variant="outline" onClick={() => setSubmitted(false)} className="rounded-full border-[#173427]/20">Send another note</Button></div></div> : <form onSubmit={submit} className="space-y-7"><div><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-[#173427]">How was the service?</p><p className="mt-1 text-xs text-[#748178]">Tap a star to rate your visit.</p></div><span className="rounded-full bg-[#edf2d8] px-3 py-1 text-xs font-bold text-[#557123]">{rating}/5</span></div><div className="mt-4 flex flex-wrap gap-2">{[1,2,3,4,5].map((value) => <button type="button" key={value} aria-label={`${value} star${value === 1 ? "" : "s"}`} onClick={() => setRating(value)} className={`grid h-11 w-11 place-items-center rounded-xl border transition ${value <= rating ? "border-[#c8dc7c] bg-[#f0f6d7] text-[#77952c]" : "border-[#173427]/10 bg-[#fafaf7] text-[#b9c0b8]"}`}><Star className={`h-5 w-5 ${value <= rating ? "fill-current" : ""}`} /></button>)}</div><p className="mt-2 text-xs text-[#748178]">{ratingLabels[rating - 1]}</p></div><div><p className="text-sm font-semibold text-[#173427]">How likely are you to recommend us?</p><div className="mt-3 grid grid-cols-6 gap-1.5 sm:grid-cols-11">{Array.from({ length: 11 }, (_, value) => <button type="button" key={value} onClick={() => setNpsScore(value)} className={`h-9 rounded-lg text-xs font-semibold transition ${npsScore === value ? "bg-[#173427] text-white" : "bg-[#f0f1eb] text-[#65746a] hover:bg-[#dfe6d5]"}`}>{value}</button>)}</div><div className="mt-2 flex justify-between text-[11px] text-[#89958d]"><span>Not at all likely</span><span>Extremely likely</span></div></div><div className="grid gap-4 sm:grid-cols-2"><div><label className="text-sm font-semibold text-[#173427]" htmlFor="service">What did you visit for?</label><select id="service" value={serviceType} onChange={(event) => setServiceType(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[#173427]/15 bg-[#fafaf7] px-3 text-sm text-[#173427] outline-none focus:border-[#77952c]">{SERVICE_OPTIONS.map((option) => <option key={option}>{option}</option>)}</select></div><div><label className="text-sm font-semibold text-[#173427]" htmlFor="name">Your name <span className="font-normal text-[#9ca69e]">(optional)</span></label><Input id="name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="e.g. Priya" className="mt-2 h-11 rounded-xl border-[#173427]/15 bg-[#fafaf7]" /></div></div><div><p className="text-sm font-semibold text-[#173427]">What stood out?</p><div className="mt-3 flex flex-wrap gap-2">{FEEDBACK_TAGS.map((tag) => { const active = selectedTags.includes(tag); return <button type="button" key={tag} onClick={() => setSelectedTags((current) => active ? current.filter((item) => item !== tag) : [...current, tag])} className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${active ? "border-[#b8ce6a] bg-[#eff5d8] text-[#557123]" : "border-[#173427]/10 bg-[#fafaf7] text-[#768279] hover:border-[#b8ce6a]"}`}>{tag}</button>; })}</div></div><div><label className="text-sm font-semibold text-[#173427]" htmlFor="comment">Tell us a little more <span className="font-normal text-[#9ca69e]">(optional)</span></label><Textarea id="comment" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="What went well, or what should we improve?" className="mt-2 min-h-28 rounded-xl border-[#173427]/15 bg-[#fafaf7]" maxLength={2000} /></div><div><label className="text-sm font-semibold text-[#173427]" htmlFor="contact">How can we reach you? <span className="font-normal text-[#9ca69e]">(optional)</span></label><Input id="contact" value={customerContact} onChange={(event) => setCustomerContact(event.target.value)} placeholder="Phone or email for a follow-up" className="mt-2 h-11 rounded-xl border-[#173427]/15 bg-[#fafaf7]" /></div><label className="flex items-start gap-3 rounded-xl bg-[#f4f5ef] p-3 text-sm text-[#5d6e63]"><input type="checkbox" checked={followUp} onChange={(event) => setFollowUp(event.target.checked)} className="mt-1 h-4 w-4 accent-[#77952c]" /><span>I'd like the team to follow up with me about this feedback.</span></label><Button type="submit" disabled={submitFeedback.isPending} className="h-12 w-full rounded-full bg-[#173427] text-white hover:bg-[#294e3d]">{submitFeedback.isPending ? "Saving your note…" : "Send private feedback"}<Send className="ml-2 h-4 w-4" /></Button></form>}
          </div>
        </section>

        <section id="visit" className="border-t border-[#173427]/10 bg-[#173427] text-[#f7f9ef]"><div className="container grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b7cfa3]">Come by the shop</p><h2 className="mt-3 max-w-lg font-serif text-4xl leading-tight tracking-[-0.04em]">Harsh Computers Laptop And Mobile Hub</h2><p className="mt-4 max-w-xl leading-7 text-[#c6d5c8]">{SHOP.address}</p><div className="mt-6 flex flex-col gap-3 text-sm text-[#d9e6d9] sm:flex-row sm:flex-wrap sm:gap-x-6"><a href={SHOP.phoneHref} className="inline-flex items-center gap-2 hover:text-[#d7ef6d]"><Phone className="h-4 w-4 text-[#d7ef6d]" />{SHOP.phone}</a><a href={SHOP.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[#d7ef6d]"><MapPin className="h-4 w-4 text-[#d7ef6d]" />Get directions</a></div></div><div className="rounded-2xl border border-white/10 bg-white/10 p-5"><div className="flex items-center gap-3"><Clock3 className="h-5 w-5 text-[#d7ef6d]" /><p className="font-semibold">Opening hours</p></div><div className="mt-4 space-y-2 text-sm">{SHOP.hours.map(([day, hours]) => <div key={day} className="flex justify-between border-b border-white/10 pb-2 text-[#c6d5c8]"><span>{day}</span><span className={hours === "Closed" ? "text-[#efb4a8]" : "text-[#f7f9ef]"}>{hours}</span></div>)}</div></div></div></section>
      </main>
      <footer className="bg-[#10271c] text-[#99ad9e]"><div className="container flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between"><p>Customer feedback hub for Harsh Computers, Pune.</p><a href={SHOP.websiteUrl} target="_blank" rel="noreferrer" className="hover:text-white">Official shop website <ExternalLink className="ml-1 inline h-3 w-3" /></a></div></footer>
    </div>
  );
}
