import React, { useState, useEffect } from 'react';
import { 
  Square, CheckSquare, Crosshair, 
  AlertTriangle, Clock, TerminalSquare,
  ArrowRight
} from 'lucide-react';

// --- DATA EXTRACTION ---
const WEEK_DATA = {
  monday: {
    dayName: "Monday",
    date: "Feb 23",
    focus: "AZ Work Focus",
    priority: "Get ahead of the week",
    events: [],
    meetings: [
      { time: "08:00", title: "Risk Register UAT Meeting" },
      { time: "10:00", title: "UAT Tracker / Video Concept" }
    ],
    tasks: [
      { id: "AZW-51", text: "Update Risk Register deck + align with ECS on deliverables (due Feb 25)" },
      { id: "AZW-63", text: "Send target dates for email notifications to ECS development team" },
      { id: "AZW-46", text: "Weekly Review (due Feb 27 — start prep)" },
      { id: "AZW-45", text: "Weekly Status Update (due Feb 26 — draft)" },
      { id: "AZW-82", text: "Clarify ONX video scope — Arthur's concept vs Emma/Sherri's video (urgent)" },
      { id: "AZW-TRIAGE", text: "Review AZ active issues: 7 In Progress, 70 Todo — triage anything overdue" }
    ]
  },
  tuesday: {
    dayName: "Tuesday",
    date: "Feb 24",
    focus: "Carpet Day + AZ Work",
    priority: "Carpet coordination is time-sensitive",
    events: ["Carpet guy measuring"],
    meetings: [
      { time: "08:00", title: "Risk Register UAT Meeting" },
      { time: "10:00", title: "Weekly 1:1" },
      { time: "11:00", title: "C-BAT Team Weekly" }
    ],
    tasks: [
      { id: "PER-CARPET1", text: "Carpet guy measuring — coordinate with Josiah on install timing + door trim clearance" },
      { id: "PER-CARPET2", text: "Confirm payment plan for 2nd half of carpets (upon completion)" },
      { id: "AZW-29", text: "Begin Phase 2 scoping and documentation" },
      { id: "AZW-43", text: "Monitor Cell Therapy Portal" },
      { id: "AZW-70", text: "Review URS for 'My Work' tab visibility in Risk Register" },
      { id: "AZW-CONT", text: "Continue AZ work tasks between carpet appointment and meetings" }
    ]
  },
  wednesday: {
    dayName: "Wednesday",
    date: "Feb 25",
    focus: "Deep Work Day",
    priority: "Build the transcript pipeline + AZ meetings",
    events: [],
    meetings: [
      { time: "08:00", title: "Risk Register UAT Meeting" },
      { time: "10:00", title: "O2R Assistant Weekly" },
      { time: "10:30", title: "GRD Initial Project Discussion" }
    ],
    tasks: [
      { id: "AZW-60", text: "Build AZ meeting transcript processing pipeline — start scoping the end-to-end flow" },
      { id: "AZW-59", text: "Governance pass: overdue + blocker-aging (high priority, overdue)" },
      { id: "AZW-35", text: "Define UAT timeline (due Feb 27)" },
      { id: "AZW-74", text: "[Compliance Assistant] Copy refinement with Emma on Q&A content" },
      { id: "AZW-84", text: "[Compliance Assistant] Decide on naming with Emma" },
      { id: "DEEP-WORK", text: "Block 1-2 hours for uninterrupted deep work on the pipeline design" }
    ]
  },
  thursday: {
    dayName: "Thursday",
    date: "Feb 26",
    focus: "Painters Day + AZ Work",
    priority: "Painters logistics are time-sensitive",
    events: ["Painters arriving"],
    meetings: [
      { time: "08:00", title: "Risk Register UAT Meeting" },
      { time: "10:00", title: "1:1 with Ismael" }
    ],
    tasks: [
      { id: "PER-PAINT1", text: "Ask painters about moving daybed — resolve before they start" },
      { id: "PER-15", text: "Painters: stairway + upstairs hallway (due Feb 26)" },
      { id: "AZW-28", text: "Execute UAT with Emma & compliance (due Feb 26)" },
      { id: "AZW-72", text: "Emma approve group email access for Risk Register notifications" },
      { id: "AZW-76", text: "[Compliance Assistant] Confirm connection to ONX video concept" },
      { id: "AZW-CONT2", text: "Continue AZ work: UAT testing, Phase II planning" }
    ]
  },
  friday: {
    dayName: "Friday",
    date: "Feb 27",
    focus: "Side Projects + Learning",
    priority: "Invest in yourself",
    events: [],
    meetings: [],
    tasks: [
      { id: "SID-157", text: "Set up Tailscale + SSH + tmux (due Feb 27 — push to finish)" },
      { id: "SID-211", text: "Configure Cursor + OpenCode + Codex environment" },
      { id: "SID-204", text: "Learn grep/ripgrep + Bash for agentic terminals (study block)" },
      { id: "SID-172", text: "Ask Jason Reed for AWS certification recommendation (quick action)" },
      { id: "SID-213", text: "Ping Adittah re: Docker for forecasting tool (quick action)" }
    ]
  },
  saturday: {
    dayName: "Saturday",
    date: "Feb 28",
    focus: "Personal + Basement Planning",
    priority: "Home progress while contractors are active",
    events: [],
    meetings: [],
    tasks: [
      { id: "PER-BOBS", text: "Bob's Discount couch trip with Deirdre — pick a date" },
      { id: "PER-TV", text: "Plan TV placement + rig setup + desk + monitor" },
      { id: "PER-40", text: "Assemble new crib (due Feb 27)" },
      { id: "PER-39", text: "Pay back Bill + Colleen for Wayne's Coating (due Tomorrow)" },
      { id: "PER-13", text: "Laundry back in commission (due Tomorrow — high priority)" },
      { id: "PER-37", text: "Weekly Planning for next week" }
    ]
  }
};

