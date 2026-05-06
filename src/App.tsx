import { BadgeCheck, CheckCircle2, Lock, Network, Orbit } from "lucide-react";

function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background border-b-2 border-primary">
      <div className="flex justify-between items-center h-16 px-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-1">
          <Network className="text-primary w-6 h-6" />
          <span className="font-epilogue text-2xl font-extrabold text-primary tracking-tighter">MindGraph</span>
        </div>
        <button className="bg-primary text-white font-epilogue font-bold text-sm px-3 py-1.5 border-2 border-primary hard-shadow-sm lift-interaction active:translate-x-0 active:translate-y-0 text-center">
          Buy Now
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="px-5 pt-20 pb-16 flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="relative w-full aspect-square md:aspect-[3/2] border-2 border-primary overflow-hidden bg-surface-container-low mb-6">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtLU_3rQxetqOfmz7xmWGCap9RllwqzKFisbR6E6lThiR6gdm6PO2ex-VdbyyyRKJVgdxu9qDaeabSDzU6FvOD1XaNjDpY-FO6mHYGGMkBqBhDuevPeMtO7jtE29mQmmN2jTzuZqS8bN1etPXUyvL4YQOPCYbbJEQRf8LO8Nx6uinW5neH_T6YyqCqUn0m5yn7JM2AWRMLZIltxIIiTdOoqPeTX0PMWlrKSWdMwupYrFvrFEvy6WM9ealF2XSS6_sZ0ITtosD4wUe0"
          alt="Knowledge Graph Representation"
          className="w-full h-full object-cover grayscale-[0.2]"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="bg-primary text-white px-3 py-1.5 font-epilogue font-bold text-sm tracking-widest border-2 border-primary hard-shadow-sm rotate-3">
            VISUALIZE YOUR MIND
          </span>
        </div>
      </div>
      <h1 className="font-epilogue text-[36px] md:text-5xl lg:text-[64px] font-extrabold text-primary leading-[1.1] tracking-tight">
        The Second Brain That Thinks For You.
      </h1>
      <p className="font-manrope text-lg md:text-xl text-secondary">
        Dump your thoughts freely. Our AI finds the connections, surfaces patterns, and generates insights you didn't even know you had.
      </p>
      <div className="flex flex-col gap-3 mt-4">
        <button className="bg-accent-yellow text-primary font-epilogue text-xl md:text-2xl font-bold py-6 border-2 border-primary hard-shadow-md lift-interaction">
          Get Lifetime Access — $49
        </button>
        <div className="flex items-center gap-2 font-epilogue font-bold text-xs md:text-sm uppercase tracking-widest text-primary mt-2">
          <BadgeCheck className="w-5 h-5 shrink-0" />
          One-time purchase. No subscriptions.
        </div>
      </div>
    </section>
  );
}

