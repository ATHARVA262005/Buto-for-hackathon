import React, { useState } from 'react';
import { Send, Edit2, Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import SubmitSuccessModal from '../components/SubmitSuccessModal';

const PromptSubmitPage = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation
  const theme = "Programming Challenge"; // This could come from props or route params

  const [prompt, setPrompt] = useState('');
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPromptLocked, setIsPromptLocked] = useState(false);
  const [problemStatement, setProblemStatement] = useState('');
  const [isProblemStatementValid, setIsProblemStatementValid] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedPrompt, setSubmittedPrompt] = useState(null);

  // Add markdown components configuration
  const markdownComponents = {
    // Update components with width constraints
    h1: ({ node, ...props }) => <h1 {...props} className="text-blue-400 text-2xl font-bold my-4 break-words" />,
    h2: ({ node, ...props }) => <h2 {...props} className="text-blue-400 text-xl font-bold my-3 break-words" />,
    h3: ({ node, ...props }) => <h3 {...props} className="text-blue-400 text-lg font-bold my-2 break-words" />,
    p: ({ node, ...props }) => <p {...props} className="my-2 text-gray-200 break-words whitespace-pre-wrap" />,
    code: ({ node, ...props }) => (
      <code {...props} className="bg-gray-800 px-1 py-0.5 rounded text-gray-200 break-all whitespace-pre-wrap" />
    ),
    pre: ({ node, ...props }) => (
      <pre {...props} className="bg-gray-800 p-4 rounded-lg my-4 overflow-x-auto whitespace-pre-wrap max-w-full" />
    ),
    ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside my-4" />,
    ol: ({ node, ...props }) => <ol {...props} className="list-decimal list-inside my-4" />,
    li: ({ node, ...props }) => <li {...props} className="my-2" />,
    strong: ({ node, ...props }) => <strong {...props} className="font-bold text-white" />,
    blockquote: ({ node, ...props }) => (
      <blockquote {...props} className="border-l-4 border-gray-600 pl-4 my-4 text-gray-400" />
    ),
  };

  // Simulate AI generation - Replace this with your actual AI API call
  const generateAIOutput = async (promptText) => {
    setIsLoading(true);
    setIsPromptLocked(true); // Lock prompt editing when generation starts
    try {
      // Replace this with your actual AI API endpoint
      const response = await fetch('http://localhost:5001/api/prompts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: promptText,
          subject: theme, // Use theme instead of subject
          problemStatement 
        }),
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

  const handleProblemStatementChange = (e) => {
    setProblemStatement(e.target.value);
    setIsProblemStatementValid(e.target.value.trim().length >= 10);
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

  const handleSubmit = async () => {
    if (prompt.trim() && generatedOutput && problemStatement) {
      try {
        const response = await fetch('http://localhost:5001/api/prompts/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            generatedOutput,
            subject: theme, // Use theme instead of subject
            problemStatement
          }),
        });
        const data = await response.json();
        setIsSubmitted(true);
        setSubmittedPrompt(data.prompt); // Save the submitted prompt data
      } catch (error) {
        console.error('Error submitting prompt:', error);
      }
    }
  };

  return (
    <>
      <div className="bg-gray-900 h-screen flex flex-col text-white relative overflow-hidden">
        {/* Back Button - adjust position */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-white hover:text-gray-400 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={24} />
          Back
        </button>

        {/* Reduce header padding */}
        <div className="py-4 text-center border-b border-gray-700">
          <h1 className="text-2xl font-bold">Submit Your Prompt for Battle</h1>
        </div>

        {/* Main content area - fill remaining height */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          {/* Left Half */}
          <div className={`flex-1 flex flex-col p-4 border-r border-gray-700 overflow-hidden ${isPromptLocked ? 'opacity-50' : ''}`}>
            {/* Theme display - reduce margins */}
            <div className="mb-2 p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm">
              <span className="text-blue-400 font-semibold">Current Theme:</span> {theme}
            </div>
            
            {/* Problem Statement - fixed height */}
            <h2 className="text-lg font-semibold mb-2">Problem Statement</h2>
            <textarea
              value={problemStatement}
              onChange={handleProblemStatementChange}
              placeholder="Describe the problem or challenge to be solved (minimum 10 characters)..."
              disabled={isPromptLocked}
              className="w-full p-3 mb-2 bg-gray-800 border border-gray-700 rounded-lg resize-none focus:outline-none focus:border-blue-500 placeholder-gray-500 custom-scrollbar"
              style={{ height: '120px' }}
            />

            {/* Prompt Section - fill remaining space */}
            <h2 className="text-lg font-semibold mb-2">Prompt Preview</h2>
            <div className="flex-1 min-h-0 relative">
              <textarea
                id="prompt-textarea"
                value={prompt}
                onChange={handlePromptChange}
                placeholder="Enter your prompt here..."
                disabled={!isProblemStatementValid || isPromptLocked}
                className={`w-full h-full p-3 bg-gray-800 border border-gray-700 rounded-lg resize-none focus:outline-none focus:border-blue-500 placeholder-gray-500 custom-scrollbar
                  ${!isProblemStatementValid ? 'opacity-50 cursor-not-allowed' : ''}
                  ${isPromptLocked ? 'opacity-50' : ''}`}
              />
              {!isProblemStatementValid && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-lg">
                  <p className="text-gray-400">Please complete the problem statement first</p>
                </div>
              )}
            </div>
            
            {/* Generate Button - reduce margin */}
            <button
              onClick={handleGenerate}
              disabled={!isProblemStatementValid || !prompt.trim() || isLoading || isPromptLocked}
              className="mt-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Send size={16} />
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>

          {/* Right Half */}
          <div className={`flex-1 flex flex-col p-4 border-t md:border-t-0 md:border-l border-gray-700 md:max-w-[50%] overflow-hidden
            ${(!isProblemStatementValid || !prompt.trim()) ? 'opacity-50' : ''}`}>
            <h2 className="text-lg font-semibold mb-2">Result Preview</h2>
            <div className="flex-1 min-h-0 bg-gray-800 border border-gray-400 rounded-lg">
              <div className="h-full overflow-y-auto custom-scrollbar p-3">
                <div className="w-full max-w-full break-words">
                  {generatedOutput ? (
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {generatedOutput}
                    </ReactMarkdown>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      {!isProblemStatementValid 
                        ? 'Complete the problem statement to proceed'
                        : !prompt.trim() 
                        ? 'Enter your prompt to generate output'
                        : 'Your generated output will be displayed here...'}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action buttons - reduce margin */}
            <div className="mt-3 flex gap-3">
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
                disabled={!isProblemStatementValid || !prompt.trim() || !generatedOutput || isSubmitted || isLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <Check size={18} />
                {isSubmitted ? 'Submitted!' : 'Submit to Battle'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Success Modal */}
      {showSuccessModal && (
        <SubmitSuccessModal
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      {isSubmitted && submittedPrompt && (
        <SubmitSuccessModal
          onClose={() => setIsSubmitted(false)}
          promptData={submittedPrompt}
        />
      )}
    </>
  );
};

// Update scrollbar styles to be more visible
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #1F2937;
    border-radius: 4px;
    margin: 2px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #4B5563;
    border-radius: 4px;
    border: 2px solid #1F2937;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #6B7280;
  }
  
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #4B5563 #1F2937;
  }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = scrollbarStyles;
document.head.appendChild(styleSheet);

export default PromptSubmitPage;
