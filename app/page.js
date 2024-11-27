import Hero from "@/components/Hero";
import Timeline from "@/components/Timeline";
import Quiz from "@/components/Quiz";
import ContactForm from "@/components/ContactForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default async function Home() {

  return (
    <div>
      <Hero />
      <Timeline />
      <Quiz />
      <ContactForm />
      <LanguageSwitcher  />
    </div>
  );
}
