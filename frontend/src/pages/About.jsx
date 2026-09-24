import { Shield, UserRound } from "lucide-react";

import devPhoto from "../assets/developer-member.jpg";
import riteshPhoto from "../assets/ritesh-ai.png";
import harshPhoto from "../assets/harsh-research.jpg";

import Layout from "../components/layout/Layout";
import Tag from "../components/common/Tag";
import SectionIntro from "../components/common/SectionIntro";
import Cta from "../components/common/Cta";

const green = "text-[#08ad50]";

export default function About() {
  return (
    <Layout>
      <section className="hero-grid px-5 py-20 text-center lg:px-10">
        <Tag icon={UserRound}>THE PEOPLE BEHIND JOBGUARD+</Tag>

        <h1 className="mt-6 font-display text-6xl font-bold tracking-tight">
          Meet Our
          <br />
          <span className={green}>Team.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500">
          JobGuard+ is built by people passionate about technology,
          cybersecurity and safer digital experiences for job seekers.
        </p>
      </section>

      <section className="px-5 py-20 lg:px-10">
        <SectionIntro
          tag="OUR TEAM"
          title="People Behind the Project"
          text="A focused team making job searching safer, smarter and more reliable."
        />

        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "Frontend & UI",
              "Raghav Pokar",
              "Crafting responsive user interfaces, design systems and seamless user experience.",
              devPhoto,
            ],
            [
              "Backend & Cybersecurity",
              "Ketan Kolapkar",
              "Building secure API architecture, database workflows, testing and code reviews.",
              devPhoto,
            ],
            [
              "Full Stack Developer",
              "Ritesh Bhosale",
              "Building end-to-end frontend and backend systems, integrating Gemini AI, APIs, databases, and intelligent job-risk analysis features.",
              riteshPhoto,
            ],
            [
              "Research & UI",
              "Harsh Limbani",
              "Investigating job scam techniques, threat intelligence and refining UI workflows.",
              harshPhoto,
            ],
          ].map(([role, name, desc, photo]) => (
            <article
              key={name}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <img
                src={photo}
                alt={name}
                className="h-72 w-full object-cover object-top"
              />

              <div className="p-5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#08ad50]">
                  {role}
                </span>

                <h3 className="mt-2 font-display text-xl font-bold">
                  {name}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-20 lg:px-10">
        <div className="mx-auto grid max-w-6xl items-center gap-8 rounded-3xl border border-[#c9efd6] bg-[#f4fff8] p-8 sm:p-12 md:grid-cols-[.35fr_1fr]">
          <div className="grid h-24 w-24 place-items-center rounded-3xl bg-[#eafff1] text-[#08ad50]">
            <Shield size={44} />
          </div>

          <div>
            <span className="text-[11px] font-extrabold tracking-widest text-[#08ad50]">
              WHY WE BUILT JOBGUARD+
            </span>

            <h2 className="mt-2 font-display text-3xl font-bold">
              Making job searching a little safer.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Our goal is to combine technology, security and simple
              explanations into one easy-to-use platform that helps people
              identify suspicious opportunities before making risky decisions.
            </p>
          </div>
        </div>
      </section>

      <Cta />
    </Layout>
  );
}