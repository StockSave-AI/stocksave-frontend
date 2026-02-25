import { Link } from "react-router-dom";
import Navbar from "../layout/Navbar";
import {
  FaBullseye,
  FaHeart,
  FaLock,
  FaChartLine,
  FaTrophy,
} from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";
import { GiFamilyHouse } from "react-icons/gi";
import { MdOutlineAttachMoney } from "react-icons/md";
import Footer from "../layout/Footer";

const values = [
  {
    title: "Community First",
    body: "We co-create with communities to deliver tools that respond to their daily needs.",
    icon: <BsPeopleFill className="text-green-500 w-6 h-6" />,
  },
  {
    title: "Accessibility",
    body: "Savings tech should be usable on any device and by every Nigerian household.",
    icon: <FaHeart className="text-purple-500 w-6 h-6" />,
  },
  {
    title: "Trust & Security",
    body: "We encrypt data, monitor activity, and guard funds with enterprise-grade controls.",
    icon: <FaLock className="text-yellow-500 w-6 h-6" />,
  },
  {
    title: "Innovation",
    body: "Artificial intelligence keeps your plans adaptive, predictive, and future-ready.",
    icon: <FaChartLine className="text-purple-500 w-6 h-6" />,
  },
];

const audiences = [
  {
    label: "Students",
    description:
      "Flexible savings plans and community purchasing to cover school and hostel meals.",
    icon: <GiFamilyHouse className="text-blue-600 w-6 h-6" />,
    badge: "Study Squad",
  },
  {
    label: "Families",
    description:
      "Manage shared contributions, track stock availability, and coordinate bulk buys.",
    icon: <MdOutlineAttachMoney className="text-green-600 w-6 h-6" />,
    badge: "Household Hero",
  },
  {
    label: "Low-Income Earners",
    description:
      "Create predictable savings habits with smart reminders and staggered plans.",
    icon: <FaBullseye className="text-purple-600 w-6 h-6" />,
    badge: "Daily Warrior",
  },
];

function HeroSection() {
  return (
    <section className="text-center space-y-5 my-12">
      <button className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-semibold">
        Our Story
      </button>
      <h1 className="text-3xl md:text-5xl font-bold">
        Empowering Nigerians to{" "}
        <span className="text-green-500">Save Smarter</span>
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        StockSaveAI is an intelligent savings and stock coordination platform
        that eliminates inefficiencies in community-based bulk food purchasing.
        We help vendors, cooperatives, and buyers monitor contributions, manage
        inventory, and coordinate reminders with AI-powered insights.
      </p>
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        <Link
          to="/signup"
          className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-green-600 transition"
        >
          Get Started Free
        </Link>
        <Link
          to="/contact"
          className="border border-gray-300 px-6 py-2 rounded-lg text-sm hover:bg-neutral-100 transition"
        >
          Contact Us
        </Link>
      </div>
    </section>
  );
}

function MissionVision() {
  return (
    <section className="grid md:grid-cols-2 gap-6 my-12">
      <div className="p-6 bg-green-50 rounded-lg flex flex-col gap-4">
        <FaBullseye className="text-green-500 w-8 h-8" />
        <h2 className="font-bold text-lg">Our Mission</h2>
        <p className="text-gray-600">
          To unlock collective purchasing power by making savings and food
          coordination accessible, automated, and trustable for every Nigerian
          community.
        </p>
      </div>
      <div className="p-6 bg-purple-50 rounded-lg flex flex-col gap-4">
        <FaHeart className="text-purple-500 w-8 h-8" />
        <h2 className="font-bold text-lg">Our Vision</h2>
        <p className="text-gray-600">
          To become Africa’s leading AI-powered coordination hub for savings and
          bulk purchasing.
        </p>
      </div>
    </section>
  );
}

function ValuesSection() {
  return (
    <section className="space-y-4 my-12">
      <h2 className="text-center text-2xl font-bold">Our Core Values</h2>
      <p className="text-center text-gray-500">
        Principles that guide everything we build.
      </p>
      <div className="grid md:grid-cols-4 gap-6">
        {values.map((value) => (
          <article
            key={value.title}
            className="p-4 bg-white rounded-lg flex flex-col gap-3 shadow-sm"
          >
            <div>{value.icon}</div>
            <h3 className="font-semibold">{value.title}</h3>
            <p className="text-gray-500 text-sm">{value.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AudienceSection() {
  return (
    <section className="space-y-6 text-center my-12">
      <h2 className="text-2xl font-bold">Who We Serve</h2>
      <p className="text-gray-500">
        Designed for everyday Nigerians seeking dependable savings.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {audiences.map((audience) => (
          <article
            key={audience.label}
            className="p-6 bg-white rounded-lg shadow-sm flex flex-col gap-4"
          >
            <div className="bg-neutral-100 w-12 h-12 rounded-full mx-auto flex items-center justify-center">
              {audience.icon}
            </div>
            <h3 className="font-semibold text-lg">{audience.label}</h3>
            <p className="text-gray-500 text-sm">{audience.description}</p>
            <span className="text-xs font-semibold uppercase tracking-wide text-green-500">
              {audience.badge}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

function JoinCommunity() {
  return (
    <section className="bg-gray-50 p-8 rounded-xl text-center space-y-4 my-12">
      <h2 className="text-2xl font-bold">Join Our Community</h2>
      <p className="text-gray-500">
        Be part of a movement making savings accessible and food affordable for
        all Nigerians.
      </p>
      <div className="flex justify-center gap-4 flex-wrap mt-4">
        <Link
          to="/signup"
          className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-green-600 transition"
        >
          Create Payment Plan
        </Link>
        <Link
          to="/contact"
          className="border border-gray-300 px-6 py-2 rounded-lg text-sm hover:bg-neutral-100 transition"
        >
          Contact Us
        </Link>
      </div>
    </section>
  );
}

function About() {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-14 lg:px-20 py-12 space-y-16">
        <HeroSection />
        <MissionVision />
        <ValuesSection />
        <AudienceSection />

        <JoinCommunity />
        <Footer />
      </main>
    </>
  );
}

export default About;
