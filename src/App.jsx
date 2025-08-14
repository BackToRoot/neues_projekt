import React from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { useSpring, useSprings, animated } from '@react-spring/web';
import { supabase } from './supabaseClient';

/* =========================
 * Haupt-App
 * ========================= */
export default function App() {
  const [view, setView] = React.useState('intro'); // intro → quiz → form → success
  const [appStarted, setAppStarted] = React.useState(false);
  const audioRef = React.useRef(null);

  const handleQuizSuccess = () => setView('form');
  const handleFormSuccess = () => setView('success');

  const handleStart = () => {
    setAppStarted(true);
    audioRef.current?.play().catch(err => console.error('Audio play error', err));
  };

  return (
    <>
      <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" loop>
        Ihr Browser unterstützt das Audio-Element nicht.
      </audio>

      {!appStarted ? (
        <div className="w-screen h-screen bg-slate-900 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">Willkommen</h1>
          <button
            onClick={handleStart}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-lg transition-colors duration-300 text-2xl"
          >
            Start
          </button>
        </div>
      ) : (
        <div className={`bg-slate-900 text-white min-h-screen font-sans flex items-center justify-center overflow-hidden ${view === 'intro' ? 'p-0' : 'p-4'}`}>
          {view === 'intro' && <IntroAnimation onFinish={() => setView('quiz')} />}
          {view === 'quiz' && <Quiz onCorrectAnswer={handleQuizSuccess} />}
          {view === 'form' && <RegistrationForm onFormSubmit={handleFormSuccess} />}
          {view === 'success' && <SuccessMessage />}
        </div>
      )}
    </>
  );
}

/* =========================
 * IntroAnimation – „Verrückte Party“
 * ========================= */
function NeonPulseBackground() {
  const pulse = useSpring({
    from: { opacity: 0.6, filter: 'brightness(0.9)' },
    to: async (next) => { while (1) { await next({ opacity: 1, filter: 'brightness(1.2)' }); await next({ opacity: 0.7, filter: 'brightness(0.95)' }); } },
    config: { tension: 80, friction: 18 },
  });
  return (
    <animated.div style={pulse} className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-600 via-indigo-600 to-cyan-500 opacity-80" />
      <div className="absolute inset-0 mix-blend-screen bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.25),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,.25),transparent_45%)]" />
    </animated.div>
  );
}

function ConfettiPiece({ x, delay, direction = 1 }) {
  const fall = useSpring({
    from: { transform: `translate3d(${x}vw,-10vh,0) rotate(0deg)` },
    to: async (next) => { while (1) { await next({ transform: `translate3d(${x}vw,105vh,0) rotate(${direction * 720}deg)` }); await next({ transform: `translate3d(${x}vw,-10vh,0) rotate(0deg)` }); } },
    delay,
    config: { tension: 50, friction: 8 },
  });
  const size = Math.floor(6 + Math.random() * 10);
  return (
    <animated.div style={fall} className="pointer-events-none">
      <div style={{ width: size, height: size * 0.6, borderRadius: 2, background: 'linear-gradient(45deg, #fff 0%, #ffeb3b 40%, #ff4081 70%, #00e5ff 100%)', boxShadow: '0 0 10px rgba(255,255,255,.35)' }} />
    </animated.div>
  );
}

function BouncingEmoji({ emoji, leftPct, delay = 0 }) {
  const bounce = useSpring({
    from: { y: 0, rotate: -5, scale: 1 },
    to: async (next) => { while (1) { await next({ y: -20, rotate: 8, scale: 1.08 }); await next({ y: 0, rotate: -6, scale: 1.0 }); } },
    delay, config: { tension: 160, friction: 10 },
  });
  return (
    <animated.div style={{ position: 'absolute', bottom: '10%', left: `${leftPct}%`, ...bounce }} className="text-5xl md:text-6xl" aria-hidden>
      {emoji}
    </animated.div>
  );
}

function Equalizer({ bars = 24 }) {
  const [springs] = useSprings(bars, (i) => ({
    from: { height: 10 }, to: async (next) => { while (1) { const h1 = 10 + Math.random() * 120; const h2 = 10 + Math.random() * 120; await next({ height: h1 }); await next({ height: h2 }); } },
    config: { tension: 120, friction: 14 }, delay: i * 50,
  }), [bars]);
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1">
      {springs.map((style, i) => (<animated.div key={i} style={{ ...style, width: 6 }} className="rounded-sm bg-white/90 shadow-[0_0_8px_rgba(255,255,255,.6)]" />))}
    </div>
  );
}

