import { TbCurrencyNaira } from "react-icons/tb";
import FeatureCard from "../ui/FeatureCard";
import { MdOutlinePayment } from "react-icons/md";
import { LiaVenusDoubleSolid } from "react-icons/lia";

export default function OurFeatures() {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-h2 text-center mb-2">Everything You Need</h2>
        <p className="text-neutral-600 mb-8 text-center">
          Powerful features to help you save and manage
        </p>
        <div className="grid md:grid-cols-3 gap-16 px-[60px] py-8">
          <FeatureCard
            title="Flexible Savings"
            description="Create custom plans to save daily, weekly or monthly."
            icon={<TbCurrencyNaira />}
            iconBg="#22C55E"
            iconBorder="#22C55E"
            points={[
              "Automated savings tracking",
              "Manual cash input",
              "Progress tracking & goals",
            ]}
            pointColor="#22C55E"
          />
          <FeatureCard
            title="Shared Food Stock"
            description="Access shared food inventory, track items & quantities."
            icon={<LiaVenusDoubleSolid />}
            iconBg="#2F6FED"
            iconBorder="#2F6FED"
            points={[
              "Real-time stock updates",
              "Item availability alerts",
              "Community sharing",
            ]}
            pointColor="#2F6FED"
          />
          <FeatureCard
            title="Payment Plans"
            description="Customize your saving schedule."
            icon={<MdOutlinePayment />}
            iconBg="green"
            iconBorder="green"
            points={[
              "Daily, weekly, monthly",
              "Flexible and easy",
              "Payment reminders",
            ]}
            pointColor="#F59E0B"
          />
        </div>
      </div>
    </section>
  );
}
