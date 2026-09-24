import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Link2,
  Radar,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import heroImage from "../assets/jobguard-hero.png";

import Layout from "../components/layout/Layout";
import Tag from "../components/common/Tag";
import SectionIntro from "../components/common/SectionIntro";
import InfoCard from "../components/common/InfoCard";
import Cta from "../components/common/Cta";

const green = "text-[#08ad50]";

const button =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#078e42] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#08ad50]/20 transition hover:-translate-y-0.5 hover:bg-[#06783a] disabled:cursor-not-allowed disabled:opacity-60";

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <Layout>
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="hero-grid border-b border-slate-100/80">
        <div className="w-full items-center justify-between gap-8 px-6 py-16 lg:grid lg:min-h-[640px] lg:grid-cols-[0.9fr_1.2fr] lg:px-12 lg:py-10">
          <div className="max-w-2xl">
            <Tag>AI-POWERED JOB SAFETY</Tag>

            <h1 className="mt-7 font-display text-6xl font-bold leading-[.94] tracking-[-0.06em] sm:text-7xl lg:text-[82px]">
              Find Jobs,
              <br />
              <span className={green}>Not Scams.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-500">
              Verify job postings, detect scams and apply with confidence.
              JobGuard+ helps you stay one step ahead in your career journey.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/scan" className={button}>
                Check a Job Post
                <ArrowRight size={17} />
              </Link>

              <button
                type="button"
                onClick={() => setShowDemo(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-[#08ad50] hover:text-[#08ad50]"
              >
                <Sparkles size={17} />
                Watch Demo
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center overflow-hidden lg:justify-end">
            <img
              src={heroImage}
              alt="JobGuard job safety illustration"
              className="h-auto w-full max-w-xl object-contain lg:max-w-3xl xl:max-w-[800px]"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW JOBGUARD WORKS
      ===================================================== */}
      <section id="system" className="section-band">
        <SectionIntro
          tag="WHAT HAPPENS BEHIND THE SCENES"
          title="How JobGuard Checks a Job"
          text="When you scan a job link, JobGuard opens it safely, watches what happens on the page and turns the collected evidence into a clear risk report."
        />

        <div className="mx-auto grid max-w-7xl gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
          {[
            [
              Link2,
              "Job Link",
              "Paste the job posting URL and start a scan.",
            ],
            [
              Radar,
              "FastAPI",
              "The backend creates and manages your scan.",
            ],
            [
              Shield,
              "Sandbox",
              "Every investigation runs in an isolated environment.",
            ],
            [
              Search,
              "Playwright",
              "A real browser observes the job site safely.",
            ],
          ].map(([Icon, title, text], i) => (
            <InfoCard
              key={title}
              Icon={Icon}
              title={`${i + 1}. ${title}`}
              text={text}
            />
          ))}
        </div>
      </section>

      {/* =====================================================
          SIMPLE STEPS
      ===================================================== */}
      <section className="px-5 py-20 lg:px-10">
        <SectionIntro
          tag="HOW IT WORKS"
          title="Your Safety, Our Priority"
          text="Three simple steps to verify any job posting."
        />

        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {[
            [
              Link2,
              "Paste Job Link",
              "Add the URL of the job posting you want to investigate.",
            ],
            [
              Search,
              "We Investigate",
              "Our system checks website behaviour, redirects, forms and suspicious signals.",
            ],
            [
              ShieldCheck,
              "Get Your Report",
              "See the risk level, findings and safety guidance instantly.",
            ],
          ].map(([Icon, title, text], i) => (
            <InfoCard
              key={title}
              Icon={Icon}
              title={`0${i + 1}  ${title}`}
              text={text}
            />
          ))}
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}
      <Cta />

      {/* =====================================================
          YOUTUBE DEMO MODAL
      ===================================================== */}
      {showDemo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
          onClick={() => setShowDemo(false)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowDemo(false)}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-white transition hover:bg-black"
              aria-label="Close demo"
            >
              <X size={20} />
            </button>

            {/* YouTube Video */}
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/WayhRngpOgU?autoplay=1"
                title="JobGuard AI Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
