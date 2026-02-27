import Navbar from "../layout/Navbar";
import { HiOutlineMail } from "react-icons/hi";
import { FiPhone } from "react-icons/fi";
import Footer from "../layout/Footer";

function Contact() {
  return (
    <>
      <Navbar />

      <section className="bg-[#f8fafc] min-h-screen flex flex-col justify-between">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900">
            Get in <span className="text-green-600">Touch</span>
          </h1>

          <p className="mt-6 text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Have questions? Whether you're a vendor looking to streamline your
            bulk food system or a cooperative group seeking better coordination,
            we’d love to hear from you.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-green-100 mb-6">
              <HiOutlineMail className="text-green-600 text-2xl" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Email Us
            </h3>

            <p className="text-gray-500 text-sm mb-4">
              Our team will respond within 24 hours
            </p>

            <p className="text-green-600 font-medium text-sm">
              support@stocksaveai.ng
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-indigo-100 mb-6">
              <FiPhone className="text-indigo-600 text-2xl" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Customer Support
            </h3>

            <p className="text-gray-500 text-sm leading-relaxed">
              Available Monday – Friday <br />
              9:00 AM – 5:00 PM (WAT) <br />
              Have questions or suggestions? Don’t hesitate to drop us a
              message. We’d love to hear from you!
            </p>
          </div>
        </div>

        <Footer />
      </section>
    </>
  );
}

export default Contact;
