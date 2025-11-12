import React from 'react';
import { HandwritingEvaluation } from '../types';

interface HandwritingFeedbackProps {
    feedback: HandwritingEvaluation;
}

const HandwritingFeedback: React.FC<HandwritingFeedbackProps> = ({ feedback }) => {
    const score = parseInt(feedback.writing_score, 10) || 0;
    const circumference = 2 * Math.PI * 45; // r=45
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-lg md:col-span-1 h-full relative border border-slate-200">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                        className="text-slate-200"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                    />
                    <circle
                        className="text-sky-500 transition-all duration-1000 ease-out"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute flex items-baseline text-3xl font-bold text-slate-800">
                    {score}
                    <span className="text-xl">%</span>
                </div>
                <p className="mt-2 text-lg font-semibold text-slate-700">Accuracy Score</p>
            </div>
            <div className="md:col-span-2 space-y-4">
                <div>
                    <h4 className="font-semibold text-sky-600 mb-1">Encouragement</h4>
                    <p className="text-slate-600 text-sm">{feedback.encouragement}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-sky-600 mb-1">Visual Feedback</h4>
                    <p className="text-slate-600 text-sm">{feedback.visual_feedback}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-sky-600 mb-1">Stroke Feedback</h4>
                    <p className="text-slate-600 text-sm">{feedback.stroke_feedback}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-sky-600 mb-1">Suggestion</h4>
                    <p className="text-slate-600 text-sm">{feedback.suggestion}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-sky-600 mb-1">Next Step</h4>
                    <p className="text-slate-600 text-sm">{feedback.next_step}</p>
                </div>
            </div>
        </div>
    );
};

export default HandwritingFeedback;