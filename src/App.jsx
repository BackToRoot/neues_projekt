import React from 'react';
import { useSpring, useSprings, animated } from '@react-spring/web';
import { supabase } from './supabaseClient';

/* =========================
 * Haupt-App
 * ========================= */
export default function App() {
  const [view, setView] = React.useState('intro'); // intro → quizIntro → quiz → form → success
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
      <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" loop />

      {!appStarted ? (
        // Start-Bildschirm
        <div className="w-screen h-screen bg-slate-900 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">Willkommen/Benvenuti/Selamat datang</h1>
          <button
            onClick={handleStart}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-lg transition-colors duration-300 text-2xl"
          >
            Betreten auf eigene Gefahr
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 text-white min-h-[100svh] flex items-center justify-center p-4">
          {view === 'intro' && <IntroAnimation onFinish={() => setView('quizIntro')} />}

          {view === 'quizIntro' && (
            <div className="max-w-md bg-slate-800 p-6 rounded-xl text-center">
              <h2 className="text-3xl font-bold mb-4">Eignungstest 🎯</h2>
              <p className="mb-4">
                Bevor du dich anmelden kannst, musst du diesen Test bestehen.<br />
                Regeln:
              </p>
              <ul className="text-left list-disc list-inside mb-4 space-y-1">
                <li>5 Fragen richtig beantworten ✅</li>
                <li>Du hast nur 3 Leben ❤️</li>
                <li>Bei 3 Fehlern geht's von vorne 🔄</li>
              </ul>
              <button
                onClick={() => setView('quiz')}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg"
              >
                Test starten
              </button>
            </div>
          )}

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
    to: async (next) => {
      while (1) {
        await next({ opacity: 1,   filter: 'brightness(1.2)' });
        await next({ opacity: 0.7, filter: 'brightness(0.95)' });
      }
    },
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
    to: async (next) => {
      while (1) {
        await next({ transform: `translate3d(${x}vw,105vh,0) rotate(${direction * 720}deg)` });
        await next({ transform: `translate3d(${x}vw,-10vh,0) rotate(0deg)` });
      }
    },
    delay,
    config: { tension: 50, friction: 8 },
  });

  const size = Math.floor(6 + Math.random() * 10);
  return (
    <animated.div style={fall} className="pointer-events-none">
      <div
        style={{
          width: size,
          height: size * 0.6,
          borderRadius: 2,
          background: 'linear-gradient(45deg, #fff 0%, #ffeb3b 40%, #ff4081 70%, #00e5ff 100%)',
          boxShadow: '0 0 10px rgba(255,255,255,.35)',
        }}
      />
    </animated.div>
  );
}

function BouncingEmoji({ emoji, leftPct, delay = 0 }) {
  const bounce = useSpring({
    from: { y: 0, rotate: -5, scale: 1 },
    to: async (next) => {
      while (1) {
        await next({ y: -20, rotate: 8, scale: 1.08 });
        await next({ y: 0, rotate: -6, scale: 1.0 });
      }
    },
    delay,
    config: { tension: 160, friction: 10 },
  });

  return (
    <animated.div
      style={{ position: 'absolute', bottom: '10%', left: `${leftPct}%`, ...bounce }}
      className="text-5xl md:text-6xl"
      aria-hidden
    >
      {emoji}
    </animated.div>
  );
}

function Equalizer({ bars = 24 }) {
  const [springs] = useSprings(
    bars,
    (i) => ({
      from: { height: 10 },
      to: async (next) => {
        while (1) {
          const h1 = 10 + Math.random() * 120;
          const h2 = 10 + Math.random() * 120;
          await next({ height: h1 });
          await next({ height: h2 });
        }
      },
      config: { tension: 120, friction: 14 },
      delay: i * 50,
    }),
    [bars]
  );

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1">
      {springs.map((style, i) => (
        <animated.div key={i} style={{ ...style, width: 6 }} className="rounded-sm bg-white/90 shadow-[0_0_8px_rgba(255,255,255,.6)]" />
      ))}
    </div>
  );
}

