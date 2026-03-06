/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  User, 
  Baby, 
  Stethoscope, 
  ClipboardList, 
  Pill, 
  MessageSquare,
  Info,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { 
  PATIENT_TYPES, 
  KEYWORDS, 
  CLASSIFICATION_DATA, 
  QA_DATA, 
  HERBAL_STANDARDS,
  ClassificationType 
} from './constants';

export default function App() {
  const [patientType, setPatientType] = useState<'child' | 'adult'>('child');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [openQA, setOpenQA] = useState<number | null>(null);

  const classification = useMemo(() => {
    if (selectedKeywords.length === 0) return null;

    // Priority: 구조문제형 > 농성분비물형 > 건조위축형 > 건조비후형 > 부종형
    if (selectedKeywords.some(k => ['K14', 'K15', 'K16'].includes(k))) return '구조문제형';
    if (selectedKeywords.some(k => ['K11', 'K12', 'K13'].includes(k))) return '농성분비물형';
    if (selectedKeywords.some(k => ['K8', 'K9', 'K10'].includes(k))) return '건조위축형';
    if (selectedKeywords.some(k => ['K5', 'K6', 'K7'].includes(k))) return '건조비후형';
    if (selectedKeywords.some(k => ['K1', 'K2', 'K3', 'K4'].includes(k))) return '부종형';
    
    return null;
  }, [selectedKeywords]);

  const toggleKeyword = (id: string) => {
    setSelectedKeywords(prev => 
      prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]
    );
    setShowResult(false);
  };

  const handleShowResult = () => {
    if (selectedKeywords.length > 0) {
      setShowResult(true);
      // Scroll to result
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const resultData = classification ? CLASSIFICATION_DATA[classification] : null;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <Stethoscope size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-emerald-950">
              숨쉬는한의원 <span className="text-emerald-600">처방툴</span>
            </h1>
          </div>
          <div className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-1 rounded">
            점막 키워드 기반
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Step 1: Patient Type */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">1</div>
            <h2 className="text-lg font-semibold">환자 유형 선택</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {PATIENT_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setPatientType(type.id as 'child' | 'adult')}
                className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  patientType === type.id 
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-inner' 
                    : 'border-stone-100 bg-stone-50 text-stone-500 hover:border-stone-200'
                }`}
              >
                {type.id === 'child' ? <Baby size={24} /> : <User size={24} />}
                <span className="font-bold text-lg">{type.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2: Keyword Selection */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">2</div>
            <h2 className="text-lg font-semibold">점막 키워드 선택 <span className="text-stone-400 text-sm font-normal ml-2">(복수 선택 가능)</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {KEYWORDS.map(keyword => (
              <label
                key={keyword.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedKeywords.includes(keyword.id)
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : 'border-stone-100 hover:bg-stone-50'
                }`}
              >
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    checked={selectedKeywords.includes(keyword.id)}
                    onChange={() => toggleKeyword(keyword.id)}
                    className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-emerald-700 mb-0.5">{keyword.id}</span>
                  <span className="text-sm leading-tight text-stone-700">{keyword.label}</span>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleShowResult}
              disabled={selectedKeywords.length === 0}
              className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all ${
                selectedKeywords.length > 0
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              점막분류 결과 보기
              <ArrowRight size={20} />
            </button>
          </div>
          {selectedKeywords.length === 0 && (
            <p className="text-center text-stone-400 text-sm mt-3 flex items-center justify-center gap-1">
              <AlertCircle size={14} /> 키워드를 1개 이상 선택해주세요.
            </p>
          )}
        </section>

        {/* Step 3: Result Section */}
        <AnimatePresence>
          {showResult && resultData && (
            <motion.section
              id="result-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="bg-emerald-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800/50 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-6">
                    <div>
                      <div className="text-emerald-300 text-sm font-bold uppercase tracking-widest mb-1">A. 점막분류</div>
                      <h3 className="text-4xl font-black">{resultData.title}</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                          <ClipboardList size={14} /> B. 특징
                        </div>
                        <ul className="space-y-1">
                          {resultData.characteristics.map((item: string, i: number) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="text-emerald-400 mt-1">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                          <div className="text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Info size={14} /> C. 진단명
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {resultData.diagnosis.map((item: string, i: number) => (
                              <span key={i} className="text-xs bg-emerald-800/50 px-2 py-1 rounded border border-emerald-700/50">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                          <div className="text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Stethoscope size={14} /> C. 진단 방법
                          </div>
                          <ul className="space-y-1">
                            {resultData.diagnosisMethod.map((item: string, i: number) => (
                              <li key={i} className="text-xs flex items-start gap-2">
                                <span className="text-emerald-400">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-72 shrink-0">
                    <div className="rounded-xl overflow-hidden border border-white/20 shadow-2xl">
                      <img 
                        src={resultData.imageUrl} 
                        alt={resultData.title}
                        className="w-full aspect-[4/3] object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="bg-white/5 p-2 text-[10px] text-center text-emerald-300 italic">
                        * 점막 참고 이미지 (시각적 이해를 돕기 위함)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 flex flex-col">
                  <div className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-1">
                    <Pill size={16} /> D. 치료 및 처방
                  </div>
                  
                  <div className="space-y-6 flex-1">
                    <div>
                      <h4 className="text-sm font-bold text-stone-500 mb-2">치료 방법</h4>
                      <div className="flex flex-wrap gap-2">
                        {resultData.treatment.map((item: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 bg-stone-50 border border-stone-100 px-3 py-2 rounded-lg text-sm font-medium">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-stone-500">처방 정보</h4>
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-3">
                        <div>
                          <span className="text-[10px] font-black text-emerald-600 uppercase block mb-1">1차 처방</span>
                          <p className="text-emerald-950 font-bold">{resultData.prescription.first}</p>
                        </div>
                        <div className="h-px bg-emerald-200/50"></div>
                        <div>
                          <span className="text-[10px] font-black text-emerald-600 uppercase block mb-1">2차 처방</span>
                          <p className="text-emerald-950 font-bold">{resultData.prescription.second}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
                  <div className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-1">
                    <MessageSquare size={16} /> E. 예후 및 티칭
                  </div>
                  <div className="space-y-4">
                    {resultData.prognosis.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-sm text-stone-700 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Herbal Medicine Standards */}
              <div className="bg-stone-100 rounded-2xl p-6 border border-stone-200">
                <h4 className="text-sm font-bold text-stone-600 mb-4 flex items-center gap-2">
                  <ClipboardList size={16} /> 건강보험 첩약 처방 기준
                </h4>
                <div className="space-y-4">
                  {HERBAL_STANDARDS.map((herb, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
                      <h5 className="font-bold text-emerald-800 mb-2">{herb.name}</h5>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-stone-400 uppercase">성인 기준</span>
                          <p className="text-xs text-stone-600 leading-relaxed">{herb.adult}</p>
                        </div>
                        <div className="h-px bg-stone-100"></div>
                        <div>
                          <span className="text-[10px] font-bold text-stone-400 uppercase">10세 이하 기준</span>
                          <p className="text-xs text-stone-600 leading-relaxed">{herb.child}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Q/A Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-6 border-b border-stone-100 bg-stone-50/50">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <MessageSquare size={20} className="text-emerald-600" />
              자주 묻는 질문 (Q&A)
            </h2>
            <p className="text-sm text-stone-500 mt-1">숨쉬는한의원 치료에 대한 상세 안내입니다.</p>
          </div>
          
          <div className="divide-y divide-stone-100">
            {QA_DATA.map((item, index) => (
              <div key={index} className="group">
                <button
                  onClick={() => setOpenQA(openQA === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-stone-50 transition-colors"
                >
                  <span className={`text-sm font-bold transition-colors ${openQA === index ? 'text-emerald-700' : 'text-stone-700'}`}>
                    {item.q}
                  </span>
                  {openQA === index ? (
                    <ChevronUp size={18} className="text-emerald-600" />
                  ) : (
                    <ChevronDown size={18} className="text-stone-400" />
                  )}
                </button>
                <AnimatePresence>
                  {openQA === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <div className="bg-stone-50 rounded-xl p-4 text-sm text-stone-600 leading-relaxed whitespace-pre-wrap border border-stone-100">
                          {item.a}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 text-center text-stone-400 text-xs space-y-2">
        <p>© 숨쉬는한의원. 본 툴은 내부 처방 가이드용으로 제작되었습니다.</p>
        <p>환자의 상태에 따라 최종 처방은 한의사의 진단 하에 변경될 수 있습니다.</p>
      </footer>
    </div>
  );
}