const PROJECTS = [
  { id: "P-01", title: "Risk Register Modernization", status: "UAT testing + Phase 2 scoping", keys: "AZW-51, 28, 29, 63, 70, 72" },
  { id: "P-02", title: "LUCID AI Forecasting Tool", status: "Awaiting stakeholder feedback", keys: "AZW-78, 71" },
  { id: "P-03", title: "ONX 2026 Video Concept", status: "Scope clarification needed", keys: "AZW-82, 83" },
  { id: "P-04", title: "Compliance Assistant", status: "Copy refinement overdue", keys: "AZW-74, 76, 84" },
];

const PRINCIPLES = [
  "You probably didn't plan enough or clarify the issue you intended to solve well enough.",
  "Linear has been the best antidote to my time blindness.",
  "Augment your thinking and automate the mundane."
];

// PERFORMANCE: js-hoist-regexp
const DUE_REGEX = /\((due.*?)\)/i;
const URGENT_REGEX = /urgent/i;

// PERFORMANCE: advanced-init-once
const DAY_KEYS = Object.keys(WEEK_DATA);

// VISUAL DETAILS: Custom Hardware Cursor
const CustomCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const update = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', update);
    return () => window.removeEventListener('mousemove', update);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 w-10 h-10 border-2 border-[#FF3B00] rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:flex items-center justify-center transition-transform duration-75 ease-out will-change-transform"
      style={{ transform: `translate3d(calc(${pos.x}px - 50%), calc(${pos.y}px - 50%), 0)` }}
    >
      <div className="w-1.5 h-1.5 bg-[#FF3B00] rounded-full" />
    </div>
  );
};

// PERFORMANCE: rerender-memo 
const SystemTicker = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="marquee-container font-mono text-[10px] uppercase tracking-widest font-bold">
      <div className="marquee-content">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="px-4">
            /// BOWMAN AI LABS /// OPERATIONS COMMAND /// WEEK OF FEB 23–28 /// SYS.TIME: {time.toISOString()}
          </span>
        ))}
      </div>
    </div>
  );
};

// PERFORMANCE: rerender-memo 
const LocalTimeDisplay = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-4xl md:text-6xl font-bold font-brutal leading-none">
      {time.toLocaleTimeString('en-US', { hour12: false })}
    </div>
  );
};

