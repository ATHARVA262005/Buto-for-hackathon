import React, { useState } from 'react';
import { Send, Edit2, Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const PromptSubmitPage = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation

  const [prompt, setPrompt] = useState('');
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPromptLocked, setIsPromptLocked] = useState(false);

  // Simulate AI generation - Replace this with your actual AI API call
  const generateAIOutput = async (promptText) => {
    setIsLoading(true);
    setIsPromptLocked(true); // Lock prompt editing when generation starts
    try {
      // Replace this with your actual AI API endpoint
      const response = await fetch('YOUR_AI_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
      });
      const data = await response.json();
      setGeneratedOutput(data.output);
    } catch (error) {
      console.error('Error generating output:', error);
      setGeneratedOutput('Error generating output. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    setIsSubmitted(false);
  };

  const handleGenerate = () => {
    if (prompt.trim()) {
      generateAIOutput(prompt);
    }
  };

  const handleEnableEditing = () => {
    setGeneratedOutput('');
    setIsPromptLocked(false);
    // Focus the textarea after enabling editing
    setTimeout(() => {
      document.getElementById('prompt-textarea').focus();
    }, 0);
  };

  const handleSubmit = () => {
    if (prompt.trim() && generatedOutput) {
      console.log('Submitting prompt:', { prompt, generatedOutput });
      setIsSubmitted(true);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col text-white relative">
      {/* ✅ Back Button (No Boundary) */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 text-white hover:text-gray-400 transition-colors flex items-center gap-2"
      >
        <ArrowLeft size={24} />
        Back
      </button>

      <div className="p-6 text-center border-b border-gray-700">
        <h1 className="text-3xl font-bold">Submit Your Prompt for Battle</h1>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Prompt Input Section - Left Half */}
        <div className="flex-1 flex flex-col p-6 border-r border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Prompt Preview </h2>
          <div className="relative flex-1">
            <textarea
              id="prompt-textarea"
              value={prompt}
              onChange={handlePromptChange}
              placeholder="Enter your prompt here..."
              disabled={isPromptLocked}
              className={`w-full h-full p-4 bg-gray-800 border border-gray-700 rounded-lg resize-none focus:outline-none focus:border-blue-500 placeholder-gray-500 transition-opacity duration-300 ${
                isPromptLocked ? 'opacity-50' : 'opacity-100'
              }`}
              style={{ minHeight: '200px' }}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isLoading || isPromptLocked}
            className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Send size={18} />
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {/* Generated Output Section - Right Half */}
        <div className="flex-1 flex flex-col p-6 border-t md:border-t-0 md:border-l border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Result Preview</h2>
          <div className="flex-1 p-4 bg-gray-800 border border-gray-400 rounded-lg overflow-auto">
            {generatedOutput || 'Your generated output will be displayed here...'}
          </div>
          <div className="mt-4 flex gap-4">
            <button
              onClick={handleEnableEditing}
              disabled={isLoading || !isPromptLocked}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:bg-gray-800 transition-colors"
            >
              <Edit2 size={18} />
              Edit Prompt
            </button>
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim() || !generatedOutput || isSubmitted || isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
            >
              <Check size={18} />
              {isSubmitted ? 'Submitted!' : 'Submit to Battle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptSubmitPage;
