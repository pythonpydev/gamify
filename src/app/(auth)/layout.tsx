export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-poker-felt-dark to-neutral-950 flex items-center justify-center p-4">
      <div className="w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">🎰</span>
            <span className="text-2xl font-bold text-white">Pokerdoro</span>
          </a>
        </div>

        {children}
      </div>
    </div>
  );
}