export default function App() {
  const [activeDay, setActiveDay] = useState('monday');
  const [completedTasks, setCompletedTasks] = useState(new Set());

  const toggleTask = (id) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const currentData = WEEK_DATA[activeDay];
  
  // PERFORMANCE: js-combine-iterations
  const totalTasks = currentData.tasks.length;
  const completedCount = currentData.tasks.reduce(
    (count, t) => count + (completedTasks.has(t.id) ? 1 : 0), 
    0
  );
  const progressPercent = totalTasks === 0 ? 0 : (completedCount / totalTasks) * 100;

  return (
    <div className="min-h-screen bg-[#EBEBE6] text-[#0A0A0A] font-sans overflow-x-hidden selection:bg-[#FF3B00] selection:text-white relative z-0 md:cursor-none">
      <CustomCursor />
      
      {/* GLOBAL STYLES: Motion, Typography, Spatial Composition */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=JetBrains+Mono:wght@400;700;800&family=Manrope:wght@400;600;800&display=swap');
        
        :root {
          --bg: #EBEBE6;
          --fg: #0A0A0A;
          --accent: #FF3B00;
        }

        .font-brutal { font-family: 'Anton', sans-serif; }
        .font-body { font-family: 'Manrope', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        /* BACKGROUNDS & VISUAL DETAILS */
        .noise-overlay {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          pointer-events: none;
          z-index: 50;
          opacity: 0.05;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .bg-grid {
          background-image: radial-gradient(var(--fg) 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.08;
        }

        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
          display: flex;
          border-bottom: 2px solid var(--fg);
          background: var(--accent);
          color: white;
          padding: 6px 0;
        }
        
        .marquee-content {
          display: flex;
          animation: marquee 20s linear infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* MOTION: Staggered Reveals */
        .stagger-enter {
          animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .delay-5 { animation-delay: 0.5s; }

        @keyframes slideUpFade {
          from { transform: translateY(60px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes expandWidth {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-line {
          animation: expandWidth 1s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.6s;
        }

        /* INTERACTION: Hover States that Surprise */
        .hard-hover-shift {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hard-hover-shift:hover {
          transform: translate(-4px, -4px);
          box-shadow: 6px 6px 0px 0px var(--accent);
          border-color: var(--accent);
        }
        
        .hard-hover-shift:active {
          transform: translate(0px, 0px);
          box-shadow: 0px 0px 0px 0px var(--accent);
        }

        /* Hiding cursor universally if md screen */
        @media (min-width: 768px) {
          a, button, [role="button"], input, select, textarea {
            cursor: none !important;
          }
        }
      `}} />

      <div className="noise-overlay" />
      <div className="fixed inset-0 bg-grid pointer-events-none z-0" />

      {/* SPATIAL COMPOSITION: Grid-Breaking Background Element */}
      <div className="fixed -left-48 top-40 font-brutal text-[25vw] text-[#0A0A0A] opacity-[0.03] -rotate-90 pointer-events-none whitespace-nowrap z-0 select-none leading-none">
        OPERATIONS
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <SystemTicker />

        <div className="max-w-[1600px] mx-auto p-4 md:p-8 w-full flex-1">
          
          {/* --- HEADER BLOCK --- */}
          <header className="stagger-enter delay-1 pb-8 mb-10 flex flex-col md:flex-row justify-between items-end gap-6 relative">
            <div className="w-full md:w-auto relative z-10">
              <h2 className="font-mono text-sm font-bold tracking-widest uppercase text-[#FF3B00] mb-2 flex items-center gap-2">
                <Square className="w-3 h-3 fill-current" /> SYS_OPERATIONS // VOL. 01
              </h2>
              {/* SPATIAL COMPOSITION: Overlapping structural headers */}
              <h1 className="font-brutal text-6xl md:text-8xl lg:text-[160px] leading-[0.8] tracking-tight uppercase relative -ml-1">
                Bowman<br/>
                <span className="text-transparent" style={{ WebkitTextStroke: '2px #0A0A0A' }}>Labs</span>
              </h1>
            </div>
            
            <div className="w-full md:w-auto flex flex-row md:flex-col justify-between items-end">
              <div className="font-mono text-right border-4 border-[#0A0A0A] bg-white p-4 shadow-[8px_8px_0px_0px_#0A0A0A] rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="text-[10px] text-[#FF3B00] font-bold uppercase tracking-widest mb-1">Local Synchronization</div>
                <LocalTimeDisplay />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-[#0A0A0A] animate-line" />
          </header>

          {/* --- DAY NAVIGATION (TAB GRID) --- */}
          <nav className="stagger-enter delay-2 grid grid-cols-2 md:grid-cols-6 gap-3 mb-12">
            {DAY_KEYS.map((key) => {
              const isActive = activeDay === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveDay(key)}
                  className={`
                    flex flex-col justify-between p-5 min-h-[110px] text-left uppercase border-2 border-[#0A0A0A] hard-hover-shift outline-none
                    ${isActive 
                      ? 'bg-[#FF3B00] text-white shadow-[6px_6px_0px_0px_#0A0A0A] -translate-y-1 -translate-x-1' 
                      : 'bg-white text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white'}
                  `}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-brutal text-3xl md:text-4xl tracking-wide">{WEEK_DATA[key].date.split(' ')[1]}</span>
                    {isActive ? <ArrowRight className="w-5 h-5" /> : null}
                  </div>
                  <span className={`font-mono text-[10px] font-bold tracking-widest mt-4 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                    {WEEK_DATA[key].dayName}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* --- MAIN GRID --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT COLUMN: Focus & Timeline (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-10">
              
              {/* FOCUS BLOCK - SPATIAL COMPOSITION: Asymmetrical negative margin */}
              <div className="stagger-enter delay-3 border-4 border-[#0A0A0A] bg-white p-8 relative lg:-mt-8 shadow-[12px_12px_0px_0px_rgba(10,10,10,0.1)]">
                <div className="absolute top-0 right-0 bg-[#FF3B00] text-white font-mono text-[10px] px-3 py-1.5 font-bold tracking-widest border-b-4 border-l-4 border-[#0A0A0A]">
                  DIRECTIVE
                </div>
                <h2 className="font-brutal text-5xl leading-[0.9] uppercase mt-4 mb-6 break-words">
                  {currentData.focus}
                </h2>
                <div className="bg-[#EBEBE6] border-2 border-[#0A0A0A] p-4">
                  <p className="font-body text-xs font-bold uppercase tracking-widest text-[#FF3B00] mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 fill-current" /> Priority Vector
                  </p>
                  <p className="font-mono text-sm font-bold text-[#0A0A0A]">
                    {currentData.priority}
                  </p>
                </div>
              </div>

              {/* ITINERARY BLOCK */}
              <div className="stagger-enter delay-4">
                <h3 className="font-brutal text-3xl uppercase tracking-wide mb-6 flex items-center gap-3">
                  <Clock className="w-8 h-8" /> Itinerary
                </h3>
                
                <div className="flex flex-col gap-2">
                  {currentData.events.length === 0 && currentData.meetings.length === 0 ? (
                    <div className="p-6 font-mono text-sm font-bold text-gray-400 bg-white border-2 border-dashed border-gray-300 text-center uppercase tracking-widest">
                      No Scheduled Blocks
                    </div>
                  ) : null}

                  {currentData.events.map((evt, idx) => (
                    <div key={`evt-${idx}`} className="flex border-2 border-[#FF3B00] bg-[#FF3B00] text-white hard-hover-shift">
                      <div className="w-24 shrink-0 p-4 border-r-2 border-[#0A0A0A] flex items-center justify-center font-mono text-xs font-bold uppercase">
                        EVENT
                      </div>
                      <div className="p-4 font-body font-bold text-sm uppercase flex items-center bg-white text-[#0A0A0A] flex-1">
                        {evt}
                      </div>
                    </div>
                  ))}

                  {currentData.meetings.map((mtg, idx) => (
                    <div key={`mtg-${idx}`} className="flex border-2 border-[#0A0A0A] bg-white hard-hover-shift">
                      <div className="w-24 shrink-0 p-4 border-r-2 border-[#0A0A0A] font-mono text-sm font-bold flex flex-col justify-center bg-[#EBEBE6]">
                        {mtg.time}
                      </div>
                      <div className="p-4 font-body font-bold text-sm text-[#0A0A0A] flex-1">
                        {mtg.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Tasks & Projects (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              
              {/* TASKS LEDGER */}
              <div className="stagger-enter delay-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-[#0A0A0A] pb-4 mb-6 gap-4">
                  <h3 className="font-brutal text-5xl md:text-6xl uppercase tracking-wide leading-none">
                    Ledger
                  </h3>
                  <div className="font-mono text-sm font-bold text-right flex flex-col items-start md:items-end w-full md:w-auto">
                    <span className="text-[#FF3B00] uppercase tracking-widest text-[10px]">Completion Status</span>
                    <div className="flex items-center gap-3 mt-2 w-full">
                      <div className="flex-1 md:w-48 h-3 bg-white border-2 border-[#0A0A0A] p-[2px]">
                        <div className="h-full bg-[#0A0A0A] transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
                      </div>
                      <span className="w-12 text-right">{completedCount}/{totalTasks}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {currentData.tasks.map((task) => {
                    const isDone = completedTasks.has(task.id);
                    const taskText = task.text;
                    const isUrgent = URGENT_REGEX.test(taskText);
                    const dueMatch = taskText.match(DUE_REGEX);
                    
                    return (
                      <button 
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`
                          w-full text-left group flex items-stretch cursor-pointer border-2 outline-none
                          transition-all duration-300 ease-out
                          ${isDone 
                            ? 'bg-gray-200 border-transparent opacity-50 grayscale hover:opacity-100 hover:grayscale-0' 
                            : 'bg-white border-[#0A0A0A] hard-hover-shift'}
                        `}
                      >
                        <div className={`
                          w-16 shrink-0 border-r-2 border-[#0A0A0A] flex items-center justify-center transition-colors duration-300
                          ${isDone ? 'bg-[#0A0A0A] text-white' : 'bg-[#EBEBE6] text-[#0A0A0A] group-hover:bg-[#FF3B00] group-hover:text-white group-hover:border-[#FF3B00]'}
                        `}>
                          {isDone ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                        </div>
                        
                        <div className="flex-1 p-5 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {isDone ? <div className="absolute top-1/2 left-4 right-4 h-1 bg-[#0A0A0A] -translate-y-1/2 z-10" /> : null}
                          
                          <span className={`font-body font-bold text-base md:text-lg relative z-20 ${isDone ? 'text-[#0A0A0A]' : 'text-[#0A0A0A]'}`}>
                            {taskText.replace(DUE_REGEX, '')}
                          </span>
                          
                          <div className="flex flex-wrap items-center gap-2 shrink-0 relative z-20">
                            {dueMatch && !isDone ? (
                              <span className="px-2 py-1 border-2 border-[#0A0A0A] font-mono text-[10px] uppercase font-bold bg-[#EBEBE6]">
                                {dueMatch[1]}
                              </span>
                            ) : null}
                            {isUrgent && !isDone ? (
                              <span className="px-2 py-1 bg-[#FF3B00] text-white font-mono text-[10px] uppercase font-bold flex items-center gap-1 border-2 border-[#FF3B00]">
                                <AlertTriangle className="w-3 h-3 fill-current text-white" /> URGENT
                              </span>
                            ) : null}
                            <span className="px-2 py-1 bg-[#0A0A0A] text-white font-mono text-[10px] uppercase font-bold border-2 border-[#0A0A0A]">
                              {task.id}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PROJECTS & PRINCIPLES COMPOSITION */}
              <div className="stagger-enter delay-5 grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
                
                <div className="flex flex-col gap-4">
                  <h3 className="font-brutal text-2xl uppercase tracking-wide border-b-4 border-[#0A0A0A] pb-2">
                    Active Vectors
                  </h3>
                  <div className="flex flex-col gap-3">
                    {PROJECTS.map((proj) => (
                      <div key={proj.id} className="border-2 border-[#0A0A0A] bg-white p-4 flex flex-col justify-between group hard-hover-shift">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-[10px] font-bold text-white bg-[#0A0A0A] px-1.5 py-0.5">{proj.id}</span>
                          <span className="font-mono text-[10px] font-bold border border-[#0A0A0A] px-1.5 py-0.5 uppercase text-[#FF3B00]">
                            {proj.status.split('+')[0]}
                          </span>
                        </div>
                        <h4 className="font-body font-bold text-base leading-tight uppercase mb-3 pr-4">
                          {proj.title}
                        </h4>
                        <div className="pt-3 border-t-2 border-dashed border-[#0A0A0A] font-mono text-[10px] text-gray-500 uppercase tracking-widest flex justify-between items-center">
                          <span>REF: {proj.keys}</span>
                          <Crosshair className="w-4 h-4 text-[#FF3B00] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0A0A0A] text-[#EBEBE6] p-8 border-4 border-[#0A0A0A] h-fit">
                  <h3 className="font-mono text-[10px] text-[#FF3B00] tracking-widest mb-8 flex items-center gap-2 border-b border-[#FF3B00]/30 pb-4">
                    <TerminalSquare className="w-4 h-4" /> CORE_PRINCIPLES.MD
                  </h3>
                  <div className="space-y-6">
                    {PRINCIPLES.map((principle, idx) => (
                      <div key={idx} className="font-body text-sm font-bold uppercase tracking-wider flex gap-4 leading-snug">
                        <span className="text-[#FF3B00] select-none font-mono">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <p className="text-[#EBEBE6] opacity-90">{principle}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
          
          <footer className="stagger-enter delay-5 mt-20 border-t-4 border-[#0A0A0A] pt-6 pb-12 flex flex-col md:flex-row justify-between items-start md:items-center font-mono text-[10px] text-gray-500 uppercase font-bold gap-4">
            <span className="bg-[#0A0A0A] text-white px-2 py-1">(C) 2026 BOWMAN AI LABS</span>
            <span className="flex items-center gap-2"><div className="w-2 h-2 bg-[#FF3B00]" /> END OF REPORT // SYS.OK</span>
          </footer>

        </div>
      </div>
    </div>
  );
}
