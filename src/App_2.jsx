import React from 'react';
// Wir verwenden wieder die stabile @react-spring/parallax Bibliothek
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { useSpring, animated } from '@react-spring/web';

// Haupt-App-Komponente
// Diese Komponente steuert, welche Ansicht (Intro, Quiz, Formular, Erfolg) angezeigt wird.
export default function App() {
    // 'view' steuert, welcher Teil der Anwendung sichtbar ist.
    const [view, setView] = React.useState('intro'); 
    // NEU: State, um zu prüfen, ob der Nutzer die Interaktion gestartet hat (für die Musik)
    const [appStarted, setAppStarted] = React.useState(false);
    const audioRef = React.useRef(null);

    // Funktion, um zur nächsten Ansicht zu wechseln.
    const handleQuizSuccess = () => setView('form');
    const handleFormSuccess = () => setView('success');

    // Startet die App und die Musik
    const handleStart = () => {
        setAppStarted(true);
        if (audioRef.current) {
            audioRef.current.play().catch(error => {
                // Fängt Fehler ab, falls das Abspielen fehlschlägt
                console.error("Fehler beim Abspielen der Musik:", error);
            });
        }
    };

    // Je nach 'view'-Status wird die entsprechende Komponente gerendert.
    return (
        <>
            {/* NEU: Audio-Element für die Hintergrundmusik */}
            <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" loop>
                Ihr Browser unterstützt das Audio-Element nicht.
            </audio>

            {!appStarted ? (
                // NEU: Startbildschirm, der vor der App angezeigt wird
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
                // Die eigentliche App, die nach dem Klick auf "Start" angezeigt wird
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

// Komponente für einen einzelnen, animierten Stern
function AnimatedStar({ top, left, size, speed }) {
    const props = useSpring({
        from: { transform: 'translateX(0px)' },
        to: { transform: `translateX(${speed}px)` },
        loop: { reverse: true },
        config: { duration: Math.random() * 2000 + 2000 }
    });

    return (
        <animated.div 
            style={{
                position: 'absolute',
                top: `${top}%`,
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                backgroundColor: 'white',
                ...props
            }} 
        />
    );
}


// 1. Intro-Animation Komponente (Stabile Version mit automatischer Bewegung)
function IntroAnimation({ onFinish }) {
    const parallaxRef = React.useRef();
    const finalImagePath = "/1000011660.jpg";

    React.useEffect(() => {
        // Nach 4 Sekunden scrollt die Animation automatisch nach unten
        const scrollTimer = setTimeout(() => {
            if (parallaxRef.current) {
                parallaxRef.current.scrollTo(1);
            }
        }, 4000);

        // Nach 7 Sekunden die gesamte Intro-Animation beenden
        const finishTimer = setTimeout(onFinish, 7000);

        return () => {
            clearTimeout(scrollTimer);
            clearTimeout(finishTimer);
        };
    }, [onFinish]);
    
    return (
        <div className="w-screen h-screen bg-black">
            <Parallax ref={parallaxRef} pages={2} style={{ top: '0', left: '0' }}>
                {/* Ebene 1: Langsame Sterne im Hintergrund */}
                <ParallaxLayer offset={0} speed={0.1}>
                    {Array.from({ length: 30 }).map((_, i) => (
                        <AnimatedStar key={`bg-star-${i}`} top={Math.random()*100} left={Math.random()*100} size={2} speed={20} />
                    ))}
                </ParallaxLayer>
                 <ParallaxLayer offset={1} speed={0.1}>
                     {Array.from({ length: 30 }).map((_, i) => (
                        <AnimatedStar key={`bg-star-2-${i}`} top={Math.random()*100} left={Math.random()*100} size={2} speed={20} />
                    ))}
                </ParallaxLayer>

                {/* Ebene 2: Schnellere Sterne im Mittelgrund */}
                <ParallaxLayer offset={0} speed={0.5}>
                    {Array.from({ length: 15 }).map((_, i) => (
                        <AnimatedStar key={`mg-star-${i}`} top={Math.random()*100} left={Math.random()*100} size={4} speed={50} />
                    ))}
                </ParallaxLayer>

                {/* Ebene 3: Text */}
                <ParallaxLayer
                    offset={0}
                    speed={0.8}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
                        Eine Reise beginnt...
                    </h1>
                </ParallaxLayer>

                {/* FINALES BILD: Erscheint auf der zweiten Seite */}
                <ParallaxLayer offset={1} speed={0.2}>
                    <div className="w-full h-full flex items-center justify-center">
                         <img
                            src={finalImagePath}
                            alt="Finales Bild der Feier"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </ParallaxLayer>
            </Parallax>
        </div>
    );
}


// 2. Quiz Komponente
function Quiz({ onCorrectAnswer }) {
    const questions = [
        {
            question: "Was ist die Hauptstadt von Deutschland?",
            options: ["München", "Hamburg", "Berlin", "Köln"],
            correctAnswer: "Berlin"
        },
        {
            question: "Wie viele Tage hat ein Jahr (kein Schaltjahr)?",
            options: ["364", "365", "366", "360"],
            correctAnswer: "365"
        }
    ];

    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
    const [wrongAttempts, setWrongAttempts] = React.useState(0);
    const [feedback, setFeedback] = React.useState('');
    const [isLocked, setIsLocked] = React.useState(false);

    const handleAnswer = (answer) => {
        if (isLocked) return;

        if (answer === questions[currentQuestionIndex].correctAnswer) {
            setFeedback('Richtig! Du wirst weitergeleitet...');
            setIsLocked(true); 
            setTimeout(onCorrectAnswer, 1500);
        } else {
            const newWrongAttempts = wrongAttempts + 1;
            setWrongAttempts(newWrongAttempts);
            if (newWrongAttempts >= 5) {
                setFeedback('Leider zu viele Versuche. Kein Zutritt.');
                setIsLocked(true);
            } else {
                setFeedback(`Falsch! Versuch es noch einmal. (${newWrongAttempts}/5 Versuche)`);
            }
        }
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="w-full max-w-md mx-auto bg-slate-800 p-8 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">{currentQuestion.question}</h2>
            <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map(option => (
                    <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        disabled={isLocked}
                        className="w-full bg-slate-700 hover:bg-indigo-600 disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
                    >
                        {option}
                    </button>
                ))}
            </div>
            {feedback && (
                <p className={`mt-6 text-center font-semibold ${feedback.includes('Falsch') ? 'text-amber-400' : feedback.includes('Richtig') ? 'text-green-400' : 'text-red-500'}`}>
                    {feedback}
                </p>
            )}
        </div>
    );
}

// 3. Registrierungsformular Komponente (Überarbeitete Version mit Ja/Nein-Frage)
function RegistrationForm({ onFormSubmit }) {
    const [attendanceStatus, setAttendanceStatus] = React.useState('unanswered'); // 'unanswered', 'yes', 'no'
    const [guestCount, setGuestCount] = React.useState(1);
    const [names, setNames] = React.useState(['']);
    const [email, setEmail] = React.useState('');
    
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleGuestCountChange = (e) => {
        const count = parseInt(e.target.value, 10);
        setGuestCount(count);

        const newNames = [...names];
        if (count > newNames.length) {
            for (let i = newNames.length; i < count; i++) {
                newNames.push('');
            }
        } else {
            newNames.length = count;
        }
        setNames(newNames);
    };

    const handleNameChange = (index, value) => {
        const newNames = [...names];
        newNames[index] = value;
        setNames(newNames);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const allNamesFilled = names.every(name => name.trim() !== '');
        if (!allNamesFilled || !email.trim()) {
            setError('Bitte fülle alle Namen und die E-Mail-Adresse aus.');
            return;
        }
        
        setError('');
        setIsLoading(true);

        const finalFormData = {
            email: email,
            guests: guestCount,
            names: names,
        };

        console.log('Speichere Daten:', finalFormData);
        
        setTimeout(() => {
            setIsLoading(false);
            onFormSubmit();
        }, 2000);
    };

    return (
        <div className="w-full max-w-md mx-auto bg-slate-800 p-8 rounded-xl shadow-2xl">
            {attendanceStatus === 'unanswered' && (
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-6">Bist du dabei?</h2>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => setAttendanceStatus('yes')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300">
                            Ja!
                        </button>
                        <button onClick={() => setAttendanceStatus('no')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300">
                            Nein
                        </button>
                    </div>
                </div>
            )}

            {attendanceStatus === 'no' && (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Schade!</h2>
                    <p className="text-slate-400">Du verpasst die Party des Jahres! Denk an all die Geschichten, die du nicht erzählen kannst.</p>
                </div>
            )}

            {attendanceStatus === 'yes' && (
                 <>
                    <h2 className="text-3xl font-bold mb-6 text-center">Anmeldung zur Feier</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="guests" className="block text-slate-400 mb-2">Anzahl Personen</label>
                            <select 
                                id="guests" 
                                name="guests" 
                                value={guestCount} 
                                onChange={handleGuestCountChange} 
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="1">1 Person</option>
                                <option value="2">2 Personen</option>
                                <option value="3">3 Personen</option>
                                <option value="4">4 Personen</option>
                            </select>
                        </div>

                        {Array.from({ length: guestCount }).map((_, index) => (
                            <div key={index}>
                                <label htmlFor={`name-${index}`} className="block text-slate-400 mb-2">
                                    Name Person {index + 1}
                                </label>
                                <input 
                                    type="text" 
                                    id={`name-${index}`} 
                                    name={`name-${index}`} 
                                    value={names[index] || ''}
                                    onChange={(e) => handleNameChange(index, e.target.value)}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                    required 
                                />
                            </div>
                        ))}

                        <div>
                            <label htmlFor="email" className="block text-slate-400 mb-2">Kontakt E-Mail</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                required 
                            />
                        </div>

                        {error && <p className="text-red-400 text-center">{error}</p>}
                        
                        <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-indigo-400 flex items-center justify-center !mt-8">
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Anmeldung bestätigen'}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}

// 4. Erfolgsnachricht Komponente
function SuccessMessage() {
    return (
        <div className="w-full max-w-md mx-auto bg-slate-800 p-8 rounded-xl shadow-2xl text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500 mb-4">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h2 className="text-3xl font-bold mb-2">Anmeldung erfolgreich!</h2>
            <p className="text-slate-400">
                Vielen Dank für deine Anmeldung. Du bist auf der Gästeliste!
                Eine Bestätigungs-E-Mail wurde soeben an dich versendet.
            </p>
        </div>
    );
}
