import HeroSlideForm from "@/app/_components/admin/HeroSlideForm";

export default function NewHeroSlidePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-heading">Add New Slide</h1>
      <HeroSlideForm />
    </div>
  );
}
