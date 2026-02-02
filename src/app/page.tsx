import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-poker-felt-dark to-neutral-950">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎰</span>
            <span className="text-xl font-bold text-white">Study Poker</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-white hover:text-poker-gold transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Turn Study Time Into{' '}
            <span className="text-poker-gold">Winning Hands</span>
          </h1>
          <p className="text-xl text-white/90 mb-8">
            A gamified Pomodoro timer that rewards your focus with poker chips.
            Build your stack, climb the ranks, and become a Study Legend.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Start Playing Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <FeatureCard
            icon="⏱️"
            title="Focused Sessions"
            description="Choose your session type: Quick Hand (15min), Standard (25min), or Deep Stack (45min)."
          />
          <FeatureCard
            icon="🪙"
            title="Earn Chips"
            description="Get rewarded for your focus. Rate your session quality to boost your chip earnings."
          />
          <FeatureCard
            icon="🏆"
            title="Rank Up"
            description="Progress through 12 poker ranks from Fish to GOAT as you accumulate chips."
          />
        </div>

        {/* Rank Preview */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Climb the Ranks</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <RankBadge rank="Fish" chips="0" color="text-cyan-400" />
            <RankBadge rank="Calling Station" chips="500" color="text-pink-500" />
            <RankBadge rank="ABC" chips="1,000" color="text-yellow-300" />
            <RankBadge rank="TAG Regular" chips="2,000" color="text-purple-500" />
            <RankBadge rank="Semi Pro" chips="5,000" color="text-orange-500" />
            <RankBadge rank="Grinder" chips="10,000" color="text-green-500" />
            <RankBadge rank="Shark" chips="20,000" color="text-blue-500" />
            <RankBadge rank="Pro" chips="50,000" color="text-slate-500" />
            <RankBadge rank="High Roller" chips="100,000" color="text-red-500" />
            <RankBadge rank="Champion" chips="250,000" color="text-white" />
            <RankBadge rank="Legend" chips="500,000" color="text-lime-500" />
            <RankBadge rank="GOAT" chips="1,000,000" color="text-amber-400" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-neutral-800">
        <div className="text-center text-neutral-500 text-sm">
          <p>© {new Date().getFullYear()} Study Poker. Built for focused learners.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-neutral-950 border border-neutral-700 rounded-xl p-6 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/80">{description}</p>
    </div>
  );
}

function RankBadge({
  rank,
  chips,
  color,
}: {
  rank: string;
  chips: string;
  color: string;
}) {
  return (
    <div className="bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-3">
      <div className={`font-semibold ${color}`}>{rank}</div>
      <div className="text-xs text-white/70">{chips}+ chips</div>
    </div>
  );
}
