import { getHeroSlideById } from "@/app/_lib/data-service";
import HeroSlideForm from "@/app/_components/admin/HeroSlideForm";

export default async function EditHeroSlidePage({ params }) {
  const { id } = await params;
  const slide = await getHeroSlideById(id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-heading">Edit Slide</h1>
      <HeroSlideForm slide={slide} />
    </div>
  );
}
