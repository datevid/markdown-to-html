"use client"
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import ReactDOMServer from 'react-dom/server';

type ComponentType = React.ComponentType<{
    children: React.ReactNode;
    [key: string]: any;
}>;

const MarkdownConverter: React.FC = () => {
    const [markdown, setMarkdown] = useState<string>('');
    const [htmlCode, setHtmlCode] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

    const components: { [nodeType: string]: ComponentType } = {
        h1: ({ children, ...props }) => <h1 className="text-4xl font-bold mb-4" {...props}>{children}</h1>,
        h2: ({ children, ...props }) => <h2 className="text-3xl font-bold mb-3" {...props}>{children}</h2>,
        h3: ({ children, ...props }) => <h3 className="text-2xl font-bold mb-2" {...props}>{children}</h3>,
        h4: ({ children, ...props }) => <h4 className="text-xl font-bold mb-2" {...props}>{children}</h4>,
        h5: ({ children, ...props }) => <h5 className="text-lg font-bold mb-1" {...props}>{children}</h5>,
        h6: ({ children, ...props }) => <h6 className="text-base font-bold mb-1" {...props}>{children}</h6>,
        p: ({ children, ...props }) => <p className="mb-4" {...props}>{children}</p>,
        ul: ({ children, ...props }) => <ul className="list-disc list-inside mb-4" {...props}>{children}</ul>,
        ol: ({ children, ...props }) => <ol className="list-decimal list-inside mb-4" {...props}>{children}</ol>,
        li: ({ children, ...props }) => <li className="mb-1" {...props}>{children}</li>,
        a: ({ children, ...props }) => <a className="text-blue-500 hover:underline" {...props}>{children}</a>,
        blockquote: ({ children, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4" {...props}>{children}</blockquote>,
        code: ({ inline, children, ...props }: { inline?: boolean; children: React.ReactNode; [key: string]: any }) =>
            inline
                ? <code className="bg-gray-100 rounded px-1" {...props}>{children}</code>
                : <pre className="bg-gray-100 rounded p-4 mb-4"><code {...props}>{children}</code></pre>,
    };

    useEffect(() => {
        const htmlString = ReactDOMServer.renderToStaticMarkup(
            <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
        );
        setHtmlCode(htmlString);
    }, [markdown]);

    const demoMarkdown = `# Sample Markdown
This is a basic example of Markdown.
## Second Heading
 * Unordered list:
   - Item 1
   - Item 2
   - Item 3
 * More items
> This is a blockquote.
**Bold text**, *italic text*, and combined **bold and *italic*** text. ~~Strikethrough~~ text. [Link to example](https://example.com).
### Code Example:
\`\`\`js
var foo = 'bar';
function baz(s) {
   return foo + ':' + s;
}
\`\`\`
Inline code: \`var foo = 'bar';\`.
The end.`;

    const handleDemoClick = () => {
        setMarkdown(demoMarkdown);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Markdown to HTML Converter</h1>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                    <h2 className="text-xl font-semibold mb-2">Markdown Input</h2>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
                        onClick={handleDemoClick}
                    >
                        Demo
                    </button>
                    <textarea
                        className="w-full h-[calc(100vh-250px)] p-2 border rounded resize-none"
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        placeholder="Enter your Markdown here..."
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <div className="flex mb-4">
                        <button
                            className={`py-2 px-4 font-semibold rounded-tl-lg rounded-tr-lg ${
                                activeTab === 'preview'
                                    ? 'bg-white border-t border-l border-r'
                                    : 'bg-gray-200'
                            }`}
                            onClick={() => setActiveTab('preview')}
                        >
                            HTML Preview
                        </button>
                        <button
                            className={`py-2 px-4 font-semibold rounded-tl-lg rounded-tr-lg ${
                                activeTab === 'code'
                                    ? 'bg-white border-t border-l border-r'
                                    : 'bg-gray-200'
                            }`}
                            onClick={() => setActiveTab('code')}
                        >
                            HTML Code
                        </button>
                    </div>
                    <div className="border rounded p-4 h-[calc(100vh-300px)] overflow-auto bg-white">
                        {activeTab === 'preview' ? (
                            <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
                        ) : (
                            <pre className="bg-gray-100 p-4 rounded">
                                <code>{htmlCode}</code>
                            </pre>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarkdownConverter;