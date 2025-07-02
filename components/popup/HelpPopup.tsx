import React, { useState } from "react";
import IconButton from "../button/IconButton";

interface HelpPopupProps {
  open: boolean;
  onClose: () => void;
}

const helpPages = [
  { key: "intro", label: "Introduction" },
  { key: "search", label: "Search" },
  { key: "clean", label: "Clean" },
  { key: "frequency", label: "Frequency" },
  { key: "tfidf", label: "TF-IDF" },
  { key: "concordance", label: "Concordance" },
  { key: "faq", label: "FAQ" },
];

const HelpPopup: React.FC<HelpPopupProps> = ({ open, onClose }) => {
  const [selectedPage, setSelectedPage] = useState("intro");
  if (!open) return null;

  const renderContent = () => {
    switch (selectedPage) {
      case "intro":
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Welcome to Text Mining Platform</h3>
            <p className="mb-4 text-gray-700 leading-relaxed">
              This platform provides comprehensive text mining and analysis tools to help you extract meaningful
              insights from textual data.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-blue-800 mb-2">Available Tools:</h4>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li>
                  <strong>Search:</strong> Find specific patterns and keywords in your text
                </li>
                <li>
                  <strong>Clean:</strong> Preprocess and normalize your text data
                </li>
                <li>
                  <strong>Frequency:</strong> Analyze word occurrence and distribution
                </li>
                <li>
                  <strong>TF-IDF:</strong> Calculate term importance and relevance
                </li>
                <li>
                  <strong>Concordance:</strong> Examine word contexts and usage patterns
                </li>
              </ul>
            </div>
            <p className="text-gray-600">
              Click on each tab above to learn more about specific features and how to use them effectively.
            </p>
          </div>
        );
      case "search":
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-green-600">Search Tool</h3>
            <p className="mb-4 text-gray-700 leading-relaxed">
              The Search tool allows you to find specific words, phrases, or patterns within your text documents using
              powerful search capabilities.
            </p>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Key Features:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>Keyword Search:</strong> Find exact matches for specific words or phrases
                </li>
                <li>
                  <strong>Regular Expressions:</strong> Use pattern matching for complex searches
                </li>
                <li>
                  <strong>Case Sensitivity:</strong> Toggle between case-sensitive and case-insensitive searches
                </li>
                <li>
                  <strong>Wildcard Support:</strong> Use * and ? for flexible matching
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-green-800 mb-2">How to Use:</h4>
              <ol className="list-decimal list-inside text-green-700 space-y-1">
                <li>Enter your search term in the search box</li>
                <li>Select search options (case sensitivity, regex, etc.)</li>
                <li>Choose your target documents or dataset</li>
                <li>Click "Search" to find all matches</li>
                <li>Review results with highlighted matches and context</li>
              </ol>
            </div>

            <div className="bg-gray-50 p-3 rounded border-l-4 border-green-400">
              <p className="text-sm text-gray-600">
                <strong>Tip:</strong> Use quotes for exact phrase matching: "machine learning" will find only the exact
                phrase, not separate instances of "machine" and "learning".
              </p>
            </div>
          </div>
        );
      case "clean":
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-purple-600">Clean Tool</h3>
            <p className="mb-4 text-gray-700 leading-relaxed">
              The Clean tool preprocesses your text data by removing noise, normalizing formats, and preparing text for
              analysis.
            </p>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Cleaning Operations:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>Remove Punctuation:</strong> Strip punctuation marks and special characters
                </li>
                <li>
                  <strong>Convert Case:</strong> Transform text to lowercase or uppercase
                </li>
                <li>
                  <strong>Remove Stop Words:</strong> Filter out common words (a, an, the, etc.)
                </li>
                <li>
                  <strong>Remove Numbers:</strong> Strip numeric values from text
                </li>
                <li>
                  <strong>Remove Extra Whitespace:</strong> Normalize spacing and line breaks
                </li>
                <li>
                  <strong>Remove HTML Tags:</strong> Clean web-scraped content
                </li>
                <li>
                  <strong>Stemming/Lemmatization:</strong> Reduce words to root forms
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-purple-800 mb-2">Best Practices:</h4>
              <ul className="list-disc list-inside text-purple-700 space-y-1">
                <li>Always backup your original data before cleaning</li>
                <li>Apply cleaning steps in the right order</li>
                <li>Consider your analysis goals when choosing cleaning options</li>
                <li>Preview changes before applying to entire dataset</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-3 rounded border-l-4 border-purple-400">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> Different analyses may require different levels of cleaning. Sentiment analysis
                might benefit from keeping punctuation, while topic modeling often works better with heavily cleaned
                text.
              </p>
            </div>
          </div>
        );
      case "frequency":
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-orange-600">Frequency Analysis</h3>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Frequency Analysis counts and analyzes how often words or phrases appear in your text, providing insights
              into content themes and importance.
            </p>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Analysis Types:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>Word Frequency:</strong> Count individual word occurrences
                </li>
                <li>
                  <strong>N-gram Analysis:</strong> Analyze 2-word, 3-word, or longer phrases
                </li>
                <li>
                  <strong>Character Frequency:</strong> Analyze letter and character patterns
                </li>
                <li>
                  <strong>Relative Frequency:</strong> Compare frequencies across different texts
                </li>
                <li>
                  <strong>Frequency Distribution:</strong> Visualize word usage patterns
                </li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Use Cases:</h4>
                <ul className="list-disc list-inside text-orange-700 space-y-1 text-sm">
                  <li>Content analysis and summarization</li>
                  <li>Keyword identification</li>
                  <li>Document comparison</li>
                  <li>Language pattern analysis</li>
                  <li>Quality assessment</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Output Formats:</h4>
                <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                  <li>Frequency tables</li>
                  <li>Word clouds</li>
                  <li>Bar charts and histograms</li>
                  <li>Ranked word lists</li>
                  <li>Statistical summaries</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded border-l-4 border-orange-400">
              <p className="text-sm text-gray-600">
                <strong>Tip:</strong> Combine frequency analysis with text cleaning for more meaningful results. Remove
                stop words and punctuation to focus on content-bearing terms.
              </p>
            </div>
          </div>
        );
      case "tfidf":
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-red-600">TF-IDF Analysis</h3>
            <p className="mb-4 text-gray-700 leading-relaxed">
              TF-IDF (Term Frequency-Inverse Document Frequency) measures the importance of words in documents relative
              to a collection of documents, identifying terms that are both frequent and distinctive.
            </p>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Components Explained:</h4>
              <div className="space-y-3">
                <div className="bg-red-50 p-3 rounded">
                  <h5 className="font-semibold text-red-800">Term Frequency (TF)</h5>
                  <p className="text-red-700 text-sm">
                    How often a term appears in a specific document. Higher frequency suggests greater importance within
                    that document.
                  </p>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <h5 className="font-semibold text-red-800">Inverse Document Frequency (IDF)</h5>
                  <p className="text-red-700 text-sm">
                    How rare or common a term is across all documents. Rare terms get higher IDF scores, making them
                    more distinctive.
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded">
                  <h5 className="font-semibold text-red-800">TF-IDF Score</h5>
                  <p className="text-red-700 text-sm">
                    TF × IDF = Final score indicating term importance. High scores mean words are frequent in specific
                    documents but rare overall.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Applications:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Document classification and clustering</li>
                <li>Keyword extraction and SEO optimization</li>
                <li>Information retrieval and search ranking</li>
                <li>Content recommendation systems</li>
                <li>Automatic text summarization</li>
                <li>Feature selection for machine learning</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-3 rounded border-l-4 border-red-400">
              <p className="text-sm text-gray-600">
                <strong>Example:</strong> The word "python" might appear frequently in a programming document (high TF)
                but rarely in your entire document collection (high IDF), resulting in a high TF-IDF score indicating
                it's a key term for that document.
              </p>
            </div>
          </div>
        );
      case "concordance":
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">Concordance Analysis</h3>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Concordance analysis examines words in their surrounding context, showing how terms are used and what
              words commonly appear nearby, providing deeper insights into meaning and usage patterns.
            </p>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Key Features:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>KWIC (Keywords in Context):</strong> Shows target words with surrounding text
                </li>
                <li>
                  <strong>Collocations:</strong> Finds words that frequently appear together
                </li>
                <li>
                  <strong>Context Window:</strong> Adjustable range of surrounding words to analyze
                </li>
                <li>
                  <strong>Pattern Recognition:</strong> Identifies usage patterns and semantic relationships
                </li>
                <li>
                  <strong>Comparative Analysis:</strong> Compare word usage across different texts or time periods
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Use Cases:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-3 rounded">
                  <h5 className="font-semibold text-indigo-800 mb-1">Linguistic Research</h5>
                  <ul className="text-indigo-700 text-sm space-y-1">
                    <li>• Semantic analysis</li>
                    <li>• Language evolution studies</li>
                    <li>• Grammar pattern analysis</li>
                    <li>• Discourse analysis</li>
                  </ul>
                </div>
                <div className="bg-indigo-50 p-3 rounded">
                  <h5 className="font-semibold text-indigo-800 mb-1">Content Analysis</h5>
                  <ul className="text-indigo-700 text-sm space-y-1">
                    <li>• Brand sentiment analysis</li>
                    <li>• Topic modeling</li>
                    <li>• Content quality assessment</li>
                    <li>• Terminology consistency</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-indigo-800 mb-2">How to Interpret Results:</h4>
              <ul className="list-disc list-inside text-indigo-700 space-y-1">
                <li>Look for patterns in word combinations and contexts</li>
                <li>Identify semantic relationships between terms</li>
                <li>Notice changes in usage across different document sections</li>
                <li>Compare contexts to understand nuanced meanings</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-3 rounded border-l-4 border-indigo-400">
              <p className="text-sm text-gray-600">
                <strong>Example:</strong> Analyzing "bank" might show contexts like "river bank" vs "financial bank",
                helping distinguish different meanings and usage patterns of the same word.
              </p>
            </div>
          </div>
        );
      case "faq":
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Frequently Asked Questions</h3>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Q: What file formats are supported for text analysis?
                </h4>
                <p className="text-gray-700">
                  A: We support TXT, CSV, JSON, and PDF files. For best results, use plain text (TXT) or properly
                  formatted CSV files with text in designated columns.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: How large can my dataset be?</h4>
                <p className="text-gray-700">
                  A: The platform can handle datasets up to 100MB per upload. For larger datasets, consider splitting
                  them into smaller chunks or contact support for enterprise solutions.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Q: Can I save and export my analysis results?</h4>
                <p className="text-gray-700">
                  A: Yes, all analysis results can be exported in multiple formats including CSV, JSON, and PDF reports.
                  Results are also automatically saved to your project for future reference.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Q: Which languages are supported for text analysis?
                </h4>
                <p className="text-gray-700">
                  A: Currently, we support English, Spanish, French, German, and Chinese. Additional language support is
                  being added regularly. Check the language settings in your project configuration.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Q: How do I choose the right analysis tool for my project?
                </h4>
                <p className="text-gray-700">
                  A: Start with Search for basic exploration, use Clean to preprocess data, apply Frequency for word
                  distribution insights, TF-IDF for keyword identification, and Concordance for contextual analysis.
                  Often, a combination of tools provides the best results.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Need More Help?</h4>
                <p className="text-blue-700">
                  If you can't find the answer to your question, please contact our support team at{" "}
                  <strong>support@textmining.com</strong> or use the contact form in your project dashboard.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[95vh] min-h-[600px] overflow-hidden p-8 relative mx-4">
        {/* Title and Close Button Row */}
        <div className="flex items-center justify-between mb-4 pr-8" style={{ minHeight: 32 }}>
          <h2 className="text-2xl font-bold flex items-center h-8 m-0 p-0" style={{ lineHeight: "32px", height: 32 }}>
            Help
          </h2>
          <div className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-transparent border-none cursor-pointer">
            <IconButton imageSrc="/images/icon/close.svg" width={16} height={16} onClick={onClose} />
          </div>
        </div>
        {/* Horizontal button list */}
        <div className="flex flex-wrap gap-2 mb-4 border-b pb-3">
          {helpPages.map(page => (
            <button
              key={page.key}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                selectedPage === page.key
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
              }`}
              onClick={() => setSelectedPage(page.key)}
            >
              {page.label}
            </button>
          ))}
        </div>
        <div
          className="prose max-w-none overflow-y-auto custom-scrollbar pr-4"
          style={{ maxHeight: "70vh", minHeight: "350px" }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default HelpPopup;
