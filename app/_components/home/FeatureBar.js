import {
  ShoppingCartIcon,
  PhoneIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { FREE_SHIPPING_THRESHOLD } from "@/app/_lib/helpers";

const features = [
  {
    id: 1,
    icon: <ShoppingCartIcon className="w-6 h-6 md:w-8 md:h-8" />,
    title: "Free Shipping",
    description: `On all orders over $${FREE_SHIPPING_THRESHOLD.toLocaleString()}`,
  },
  {
    id: 2,
    icon: <PhoneIcon className="w-6 h-6 md:w-8 md:h-8" />,
    title: "Dedicated Support",
    description: "Quick response 24/7",
  },
  {
    id: 3,
    icon: <CurrencyDollarIcon className="w-6 h-6 md:w-8 md:h-8" />,
    title: "Money-Back Guarantee",
    description: "Worry-free shopping",
  },
];

export default function FeaturesBar() {
  return (
    <section className="bg-dark py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-3 gap-4">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 text-center md:text-left justify-center"
          >
            <div className="bg-gray-light text-dark-light p-2 md:p-4 rounded-full shrink-0">
              {feature.icon}
            </div>
            <div className="md:mt-2">
              <h3 className="text-primary-light font-semibold text-xs md:text-lg leading-tight">
                {feature.title}
              </h3>
              <p className="text-gray-medium text-xs md:text-sm hidden md:block">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