function SpinningDisc({ size = 110, top = '15%', left = '12%', delay = 0 }) {
  const spin = useSpring({
    from: { rotate: 0, scale: 0.9 },
    to: async (next) => { while (1) { await next({ rotate: 360, scale: 1.02 }); await next({ rotate: 720, scale: 0.98 }); } },
    delay, config: { tension: 40, friction: 6 },
  });
  return (
    <animated.div style={{ position: 'absolute', top, left, width: size, height: size, ...spin }} className="rounded-full">
      <div className="w-full h-full rounded-full" style={{ background: 'radial-gradient(circle at 50% 50%, #222 0 22%, #111 22% 60%, #000 60% 100%)', boxShadow: '0 0 20px rgba(0,0,0,.5), inset 0 0 10px rgba(255,255,255,.08)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'repeating-conic-gradient(rgba(255,255,255,.05) 0% 1%, transparent 1% 4%)', borderRadius: '999px' }} />
        <div className="absolute inset-0 flex items-center justify-center"><div className="w-6 h-6 rounded-full bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,.9)]" /></div>
      </div>
    </animated.div>
  );
}

function IntroAnimation({ onFinish }) {
  const parallaxRef = React.useRef(null);
  const finalImagePath = "/20250811.jpg";

  const confetti = React.useMemo(() =>
    Array.from({ length: 40 }).map((_, i) => ({ x: Math.random() * 100, delay: Math.floor(Math.random() * 800), direction: Math.random() > 0.5 ? 1 : -1, key: `confetti-${i}` })), []);

  React.useEffect(() => {
    const t1 = setTimeout(() => { parallaxRef.current?.scrollTo(1); }, 4000);
    const t2 = setTimeout(() => { onFinish?.(); }, 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onFinish]);

  const headline = useSpring({
    from: { opacity: 0, y: 20, rotate: -2, scale: 0.95 },
    to: async (next) => { await next({ opacity: 1, y: 0, rotate: 0, scale: 1 }); while (1) { await next({ rotate: 2, scale: 1.03 }); await next({ rotate: -2, scale: 0.99 }); } },
    config: { tension: 120, friction: 18 },
  });

  const strobe = useSpring({
    from: { opacity: 0 },
    to: async (next) => { while (1) { await next({ opacity: 0.25 }); await next({ opacity: 0 }); } },
    config: { duration: 120 }, loop: true,
  });

  return (
    <div className="w-screen h-screen bg-black text-white overflow-hidden">
      <Parallax ref={parallaxRef} pages={2} style={{ top: 0, left: 0 }}>
        {/* Seite 0 */}
        <ParallaxLayer offset={0} speed={0}>
          <NeonPulseBackground />
          <animated.div style={strobe} className="absolute inset-0 bg-white pointer-events-none mix-blend-overlay" />
        </ParallaxLayer>

        <ParallaxLayer offset={0} speed={0.2}>
          {confetti.slice(0, 20).map((c) => (<ConfettiPiece key={c.key} x={c.x} delay={c.delay} direction={c.direction} />))}
        </ParallaxLayer>
        <ParallaxLayer offset={0} speed={0.6}>
          {confetti.slice(20).map((c) => (<ConfettiPiece key={c.key} x={c.x} delay={c.delay} direction={c.direction} />))}
        </ParallaxLayer>

        <ParallaxLayer offset={0} speed={0.5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <animated.h1
            style={headline}
            className="text-center font-extrabold tracking-tight px-6 text-4xl md:text-6xl drop-shadow-[0_6px_20px_rgba(0,0,0,.6)]"
          >
            Verrückte&nbsp;Party&nbsp;—&nbsp;Let’s&nbsp;Go!<br />
            <span className="text-indigo-200/90">Samstag, 30 August 2025 <br /> 16:00 Uhr</span>
          </animated.h1>
        </ParallaxLayer>

        <ParallaxLayer offset={0} speed={0.9}>
          <BouncingEmoji emoji="🎉" leftPct={18} delay={0} />
          <BouncingEmoji emoji="🥳" leftPct={38} delay={150} />
          <BouncingEmoji emoji="🎵" leftPct={58} delay={300} />
          <BouncingEmoji emoji="🍹" leftPct={78} delay={450} />
        </ParallaxLayer>

        <ParallaxLayer offset={0} speed={0.4}><Equalizer bars={28} /></ParallaxLayer>
        <ParallaxLayer offset={0} speed={0.1}><SpinningDisc size={120} top="12%" left="8%" delay={100} /><SpinningDisc size={140} top="65%" left="78%" delay={300} /></ParallaxLayer>

        {/* Seite 1 – Finales Bild */}
        <ParallaxLayer offset={1} speed={0.15}>
          <div className="w-full h-full flex items-center justify-center">
            <img src={finalImagePath} alt="Finales Bild der Feier" className="w-full h-full object-cover" />
          </div>
        </ParallaxLayer>
      </Parallax>
    </div>
  );
}

/* =========================
 * Quiz (Fragen aus Supabase)
 * ========================= */
function shuffle(arr){ return [...arr].sort(()=>Math.random()-0.5); }

function Quiz({ onCorrectAnswer }) {
  if (!supabase) {
    return <div className="w-full max-w-md mx-auto bg-slate-800 p-8 rounded-xl text-center">Supabase nicht konfiguriert. Prüfe <code>.env.local</code>.</div>;
  }

  const [questions, setQuestions] = React.useState([]);
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [wrongAttempts, setWrongAttempts] = React.useState(0);
  const [feedback, setFeedback] = React.useState('');
  const [isLocked, setIsLocked] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        // Bevorzugt via RPC (5 easy + 5 hard)
        const { data, error } = await supabase.rpc('get_mixed_questions');
        if (!error && Array.isArray(data) && data.length) {
          const prepared = data.map(q => ({ ...q, options: shuffle(q.options || []) }));
          setQuestions(shuffle(prepared)); setCurrentIdx(0); return;
        }
        // Fallback: direkt aus der Tabelle
        const { data: all, error: e2 } = await supabase.from('questions').select('*').eq('active', true);
        if (e2 || !all?.length) { setFeedback('Fehler beim Laden der Fragen.'); return; }
        const pick = (arr, n) => shuffle(arr).slice(0, Math.min(n, arr.length));
        const prepared = shuffle([...pick(all.filter(q=>q.difficulty==='easy'),5), ...pick(all.filter(q=>q.difficulty==='hard'),5)])
          .map(q => ({ ...q, options: shuffle(q.options || []) }));
        setQuestions(prepared); setCurrentIdx(0);
      } catch (e) { console.error(e); setFeedback('Netzwerkfehler.'); }
    })();
  }, []);

  const nextRandom = () => {
    setQuestions(prev => {
      const rest = prev.filter((_, i) => i !== currentIdx);
      if (!rest.length) return prev;
      setCurrentIdx(Math.floor(Math.random() * rest.length));
      return rest;
    });
  };

  const handleAnswer = (answer) => {
    if (isLocked || !questions.length) return;
    const q = questions[currentIdx];
    if (answer === q.correct_answer) {
      setFeedback('Richtig! Du wirst weitergeleitet...');
      setIsLocked(true);
      setTimeout(onCorrectAnswer, 1200);
    } else {
      const wa = wrongAttempts + 1;
      setWrongAttempts(wa);
      if (wa >= 3) {
        setFeedback('Schade, du bist ungeeignet für die Feier. Keine Sorge, wir stellen einfach eine Pappfigur von dir auf. Wenn du es nochmal versuchen möchtest, dann mach einen Refresh.');
        setIsLocked(true);
      } else {
        setFeedback(`Falsch! Nächste Frage… (${wa}/3 Versuche)`);
        nextRandom();
      }
    }
  };

  if (!questions.length) {
    return <div className="w-full max-w-md mx-auto bg-slate-800 p-8 rounded-xl shadow-2xl text-center">Lade Fragen… {feedback && <div className="mt-2 text-amber-400">{feedback}</div>}</div>;
  }

  const q = questions[currentIdx];

  return (
    <div className="w-full max-w-md mx-auto bg-slate-800 p-8 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-bold mb-4">{q.text}</h2>
      <div className="grid grid-cols-1 gap-4">
        {q.options.map(opt => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            disabled={isLocked}
            className="w-full bg-slate-700 hover:bg-indigo-600 disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
          >
            {opt}
          </button>
        ))}
      </div>
      {feedback && (
        <p className={`mt-6 text-center font-semibold ${
          feedback.startsWith('Falsch') ? 'text-amber-400' :
          feedback.startsWith('Richtig') ? 'text-green-400' : 'text-red-500'}`}>
          {feedback}
        </p>
      )}
    </div>
  );
}