function SpinningDisc({ size = 110, top = '15%', left = '12%', delay = 0 }) {
  const spin = useSpring({
    from: { rotate: 0, scale: 0.9 },
    to: async (next) => {
      while (1) {
        await next({ rotate: 360, scale: 1.02 });
        await next({ rotate: 720, scale: 0.98 });
      }
    },
    delay,
    config: { tension: 40, friction: 6 },
  });

  return (
    <animated.div style={{ position: 'absolute', top, left, width: size, height: size, ...spin }} className="rounded-full">
      <div
        className="w-full h-full rounded-full"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #222 0 22%, #111 22% 60%, #000 60% 100%)',
          boxShadow: '0 0 20px rgba(0,0,0,.5), inset 0 0 10px rgba(255,255,255,.08)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'repeating-conic-gradient(rgba(255,255,255,.05) 0% 1%, transparent 1% 4%)', borderRadius: '999px' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,.9)]" />
        </div>
      </div>
    </animated.div>
  );
}

function IntroAnimation({ onFinish }) {
  const finalImagePath = '/20250811.jpg'; // in public/
  const [phase, setPhase] = React.useState('anim'); // 'anim' | 'cta' | 'image'

  // Konfetti einmalig erzeugen
  const confetti = React.useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        x: Math.random() * 100,
        delay: Math.floor(Math.random() * 800),
        direction: Math.random() > 0.5 ? 1 : -1,
        key: `confetti-${i}`,
      })),
    []
  );

  // Nach 6s Animation: CTA einblenden
  React.useEffect(() => {
    if (phase !== 'anim') return;
    const t = setTimeout(() => setPhase('cta'), 6000);
    return () => clearTimeout(t);
  }, [phase]);

  // Wenn Bild-Phase startet: 5.5s anzeigen, dann weiter
  React.useEffect(() => {
    if (phase !== 'image') return;
    const t = setTimeout(() => onFinish?.(), 5500);
    return () => clearTimeout(t);
  }, [phase, onFinish]);

  // Fades + Animationen (ALLE Hooks top-level)
  const ctaFade = useSpring({ opacity: phase === 'cta' ? 1 : 0, config: { tension: 140, friction: 18 } });
  const imgFade = useSpring({ opacity: phase === 'image' ? 1 : 0, config: { tension: 140, friction: 18 } });

  const ctaButtonWobble = useSpring({
    from: { scale: 1, rotate: 0 },
    to: async (next) => {
      while (1) {
        await next({ scale: 1.05, rotate: 2 });
        await next({ scale: 1.0, rotate: -2 });
        await next({ scale: 1.05, rotate: 0 });
      }
    },
    pause: phase === 'image',
    config: { tension: 200, friction: 8 },
  });

  const headline = useSpring({
    from: { opacity: 0, y: 20, rotate: -2, scale: 0.95 },
    to: async (next) => {
      await next({ opacity: 1, y: 0, rotate: 0, scale: 1 });
      while (1) {
        await next({ rotate: 2, scale: 1.03 });
        await next({ rotate: -2, scale: 0.99 });
      }
    },
    config: { tension: 120, friction: 18 },
  });

  const strobe = useSpring({
    from: { opacity: 0 },
    to: async (next) => {
      while (1) {
        await next({ opacity: 0.25 });
        await next({ opacity: 0 });
      }
    },
    config: { duration: 120 },
    loop: true,
  });

  return (
    <div className="w-screen min-h-[100svh] bg-black text-white overflow-hidden relative">
      {/* Background */}
      <NeonPulseBackground />
      {/* Strobe nur ohne Bild */}
      {phase !== 'image' && <animated.div style={strobe} className="absolute inset-0 bg-white pointer-events-none mix-blend-overlay" />}

      {/* Konfetti Ebenen */}
      <div className="absolute inset-0">
        {confetti.slice(0, 20).map((c) => (
          <div key={c.key} className="absolute inset-0" style={{ transform: 'translateZ(0)' }}>
            <ConfettiPiece x={c.x} delay={c.delay} direction={c.direction} />
          </div>
        ))}
      </div>
      <div className="absolute inset-0">
        {confetti.slice(20).map((c) => (
          <div key={c.key} className="absolute inset-0" style={{ transform: 'translateZ(0)' }}>
            <ConfettiPiece x={c.x} delay={c.delay} direction={c.direction} />
          </div>
        ))}
      </div>

      {/* Headline */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <animated.h1
          style={headline}
          className="text-center font-extrabold tracking-tight text-3xl sm:text-4xl md:text-6xl drop-shadow-[0_6px_20px_rgba(0,0,0,.6)] leading-tight"
        >
          Verrückte&nbsp;Party&nbsp;—&nbsp;Let’s&nbsp;Go!<br />
          <span className="text-indigo-200/90 text-xl sm:text-2xl md:text-3xl">
            Samstag, 30 August 2025 <br /> ab 15:00 Uhr
          </span>
        </animated.h1>
      </div>

      {/* Deko */}
      <BouncingEmoji emoji="🎉" leftPct={12} />
      <BouncingEmoji emoji="🥳" leftPct={35} delay={150} />
      <BouncingEmoji emoji="🎵" leftPct={58} delay={300} />
      <BouncingEmoji emoji="🍹" leftPct={80} delay={450} />
      <Equalizer bars={24} />
      <SpinningDisc size={110} top="10%" left="6%" delay={100} />
      <SpinningDisc size={130} top="68%" left="78%" delay={300} />

      {/* CTA oben */}
   {phase === 'cta' && (
  <animated.div
    style={ctaFade}
    className="absolute top-[15svh] left-1/2 -translate-x-1/2 px-4 w-full flex justify-center z-40"
  >
    <animated.button
      onClick={() => setPhase('image')}
      style={ctaButtonWobble}
      className="bg-gradient-to-r from-teal-400 via-sky-500 to-indigo-500
                 hover:from-indigo-500 hover:via-sky-500 hover:to-teal-400
                 text-white font-extrabold tracking-wide
                 rounded-2xl py-4 px-8 sm:py-5 sm:px-10
                 text-lg sm:text-2xl shadow-[0_0_25px_rgba(56,189,248,0.8)]
                 transition-all duration-300 ease-in-out
                 hover:scale-105"
    >
      Meet your Party People
    </animated.button>
  </animated.div>
)}


      {/* Bildphase */}
      <animated.div style={imgFade} className={`absolute inset-0 z-50 ${phase === 'image' ? '' : 'pointer-events-none'}`}>
        <img
          src={finalImagePath}
          alt="Gastgeber"
          className="w-full h-full object-cover"
          loading="eager"
          fetchpriority="high"
          onError={() => console.error('Bild nicht gefunden:', finalImagePath)}
        />
        <div className="absolute inset-0 bg-black/10" />
      </animated.div>
    </div>
  );
}

