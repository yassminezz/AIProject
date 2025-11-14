import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header.tsx';
import Features from './components/Features.tsx';
import SlideViewer from './components/SlideViewer.tsx';
import TutorialOverlay from './components/TutorialOverlay.tsx';
import { generateMindMapFromBase64 } from './services/gemini.ts';
import { AppState, MindMapData, Language } from './types.ts';
import { Upload, Loader2, AlertCircle, FileUp, Sparkles } from 'lucide-react';
import { translations } from './utils/translations.ts';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const [language, setLanguage] = useState<Language>('fr');
  const [tutorialStep, setTutorialStep] = useState<'upload' | 'viewing' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState('');
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language].hero;

  useEffect(() => {
    // This check ensures the app fails gracefully if the API_KEY environment variable is not provided.
    // For deployment on platforms like Netlify, the API_KEY should be set in the environment variables.
    // The provided index.html expects an /env.js file to populate process.env.
    if (!process.env.API_KEY) {
      console.error("CRITICAL: API_KEY environment variable is not set.");
      setIsApiKeyMissing(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    const uploadSeen = localStorage.getItem('nodqra_tutorial_upload_seen');
    if (!uploadSeen) {
      setTutorialStep('upload');
    }
  }, []);

  useEffect(() => {
    // Fix: Use ReturnType<typeof setInterval> for the interval ID type, which is appropriate for browser environments.
    let interval: ReturnType<typeof setInterval>;
    if (appState === AppState.GENERATING) {
      const messages = t.analyzingMessages;
      let i = 0;
      setCurrentLoadingMessage(messages[i]);
      interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setCurrentLoadingMessage(messages[i]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [appState, language, t.analyzingMessages]);

  const handleTutorialComplete = () => {
    if (tutorialStep === 'upload') localStorage.setItem('nodqra_tutorial_upload_seen', 'true');
    else if (tutorialStep === 'viewing') localStorage.setItem('nodqra_tutorial_view_seen', 'true');
    setTutorialStep(null);
  };

  const handleFile = async (file: File) => {
    if (isApiKeyMissing) {
      setError("Cannot process file: API Key is not configured.");
      return;
    }

    const supportedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];
    const isValid = supportedMimeTypes.includes(file.type) || file.name.endsWith('.pdf');

    if (!isValid) {
      setError(t.formatError);
      return;
    }

    setLoading(true);
    setError(null);
    setAppState(AppState.GENERATING);
    setTutorialStep(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        try {
          const data = await generateMindMapFromBase64(base64, file.type, language);
          setMindMapData(data);
          setAppState(AppState.VIEWING);
          
          const viewSeen = localStorage.getItem('nodqra_tutorial_view_seen');
          if (!viewSeen) setTutorialStep('viewing');

        } catch (err) {
          console.error(err);
          setError(t.error);
          setAppState(AppState.LANDING);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Erreur de lecture du fichier.");
      setLoading(false);
      setAppState(AppState.LANDING);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };
  
  const triggerUpload = () => fileInputRef.current?.click();

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) handleFile(files[0]);
  };

  const resetApp = () => {
    setAppState(AppState.LANDING);
    setMindMapData(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  if (isApiKeyMissing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-red-200 p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">API Key Not Found</h1>
          <p className="text-gray-600">
            The <code className="bg-red-100 text-red-700 font-mono text-sm p-1 rounded">API_KEY</code> for the Gemini API is missing.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            To make this application work, you need to provide your API key. If you are deploying to Netlify, set it as an environment variable in your site's deployment settings.
          </p>
          <div className="mt-6 p-3 bg-gray-50 rounded-lg text-left text-xs text-gray-600">
            <p className="font-semibold">Deployment Note:</p>
            <p className="mt-1">This app is designed to load the API key from an <code className="font-mono">/env.js</code> file, which is typically generated during a Netlify build from your environment variables.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-light text-dark">
      {tutorialStep && <TutorialOverlay step={tutorialStep} onComplete={handleTutorialComplete} language={language}/>}

      <Header onLogoClick={resetApp} language={language} setLanguage={setLanguage} />

      <main className="flex-grow">
        {(appState === AppState.LANDING || appState === AppState.GENERATING) && (
          <div className="max-w-4xl mx-auto px-4 text-center pt-16 sm:pt-24">
            <h1 className="text-4xl md:text-6xl font-extrabold text-dark mb-4 leading-tight tracking-tighter">
              {t.title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-light">
                {t.highlight}
              </span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>

            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-2xl mx-auto border border-gray-100 transform transition-all hover:shadow-2xl relative">
              {appState === AppState.GENERATING ? (
                <div className="flex flex-col items-center justify-center py-8 h-[244px]">
                  <Loader2 className="h-12 w-12 text-primary animate-spin mb-6" />
                  <h3 className="text-xl font-bold text-dark">{t.analyzing}</h3>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentLoadingMessage}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-500"
                    >
                      {currentLoadingMessage}
                    </motion.p>
                  </AnimatePresence>
                </div>
              ) : (
                <div 
                  onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
                  className={`relative z-10 p-4 rounded-xl border-2 border-dashed transition-colors duration-300 ${isDragging ? 'border-primary bg-violet-50' : 'border-gray-200'}`}
                >
                   <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,image/*,.pptx"/>
                   <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <div className={`p-4 rounded-full transition-all duration-300 ${isDragging ? 'bg-primary text-white scale-110' : 'bg-primary/10 text-primary'}`}>
                        <FileUp className="h-8 w-8" />
                      </div>
                      <p className="font-semibold text-gray-700">{t.dropzone}</p>
                      <p className="text-gray-400 text-sm">{t.dropzoneOr}</p>
                      <button onClick={triggerUpload} className="w-full sm:w-auto px-8 bg-primary-dark hover:bg-primary text-white py-3 rounded-lg font-bold text-base shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5">
                        <Upload className="h-5 w-5 rtl:ml-2" />
                        {t.upload}
                      </button>
                      <p className="pt-2 text-xs text-gray-400 uppercase tracking-wider font-medium">{t.formats}</p>
                   </div>
                   {error && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[120%] bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-12 flex justify-center gap-6 text-xs text-gray-500 flex-wrap">
              <span className="flex items-center gap-1.5">🔒 {t.secure}</span>
              <span className="flex items-center gap-1.5">⚡ {t.instant}</span>
              <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3 text-yellow-500" /> {t.program}</span>
            </div>
          </div>
        )}

        {appState === AppState.VIEWING && mindMapData && (
            <SlideViewer data={mindMapData} onReset={resetApp} language={language} />
        )}

        {appState === AppState.LANDING && <Features language={language} />}
      </main>

      <footer className="bg-white border-t border-gray-100 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="text-primary font-bold text-lg">Nodqra</span>
            <span>© 2025</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary">Confidentialité</a>
            <a href="#" className="hover:text-primary">Conditions</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;