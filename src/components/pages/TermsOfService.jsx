import { FiFileText } from "react-icons/fi";

const sections = [
  {
    title: "1. About Stocksave AI",
    body: "Stocksave AI enables users to make weekly or monthly monetary contributions toward bulk purchase of food items. At the end of a selected contribution period, the total contributed amount is used to purchase foodstuffs of equivalent value, often at a reduced cost due to bulk purchasing. Stocksave AI is not a bank, cooperative society, investment platform, or financial institution.",
  },
  {
    title: "2. Eligibility",
    body: "Users must be 18 years or older. By using the App, you confirm that you have the legal capacity to enter into a binding agreement under Nigerian law.",
  },
  {
    title: "3. Account Registration and Security",
    body: "Users must create an account to access the Service. Passwords must be at least 10 characters and include uppercase letters, lowercase letters, and special characters. Users are responsible for maintaining the confidentiality of their login credentials. Session timeouts and other security controls may be implemented. All activity under a user’s account is their responsibility.",
  },
  {
    title: "4. Contributions & Payment Plans",
    body: "Contributions may be made weekly or monthly depending on the selected plan. Contributions are used solely for bulk food purchases. Contributions are not savings deposits, do not earn interest, and are not investments. Once a contribution cycle is completed and food procurement begins, contributions are generally non refundable except where required by law or at the discretion of Stocksave AI.",
  },
  {
    title: "5. Food Procurement",
    body: "Food items are purchased based on total contributed amounts. Prices and availability may vary due to market conditions. Stocksave AI may work with third-party suppliers or vendors. No guarantee is made regarding specific brands or vendors unless explicitly stated.",
  },
  {
    title: "6. User Conduct & Prohibited Activities",
    body: "Users must not engage in illegal or fraudulent activity. Users must not harass, abuse, or harm others. Users must not impersonate individuals or entities. Users must not use bots, scripts, or automated systems. Users must not attempt to reverse-engineer or disrupt the platform. Violations may result in suspension or termination of accounts.",
  },
  {
    title: "7. Intellectual Property",
    body: "All platform content, software, branding, and design elements belong to Stocksave AI or its licensors and may not be reused without permission.",
  },
  {
    title: "8. Disclaimer of Warranties",
    body: "The App is provided ‘as is’ and ‘as available.’ No guarantees are made regarding availability, pricing accuracy, market stability, or third-party performance. The platform does not provide financial, legal, or investment advice.",
  },
  {
    title: "9. Limitation of Liability",
    body: "Stocksave AI is not liable for market-driven price changes. Stocksave AI is not liable for vendor delays or failures. Stocksave AI is not liable for losses caused by user negligence. Use of the App is at the user’s own risk.",
  },
  {
    title: "10. Account Termination",
    body: "Users may delete their accounts at any time. Stocksave AI may suspend or terminate accounts at its discretion.",
  },
  {
    title: "11. Governing Law",
    body: "These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes arising from these Terms or your use of Stock Save AI shall be resolved in Nigerian courts.",
  },
  {
    title: "12. Changes to Terms",
    body: "Stocksave AI may update these Terms at any time. Continued use constitutes acceptance of updated Terms.",
  },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-neutral-100 py-6 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto rounded-card overflow-hidden border border-neutral-200 bg-white shadow-card">
        <div className="bg-success px-6 py-14 text-center text-white">
          <div className="flex justify-center mb-5">
            <div className="bg-white/20 p-4 rounded-2xl">
              <FiFileText className="text-3xl" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Terms of Service
          </h1>

          <p className="mt-2 text-sm text-white/90">
            Last Updated: February 25, 2026
          </p>
        </div>

        <div className="px-5 sm:px-10 py-10 space-y-10">
          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-lg font-semibold text-neutral-900">
                {section.title}
              </h2>
              <p className="text-sm leading-7 text-neutral-700">
                {section.body}
              </p>
            </section>
          ))}
          T
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              Contact Us
            </h2>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-sm">
              <span className="font-semibold text-neutral-700 mr-2">
                Email:
              </span>
              <span className="text-success font-medium">
                support@stocksaveai.ng
              </span>
            </div>
          </section>
        </div>

        <div className="border-t border-neutral-200 px-5 sm:px-10 py-5 text-center text-xs text-neutral-500">
          © 2026 Stocksave AI. All rights reserved.
        </div>
      </div>
    </div>
  );
}
