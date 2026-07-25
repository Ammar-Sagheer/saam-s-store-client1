import { FREE_SHIPPING_THRESHOLD } from "@/app/_lib/helpers";

export default function AnnouncementBar() {
  return (
    <div className="bg-dark-light text-white text-center py-2 text-sm font-medium tracking-widest uppercase ">
      <p>
        Free Shipping On Orders Over ${FREE_SHIPPING_THRESHOLD.toLocaleString()}
      </p>
    </div>
  );
}
