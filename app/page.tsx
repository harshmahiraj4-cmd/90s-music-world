import Header from '@/components/layout/Header';
import HeroSection from '@/components/home/HeroSection';
import TrendingCard from '@/components/home/TrendingCard';
import TimeMachine from '@/components/home/TimeMachine';
import CassetteMemories from '@/components/home/CassetteMemories';
import MemoryLane from '@/components/home/MemoryLane';
import MoodDiscovery from '@/components/home/MoodDiscovery';
import ArtistSpotlight from '@/components/home/ArtistSpotlight';
import BollywoodHits from '@/components/home/BollywoodHits';

export default function HomePage() {
  return (
    <>
      <Header title="Home" subtitle="Dolby Stereo 90s" />
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-36 bg-background">
        <div className="flex flex-col w-full select-none pb-12 max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto w-full">
          <HeroSection />
          <TrendingCard />
          <TimeMachine />
          <CassetteMemories />
          <MemoryLane />
          <MoodDiscovery />
          <ArtistSpotlight />
          <BollywoodHits />
        </div>
      </main>
    </>
  );
}
