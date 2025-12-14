import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, BookOpen, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMSAU } from '../hooks/useMSAU';

export function TeachingZone() {
  const { vm, teach, reset } = useMSAU();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const isLoading = vm.flow.status === 'working';
  const explanation = vm.teaching?.explanation;
  const metaphor = vm.teaching?.metaphorUsed;
  const error = vm.error?.message;

  useEffect(() => {
    if (explanation) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [explanation]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const textToSend = input;
    setInput('');
    await teach({ text: textToSend });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-xl shadow-inner">
      <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold tracking-wide text-sm uppercase">Zona de Enseñanza</span>
        </div>
        <button
          onClick={() => reset()}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-red-500"
          title="Reiniciar Sesión"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
        {!explanation && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <Sparkles className="w-12 h-12 text-indigo-300" />
            <p className="text-center font-medium">¿Qué quieres que aprenda hoy?</p>
          </div>
        )}

        {error && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <div>
                <p className="font-bold">Error del Sistema</p>
                <p>{error}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {explanation && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 space-y-4"
            >
              {metaphor && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                  <Sparkles className="w-3 h-3" />
                  Metáfora: {metaphor}
                </div>
              )}
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                {explanation}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {isLoading && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full space-y-4"
            >
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
              <span>Procesando en Núcleo V10...</span>
            </motion.div>
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200 shadow-lg">
        <div className="relative flex items-center gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Explícame algo..."
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm text-slate-800"
            autoFocus
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:bg-slate-300 transition-all"
          >
            {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
