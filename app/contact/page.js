import Link from "next/link";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import ContactForm from "@/app/_components/contact/ContactForm";
import { siteConfig } from "@/app/_lib/siteConfig";

export const metadata = {
  title: "Contact | Saamj Store",
  description: "Get in touch with us",
};

const contactInfo = [
  {
    id: 1,
    icon: <MapPinIcon className="w-5 h-5 text-white" />,
    title: "Address",
    description: siteConfig.address,
  },
  {
    id: 2,
    icon: <EnvelopeIcon className="w-5 h-5 text-white" />,
    title: "Email",
    description: siteConfig.contactEmail,
  },
  {
    id: 3,
    icon: <PhoneIcon className="w-5 h-5 text-white" />,
    title: "Support",
    description: siteConfig.supportPhoneNumber,
  },
];

export default async function ContactPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const success = resolvedParams?.success === "true";

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-dark-light py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Contact</h1>
          <div className="flex items-center gap-2 text-sm mt-1">
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
            <span className="text-gray-medium">/</span>
            <span className="text-gray-medium">Contact</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left - Contact Info */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-2xl font-bold text-dark mb-4">
                Get In Touch
              </h2>
              <p className="text-text-light text-sm leading-relaxed">
                Have a question about your order or our products? We are here to
                help. Reach out to us and we will get back to you as soon as
                possible.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {contactInfo.map((item) => (
                <div key={item.id} className="flex items-start gap-4">
                  <div className="bg-primary p-3 rounded-full shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-dark font-semibold mb-1">
                      {item.title}
                    </h3>
                    <p className="text-text-light text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="bg-gray-light p-8">
            <h2 className="text-2xl font-bold text-dark mb-6">
              Send a Message
            </h2>

            {success ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <CheckCircleIcon className="w-16 h-16 text-success" />
                <h3 className="text-xl font-bold text-dark">Message Sent!</h3>
                <p className="text-text-light text-sm">
                  Thank you for reaching out. We will get back to you as soon as
                  possible.
                </p>
                <Link
                  href="/contact"
                  className="text-primary text-sm hover:underline"
                >
                  Send another message
                </Link>
              </div>
            ) : (
              <ContactForm />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