/* =========================
 * Quiz mit Intro-Hinweis
 * ========================= */
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function Quiz({ onCorrectAnswer }) {
  const [questions, setQuestions] = React.useState([]);
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [lives, setLives] = React.useState(3);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [feedback, setFeedback] = React.useState('');
  const [answeredQuestions, setAnsweredQuestions] = React.useState([]);
  const [isLocked, setIsLocked] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('questions').select('*').eq('active', true);
      if (error) {
        console.error(error);
        return;
      }
      const prepared = data.map(q => ({
        ...q,
        options: shuffle(q.options || [])
      }));
      setQuestions(shuffle(prepared));
    })();
  }, []);

  const nextQuestion = () => {
    const remaining = questions.filter(q => !answeredQuestions.includes(q.id));
    if (remaining.length === 0) {
      setAnsweredQuestions([]);
      setQuestions(shuffle(questions)); // neu mischen, falls alle verbraucht
      setCurrentIdx(0);
    } else {
      const next = remaining[Math.floor(Math.random() * remaining.length)];
      setCurrentIdx(questions.findIndex(q => q.id === next.id));
    }
  };

  const handleAnswer = (answer) => {
    if (isLocked) return;
    const q = questions[currentIdx];
    setIsLocked(true);

    if (answer === q.correct_answer) {
      setFeedback('✅ Richtig!');
      setCorrectCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 5) {
          setTimeout(onCorrectAnswer, 1200);
        } else {
          setAnsweredQuestions(prevList => [...prevList, q.id]);
          setTimeout(() => {
            setIsLocked(false);
            setFeedback('');
            nextQuestion();
          }, 1000);
        }
        return newCount;
      });
    } else {
      setFeedback(`❌ Falsch! Richtige Antwort: ${q.correct_answer}`);
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          return 0; // Game Over
        }
        setAnsweredQuestions(prevList => [...prevList, q.id]);
        setTimeout(() => {
          setIsLocked(false);
          setFeedback('');
          nextQuestion();
        }, 1500);
        return newLives;
      });
    }
  };

  const restartGame = () => {
    setLives(3);
    setCorrectCount(0);
    setAnsweredQuestions([]);
    setFeedback('');
    setIsLocked(false);
    setQuestions(shuffle(questions));
    setCurrentIdx(0);
  };

  if (!questions.length) {
    return <div className="text-center">Lade Fragen…</div>;
  }

  const q = questions[currentIdx];

  return (
    <div className="w-[92vw] max-w-md mx-auto bg-slate-800 p-6 rounded-xl shadow-2xl text-center">
      <div className="flex justify-between mb-4 text-lg font-bold">
        <span>❤️ Leben: {lives}</span>
        <span>✅ Richtig: {correctCount} / 10</span>
      </div>

      <h2 className="text-2xl font-bold mb-4">{q.text}</h2>

      <div className="grid gap-3">
        {q.options.map(opt => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            disabled={isLocked}
            className={`w-full py-3 rounded-lg font-bold transition-colors duration-300 ${
              isLocked
                ? opt === q.correct_answer
                  ? 'bg-green-600'
                  : 'bg-slate-600'
                : 'bg-slate-700 hover:bg-indigo-600'
            } text-white`}
          >
            {opt}
          </button>
        ))}
      </div>

      {feedback && <p className="mt-4 font-semibold">{feedback}</p>}

      {lives <= 0 && (
        <div className="mt-6">
          <p className="mb-2">😢 Keine Leben mehr! Versuch es nochmal.</p>
          <button
            onClick={restartGame}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Neu starten
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================
 * RegistrationForm mit Einladungscode (RPC)
 * ========================= */
function RegistrationForm({ onFormSubmit }) {
  const [attendanceStatus, setAttendanceStatus] = React.useState('unanswered'); // 'unanswered' | 'yes' | 'no'
  const [guestCount, setGuestCount] = React.useState(1);
  const [names, setNames] = React.useState(['']);
  const [inviteCode, setInviteCode] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  if (!supabase) {
    return (
      <div className="w-[92vw] max-w-md mx-auto bg-slate-800 p-6 sm:p-8 rounded-xl text-center">
        Supabase nicht konfiguriert. Prüfe <code>.env.local</code>.
      </div>
    );
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

    setError('');
    setIsLoading(true);

    const { error: rpcErr } = await supabase.rpc('claim_invite_and_register', {
      p_code: code,
      p_guests: guestCount,
      p_names: names,
    });

    setIsLoading(false);

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
    <div className="w-[92vw] max-w-md mx-auto bg-slate-800/90 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-2xl">
      {attendanceStatus === 'unanswered' && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Bist du dabei?</h2>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setAttendanceStatus('yes')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-8 rounded-lg transition-colors duration-300"
            >
              Ja!
            </button>
            <button
              onClick={() => setAttendanceStatus('no')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-8 rounded-lg transition-colors duration-300"
            >
              Nein
            </button>
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
                className="w-full uppercase tracking-widest bg-slate-700 border border-slate-600 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="guests" className="block text-slate-400 mb-2">Anzahl Personen</label>
              <select
                id="guests"
                name="guests"
                value={guestCount}
                onChange={handleGuestCountChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  id={`name-${i}`}
                  type="text"
                  value={names[i] || ''}
                  onChange={(e) => handleNameChange(i, e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            ))}

            {error && <p className="text-red-400 text-center">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 sm:py-5 px-4 rounded-xl transition-colors duration-300 disabled:bg-indigo-400 flex items-center justify-center !mt-8"
            >
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
    <div className="w-[92vw] max-w-md mx-auto bg-slate-800 p-8 rounded-xl shadow-2xl text-center">
      <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-500 mb-4 animate-bounce">🎉</div>
      <h2 className="text-3xl font-bold mb-2">Juhuu, du bist dabei! 🥳</h2>
      <p className="text-slate-300">Deine Anmeldung ist gespeichert. Jetzt nur noch die Tanzschuhe einpacken und gute Laune mitbringen! 💃🕺</p>
    </div>
  );
}