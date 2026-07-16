import { useState } from 'react'

function App() {
  const [screen, setScreen] = useState('login') 
  const [code, setCode] = useState('')
  const [review, setReview] = useState('') // AI ka reply save karne ke liye
  const [loading, setLoading] = useState(false) // Loading state ke liye
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedFile, setSelectedFile] = useState(null) // File upload ke liye

  // 🤖 BACKEND SE CONNECT KARNE KA FUNCTION (TEXT PASTE WALA)
  const handleReviewCode = async () => {
    if (!code) {
      alert("Bhai, pehle code toh paste kar!");
      return;
    }

    setLoading(true);
    setReview('');

    try {
      const response = await fetch('http://localhost:5050/api/review', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code }),
      });
      const data = await response.json();

      if (data.review) {
        setReview(data.review); 
      } else {
        setReview(data.error || "Kuch galti hui bhai!");
      }
    } catch (error) {
      console.error("Connection Error:", error);
      setReview("Backend se connect nahi ho pa rha bhai. Check karo server on hai na?");
    } finally {
      setLoading(false);
    }
  };

  // 📂 FILE UPLOAD HANDLING FUNCTION
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setSelectedFile(file);
    setLoading(true);
    setReview('');

    const formData = new FormData();
    formData.append('codeFile', file); 

    try {
      const response = await fetch('http://localhost:5050/api/review', { 
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.review) {
        setReview(data.review);
      } else {
        setReview(data.error || "File check karne me dikkat hui bhai!");
      }
    } catch (error) {
      console.error("File Upload Error:", error);
      setReview("Backend file server down hai shayad!");
    } finally {
      setLoading(false);
    }
  };

  // SCREEN 1: LOGIN SCREEN
  if (screen === 'login') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">🤖 AI Reviewer Login</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              placeholder="bhai@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input 
              type="password" 
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setScreen('dashboard')} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-bold transition duration-200"
          >
            Login 🚀
          </button>
          <p className="mt-4 text-center text-sm text-gray-400">
            Account nahi hai? <span className="text-blue-400 cursor-pointer hover:underline" onClick={() => setScreen('register')}>Register karo</span>
          </p>
        </div>
      </div>
    )
  }

  // SCREEN 2: REGISTER SCREEN
  if (screen === 'register') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-green-500">Create Account</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input type="text" className="w-full p-3 bg-gray-700 rounded border border-gray-600" placeholder="Apna Naam" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input type="email" className="w-full p-3 bg-gray-700 rounded border border-gray-600" placeholder="bhai@example.com" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" className="w-full p-3 bg-gray-700 rounded border border-gray-600" placeholder="••••••••" />
          </div>
          <button 
            onClick={() => setScreen('login')}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-bold transition duration-200"
          >
            Sign Up 🎉
          </button>
          <p className="mt-4 text-center text-sm text-gray-400">
            Pehle se account hai? <span className="text-green-400 cursor-pointer hover:underline" onClick={() => setScreen('login')}>Login karo</span>
          </p>
        </div>
      </div>
    )
  }

  // SCREEN 3: DASHBOARD SCREEN (WITH ADVANCED COLORED OUTPUT)
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">🤖 Smart AI Code Reviewer</h1>
        <button 
          onClick={() => { setScreen('login'); setCode(''); setReview(''); }} 
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-medium text-sm transition"
        >
          Logout 🚪
        </button>
      </nav>

      {/* Main Container Dashboard */}
      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Input Form */}
        <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-200">Apna Code Paste Karo:</h3>
            
            <label className="bg-gray-700 hover:bg-gray-600 text-sm text-blue-400 px-3 py-1.5 rounded cursor-pointer border border-gray-600 transition">
              <span>{selectedFile ? `📁 ${selectedFile.name}` : '📁 Upload File (.js, .py)'}</span>
              <input type="file" className="hidden" accept=".js,.py,.ts,.java" onChange={handleFileUpload} />
            </label>
          </div>

          <textarea
            className="flex-1 w-full p-4 bg-gray-950 font-mono text-sm text-green-400 rounded border border-gray-700 focus:outline-none focus:border-blue-500 resize-none min-h-[350px]"
            placeholder="// Bhai yahan apna code likho ya paste karo... e.g., function add(a, b) { return a + b }"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button
            onClick={handleReviewCode}
            disabled={loading}
            className={`mt-4 w-full p-4 rounded font-bold text-lg transition duration-200 ${
              loading ? 'bg-gray-600 cursor-not-allowed text-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? '🔄 AI Code Analyze Kar Raha Hai...' : '🔍 Review My Code 🚀'}
          </button>
        </div>

        {/* Right Side: AI Output Results with Beautiful Colors */}
        <div className="flex-1 p-4 bg-gray-950 rounded border border-gray-700 overflow-y-auto max-h-[500px]">
          {review ? (
            <div className="font-sans text-sm text-gray-300 space-y-4">
              {review.split("```").map((block, index) => {
                // 🟢 Case 1: AI Code Block (Odd index)
                if (index % 2 !== 0) {
                  const codeLines = block.trim().split("\n");
                  if (["javascript", "js", "python", "py", "html", "css", "json"].includes(codeLines[0].toLowerCase().trim())) {
                    codeLines.shift();
                  }
                  const pureCode = codeLines.join("\n");

                  return (
                    <div key={index} className="relative my-4 rounded-md overflow-hidden border border-emerald-800 bg-black shadow-lg">
                      <div className="bg-neutral-900 px-4 py-2 text-xs text-emerald-400 font-mono flex justify-between items-center border-b border-neutral-800">
                        <span className="flex items-center gap-1.5 font-bold">🟢 Sahi Aur Clean Code:</span>
                      </div>
                      <pre className="p-4 font-mono text-emerald-400 overflow-x-auto whitespace-pre text-left bg-zinc-950">
                        {pureCode}
                      </pre>
                    </div>
                  );
                }

                // 🔴/🟡 Case 2: Explanation Text Block (Even index)
                return (
                  <div key={index} className="space-y-2">
                    {block.split("\n").map((line, lIdx) => {
                      const cleanLine = line.trim();
                      if (!cleanLine) return null;

                      // 🔴 Critical Bugs/Errors Display
                      if (cleanLine.toLowerCase().includes("bug") || cleanLine.toLowerCase().includes("error") || cleanLine.toLowerCase().includes("mistake") || cleanLine.startsWith("!!") || cleanLine.toLowerCase().includes("critical")) {
                        return (
                          <p key={lIdx} className="p-3 bg-red-950/40 border border-red-900/60 rounded-md text-red-300 text-left pl-4 border-l-4 border-l-red-500 font-medium">
                            ❌ {cleanLine.replace(/^[*\s!-]+/g, "")}
                          </p>
                        );
                      }
                      
                      // 🟡 Optimization/Suggestions Display
                      if (cleanLine.toLowerCase().includes("optimize") || cleanLine.toLowerCase().includes("suggest") || cleanLine.toLowerCase().includes("better") || cleanLine.toLowerCase().includes("practice")) {
                        return (
                          <p key={lIdx} className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-md text-amber-200 text-left pl-4 border-l-4 border-l-amber-500">
                            💡 {cleanLine.replace(/^[*\s!-]+/g, "")}
                          </p>
                        );
                      }

                      // 🔵 Titles
                      if (cleanLine.startsWith("#") || cleanLine.endsWith(":")) {
                        return <h4 key={lIdx} className="text-blue-400 font-bold text-base pt-2 text-left">{cleanLine.replace(/^[#\s]+/g, "")}</h4>;
                      }

                      // Normal lines
                      return <p key={lIdx} className="text-left text-gray-300 pl-2 leading-relaxed">{cleanLine}</p>;
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 italic">
              {loading ? 'AI soch raha hai, thoda sabar karo bhai...' : 'Yahan AI ka review result dikhega!'}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default App