function Reality() {
  return (
    <section className="bg-secondary-container px-5 py-20 flex flex-col border-y-2 border-primary">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-2 mb-12">
          <span className="font-epilogue font-bold text-sm text-primary uppercase tracking-tighter bg-white self-start px-2 py-0.5 border-2 border-primary">THE REALITY</span>
          <h2 className="font-epilogue text-[32px] md:text-5xl font-bold text-primary leading-tight tracking-tight max-w-2xl">Note-taking is broken. Insight generation is the future.</h2>
        </div>
        
        <div className="flex flex-col md:grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 mt-4">
          <div className="bg-surface border-2 border-primary hard-shadow-md p-8 relative flex flex-col gap-3">
            <div className="absolute -top-5 -left-5 bg-primary text-white w-10 h-10 flex items-center justify-center font-epilogue font-bold text-xl border-2 border-primary">1</div>
            <h3 className="font-epilogue text-2xl font-bold">Capture Everything</h3>
            <p className="font-manrope text-base text-on-surface-variant">Throw in voice memos, messy texts, or full documents. Don't worry about folders or tags.</p>
          </div>
          
          <div className="bg-surface border-2 border-primary hard-shadow-md p-8 relative flex flex-col gap-3">
            <div className="absolute -top-5 -left-5 bg-primary text-white w-10 h-10 flex items-center justify-center font-epilogue font-bold text-xl border-2 border-primary">2</div>
            <h3 className="font-epilogue text-2xl font-bold">AI autoConnect.ts</h3>
            <p className="font-manrope text-base text-on-surface-variant">Our logic engine embeds every thought. It sees the semantic thread between a meeting note and a midnight idea.</p>
          </div>
          
          <div className="bg-surface border-2 border-primary hard-shadow-md p-8 relative flex flex-col gap-3">
            <div className="absolute -top-5 -left-5 bg-primary text-white w-10 h-10 flex items-center justify-center font-epilogue font-bold text-xl border-2 border-primary">3</div>
            <h3 className="font-epilogue text-2xl font-bold">Weekly Synthesis</h3>
            <p className="font-manrope text-base text-on-surface-variant">Wake up every Monday to a deep-dive report of your own subconscious patterns and emerging projects.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Privacy() {
  return (
    <section className="px-5 py-24 flex flex-col gap-8 items-center text-center max-w-3xl mx-auto">
      <Lock className="w-12 h-12 text-primary" strokeWidth={1.5} />
      <h2 className="font-epilogue text-[40px] md:text-6xl font-extrabold leading-[1.1] tracking-tight">Premium by Design.<br/>Private by Default.</h2>
      <p className="font-manrope text-lg md:text-xl text-secondary max-w-2xl">
        We believe your mind should be your own. Our "Bring Your Own Key" architecture ensures that MindGraph never touches your private data or shared AI keys.
      </p>
      <div className="w-full h-px bg-primary opacity-20 my-4 max-w-2xl"></div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="border-2 border-primary p-3">
          <p className="font-epilogue font-bold text-sm tracking-widest">E2E ENCRYPTED</p>
        </div>
        <div className="border-2 border-primary p-3">
          <p className="font-epilogue font-bold text-sm tracking-widest">LOCAL FIRST</p>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="px-5 py-20 flex flex-col bg-surface-container border-t-2 border-primary">
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-12">
        <h2 className="font-epilogue text-[32px] md:text-5xl font-bold border-b-2 border-primary pb-4 tracking-tight">Core Systems</h2>
        
        <div className="flex flex-col gap-4">
          <h3 className="font-epilogue text-2xl font-bold flex items-center gap-2 mb-2">
            <Orbit className="w-8 h-8" />
            Thought Nodes
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-accent-yellow border-2 border-primary p-3 md:p-4 hard-shadow-sm flex flex-col gap-2">
              <span className="font-epilogue font-bold text-xs uppercase tracking-widest">Idea</span>
              <div className="h-2.5 w-12 bg-primary"></div>
            </div>
            <div className="bg-accent-pink border-2 border-primary p-3 md:p-4 hard-shadow-sm flex flex-col gap-2">
              <span className="font-epilogue font-bold text-xs uppercase tracking-widest">Worry</span>
              <div className="h-2.5 w-12 bg-primary"></div>
            </div>
            <div className="bg-accent-green border-2 border-primary p-3 md:p-4 hard-shadow-sm flex flex-col gap-2">
              <span className="font-epilogue font-bold text-xs uppercase tracking-widest">Task</span>
              <div className="h-2.5 w-12 bg-primary"></div>
            </div>
            <div className="bg-accent-purple border-2 border-primary p-3 md:p-4 hard-shadow-sm flex flex-col gap-2">
              <span className="font-epilogue font-bold text-xs uppercase tracking-widest">Insight</span>
              <div className="h-2.5 w-12 bg-primary"></div>
            </div>
          </div>
        </div>

        <div className="bg-surface border-2 border-primary p-6 md:p-10 flex flex-col gap-4 md:gap-6 hard-shadow-md">
          <div className="w-full h-32 md:h-48 overflow-hidden border-2 border-primary relative bg-[#e3dfd3]">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwfbBJoj3PL76lssnVqiMtFyhN8ZM47vmTrroBretQoilabTRWBxDDcM5veXPMlgD4xSc96KgKAzpg3exIw9yAtI14PwncfrIbEgjotAesnL2lizkeCSb1hHwoLQD_V-rs9uVQ6J2k9JzV7dZwGsy03z1_QGKGrKiEWHE-VtHamFuaT4T37lPOAQvuXCliNwOztqi309CkkvTcy8GGrKTB9vMrryX77846VqPrvrufsWyIaj2WCZ1QSEiQLydhd54T4war1ky2M76x" 
              alt="Voice Capture UI" 
              className="w-full h-full object-cover mix-blend-multiply opacity-80 scale-[1.3]"
            />
          </div>
          <h3 className="font-epilogue text-2xl font-bold">Talk to your graph.</h3>
          <p className="font-manrope text-lg text-secondary">Native speech recognition built-in. Capture epiphanies while driving or walking.</p>
        </div>

        <div className="bg-white border-2 border-primary p-6 md:p-10 hard-shadow-lg">
          <div className="flex justify-between items-center mb-8 border-b-2 border-primary pb-4">
            <span className="font-epilogue font-bold text-sm md:text-base tracking-widest">✦ WEEKLY DIGEST</span>
            <span className="font-epilogue font-bold text-sm md:text-base tracking-widest">OCT 24</span>
          </div>
          <div className="flex flex-col gap-8">
            <div className="space-y-3">
              <div className="h-5 w-full bg-secondary-container"></div>
              <div className="h-5 w-3/4 bg-secondary-container"></div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-16 h-16 shrink-0 rounded-full border-2 border-primary bg-accent-purple overflow-hidden"></div>
              <p className="font-manrope text-lg md:text-xl font-bold italic">"You've mentioned 'Scaling' and 'Anxiety' together 12 times this week."</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="px-5 py-24 flex flex-col items-center border-t-2 border-primary bg-background">
      <div className="w-full max-w-lg bg-accent-yellow border-2 border-primary hard-shadow-lg p-10 md:p-14 flex flex-col gap-8 items-center text-center">
        <span className="font-epilogue font-bold text-sm uppercase tracking-[0.2em]">OWN YOUR MIND</span>
        <h2 className="font-epilogue text-[80px] md:text-[96px] font-bold leading-none tracking-tight">$49</h2>
        <span className="font-epilogue text-2xl font-bold">One-time payment</span>
        
        <div className="flex flex-col gap-4 w-full text-left py-8">
          <div className="flex items-center gap-3 border-b-2 border-primary/20 pb-4">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-primary" strokeWidth={2.5}/>
            <p className="font-manrope text-lg font-bold">Lifetime updates</p>
          </div>
          <div className="flex items-center gap-3 border-b-2 border-primary/20 pb-4">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-primary" strokeWidth={2.5} />
            <p className="font-manrope text-lg font-bold">OpenAI, Gemini, Ollama support</p>
          </div>
          <div className="flex items-center gap-3 border-b-2 border-primary/20 pb-4">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-primary" strokeWidth={2.5}/>
            <p className="font-manrope text-lg font-bold">Zero friction deployment</p>
          </div>
        </div>
        
        <button className="w-full bg-primary text-white font-epilogue text-2xl font-bold py-6 border-2 border-primary hard-shadow-md lift-interaction">
          Buy Now
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full py-16 bg-surface-container border-t-2 border-primary px-5 flex flex-col items-center gap-8">
      <div className="flex items-center gap-2">
        <Network className="text-primary w-8 h-8" />
        <span className="font-epilogue text-2xl font-extrabold text-primary tracking-tighter">MindGraph</span>
      </div>
      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        <a className="font-manrope text-lg font-bold text-secondary hover:text-primary transition-colors cursor-pointer" href="#">Terms</a>
        <a className="font-manrope text-lg font-bold text-secondary hover:text-primary transition-colors cursor-pointer" href="#">Privacy</a>
        <a className="font-manrope text-lg font-bold text-secondary hover:text-primary transition-colors cursor-pointer" href="#">Twitter</a>
        <a className="font-manrope text-lg font-bold text-secondary hover:text-primary transition-colors cursor-pointer" href="#">Support</a>
      </div>
      <p className="font-manrope text-base text-secondary text-center mt-4">
        © 2024 MindGraph. Built for deep thinkers.
      </p>
    </footer>
  );
}

export default function App() {
  return (
    <div className="bg-background text-primary selection:bg-primary selection:text-white min-h-screen">
       <Header />
       <main className="pt-16">
          <Hero />
          <Reality />
          <Privacy />
          <Features />
          <Pricing />
       </main>
       <Footer />
    </div>
  )
}
