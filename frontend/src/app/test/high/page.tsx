'use client'
import React, { useState } from 'react';
import { AlertCircle, FileText, Highlighter } from 'lucide-react';

interface HighlightData {
  text: string;
  highlights: {
    start: number;
    end: number;
    color?: string;
    label?: string;
  }[];
}

const defaultData: HighlightData = {
  text: "Natural language processing (NLP) is a subfield of linguistics, computer science, and artificial intelligence concerned with the interactions between computers and human language. Modern NLP techniques use machine learning to understand and generate human language.",
  highlights: [
    { start: 0, end: 30, color: "#fef08a", label: "Topic" },
    { start: 46, end: 58, color: "#bfdbfe", label: "Field" },
    { start: 60, end: 76, color: "#bfdbfe", label: "Field" },
    { start: 82, end: 106, color: "#bfdbfe", label: "Field" },
    { start: 144, end: 159, color: "#d9f99d", label: "Key Concept" },
    { start: 168, end: 185, color: "#fecaca", label: "Technology" }
  ]
};

export default function TextHighlighter() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(defaultData, null, 2));
  const [data, setData] = useState<HighlightData>(defaultData);
  const [error, setError] = useState<string>("");

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.text || !Array.isArray(parsed.highlights)) {
        throw new Error("Invalid format: requires 'text' and 'highlights' array");
      }
      setData(parsed);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  const renderHighlightedText = () => {
    const { text, highlights } = data;
    const segments: { text: string; highlight?: typeof highlights[0] }[] = [];
    
    // Sort highlights by start position
    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
    
    let lastIndex = 0;
    sortedHighlights.forEach(highlight => {
      // Add text before highlight
      if (highlight.start > lastIndex) {
        segments.push({ text: text.slice(lastIndex, highlight.start) });
      }
      // Add highlighted text
      segments.push({
        text: text.slice(highlight.start, highlight.end),
        highlight
      });
      lastIndex = highlight.end;
    });
    
    // Add remaining text
    if (lastIndex < text.length) {
      segments.push({ text: text.slice(lastIndex) });
    }

    return segments.map((segment, idx) => {
      if (segment.highlight) {
        return (
          <span
            key={idx}
            className="relative inline-block group"
            style={{
              backgroundColor: segment.highlight.color || '#fef08a',
              padding: '2px 0'
            }}
          >
            {segment.text}
            {segment.highlight.label && (
              <span className="absolute bottom-full left-0 mb-1 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {segment.highlight.label}
              </span>
            )}
          </span>
        );
      }
      return <span key={idx}>{segment.text}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Highlighter className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">Text Highlighter</h1>
          </div>
          <p className="text-gray-600">Add highlights to your text with custom colors and labels</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* JSON Input */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <FileText className="w-5 h-5" />
              JSON Configuration
            </h2>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter JSON data..."
            />
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <button
              onClick={handleApply}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Apply Highlights
            </button>
          </div>

          {/* Format Guide */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Format Guide</h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">JSON Structure:</h3>
                <pre className="bg-gray-50 p-3 rounded-lg overflow-x-auto">
{`{
  "text": "Your text here",
  "highlights": [
    {
      "start": 0,
      "end": 10,
      "color": "#fef08a",
      "label": "Optional label"
    }
  ]
}`}
                </pre>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Fields:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><strong>text:</strong> The full text to display</li>
                  <li><strong>start:</strong> Start position (0-indexed)</li>
                  <li><strong>end:</strong> End position (exclusive)</li>
                  <li><strong>color:</strong> Background color (hex)</li>
                  <li><strong>label:</strong> Tooltip on hover (optional)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Color Examples:</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded" style={{ backgroundColor: '#fef08a' }}>Yellow</span>
                  <span className="px-3 py-1 rounded" style={{ backgroundColor: '#bfdbfe' }}>Blue</span>
                  <span className="px-3 py-1 rounded" style={{ backgroundColor: '#fecaca' }}>Red</span>
                  <span className="px-3 py-1 rounded" style={{ backgroundColor: '#d9f99d' }}>Green</span>
                  <span className="px-3 py-1 rounded" style={{ backgroundColor: '#e9d5ff' }}>Purple</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Highlighted Document */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
            Highlighted Document
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed text-gray-700">
              {renderHighlightedText()}
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-6 italic">
            Hover over highlighted text to see labels
          </p>
        </div>
      </div>
    </div>
  );
}