/* =========================
 * RegistrationForm mit Einladungscode (RPC)
 * ========================= */
function RegistrationForm({ onFormSubmit }) {
  const [attendanceStatus, setAttendanceStatus] = React.useState('unanswered'); // 'unanswered', 'yes', 'no'
  const [guestCount, setGuestCount] = React.useState(1);
  const [names, setNames] = React.useState(['']);
  const [inviteCode, setInviteCode] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  if (!supabase) {
    return <div className="w-full max-w-md mx-auto bg-slate-800 p-8 rounded-xl text-center">Supabase nicht konfiguriert. Prüfe <code>.env.local</code>.</div>;
  }

  const handleGuestCountChange = (e) => {
    const raw = Number(e.target.value);
    const count = Math.min(5, Math.max(1, isNaN(raw) ? 1 : raw));
    setGuestCount(count);
    const ns = [...names];
    if (count > ns.length) { for (let i = ns.length; i < count; i++) ns.push(''); } else { ns.length = count; }
    setNames(ns);
  };
  const handleNameChange = (i, v) => { const ns = [...names]; ns[i] = v; setNames(ns); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = inviteCode.trim().toUpperCase();
    const allNamesFilled = names.every(n => n.trim() !== '');
    if (!code) { setError('Bitte Einladungscode eingeben.'); return; }
    if (!allNamesFilled) { setError('Bitte alle Namen eintragen.'); return; }

    setError(''); setIsLoading(true);

    const { error: rpcErr } = await supabase.rpc('claim_invite_and_register', {
  p_code: inviteCode.trim().toUpperCase(),
  p_guests: guestCount,
  p_names: names
});

if (rpcErr) {
  const msg = rpcErr.message || '';
  if (msg.includes('invalid_or_used_code')) {
    setError('❌ Einladungscode ist ungültig oder bereits benutzt.');
  } else if (msg.includes('invalid_code')) {
    setError('❌ Bitte einen gültigen Einladungscode eingeben.');
  } else if (msg.includes('invalid_guests')) {
    setError('❌ Anzahl Personen muss zwischen 1 und 5 liegen.');
  } else if (msg.includes('names_count_mismatch')) {
    setError('❌ Anzahl der Namen passt nicht zur Personenzahl.');
  } else {
    setError('❌ Unerwarteter Fehler. Bitte versuch es später erneut.');
    console.error(rpcErr);
  }
  return;
}

onFormSubmit();

  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-800 p-8 rounded-xl shadow-2xl">
      {attendanceStatus === 'unanswered' && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Bist du dabei?</h2>
          <div className="flex justify-center gap-4">
            <button onClick={() => setAttendanceStatus('yes')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300">Ja!</button>
            <button onClick={() => setAttendanceStatus('no')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300">Nein</button>
          </div>
        </div>
      )}

      {attendanceStatus === 'no' && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Schade!</h2>
          <p className="text-slate-400">Keine Sorge, wir stellen einfach eine Pappfigur von dir auf.</p>
        </div>
      )}

      {attendanceStatus === 'yes' && (
        <>
          <h2 className="text-3xl font-bold mb-6 text-center">Anmeldung zur Feier</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="inviteCode" className="block text-slate-400 mb-2">Einladungscode</label>
              <input
                type="text"
                id="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="z. B. ABC123"
                maxLength={16}
                className="w-full uppercase tracking-widest bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="guests" className="block text-slate-400 mb-2">Anzahl Personen</label>
              <select
                id="guests" name="guests" value={guestCount} onChange={handleGuestCountChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="1">1 Person</option>
                <option value="2">2 Personen</option>
                <option value="3">3 Personen</option>
                <option value="4">4 Personen</option>
                <option value="5">5 Personen</option>
              </select>
            </div>

            {Array.from({ length: guestCount }).map((_, i) => (
              <div key={i}>
                <label htmlFor={`name-${i}`} className="block text-slate-400 mb-2">Name Person {i + 1}</label>
                <input
                  id={`name-${i}`} type="text" value={names[i] || ''} onChange={(e) => handleNameChange(i, e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" required
                />
              </div>
            ))}

            {error && <p className="text-red-400 text-center">{error}</p>}

            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-indigo-400 flex items-center justify-center !mt-8">
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : 'Anmeldung bestätigen'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

/* =========================
 * Erfolg
 * ========================= */
function SuccessMessage() {
  return (
    <div className="w-full max-w-md mx-auto bg-slate-800 p-8 rounded-xl shadow-2xl text-center">
      <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-500 mb-4 animate-bounce">🎉</div>
      <h2 className="text-3xl font-bold mb-2">Juhuu, du bist dabei! 🥳</h2>
      <p className="text-slate-300">Deine Anmeldung ist gespeichert. Jetzt nur noch die Tanzschuhe einpacken und gute Laune mitbringen! 💃🕺</p>
    </div>
  );
}