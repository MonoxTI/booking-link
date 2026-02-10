import { useState } from "react";

export default function Bookings() {
  const initialFormState = {
    fullName: "",
    email: "",
    phoneNumber: "",
    chapters: "", // Will store combined value like "Maths Paper 1 - Algebra"
  };

  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(""); // Tracks selected paper
  const [selectedChapter, setSelectedChapter] = useState(""); // Tracks selected chapter

  // Chapter options mapped to each paper
  const chapterOptions = {
    "Maths Paper 1": ["Algebra","Series and sequences","Financial maths","Functions and graphs", "Probability"],
    "Maths Paper 2": ["Trigonometry", "Eucldean geomerty", "Analytical geometry","Statistic and regression"],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle paper selection
  const handlePaperChange = (e) => {
    const paper = e.target.value;
    setSelectedPaper(paper);
    setSelectedChapter(""); // Reset chapter selection
    // Clear chapters field until chapter is selected
    setForm((prev) => ({ ...prev, chapters: "" }));
  };

  // Handle chapter selection
  const handleChapterChange = (e) => {
    const chapter = e.target.value;
    setSelectedChapter(chapter);
    // Combine paper and chapter for backend
    setForm((prev) => ({
      ...prev,
      chapters: `${selectedPaper} - ${chapter}`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Final validation for chapters field
    if (!form.chapters.trim()) {
      setMessage({ type: "error", text: "Please select both Paper and Chapter" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.message || "Booking failed" });
        return;
      }

      setMessage({ type: "success", text: "Appointment booked successfully ✅" });
      // Reset all form states including dropdowns
      setForm(initialFormState);
      setSelectedPaper("");
      setSelectedChapter("");
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Server error. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 pt-12 pb-8">
      <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Book an Appointment
        </h1>

        {message && (
          <div
            className={`mb-4 text-sm text-center px-4 py-2 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Standard form fields */}
          {[
            { label: "Full Name", name: "fullName", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone Number", name: "phoneNumber", type: "tel" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            </div>
          ))}

          {/* Paper Selection Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Paper
            </label>
            <select
              value={selectedPaper}
              onChange={handlePaperChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
            >
              <option value="">Choose Maths Paper</option>
              <option value="Maths Paper 1">Maths Paper 1</option>
              <option value="Maths Paper 2">Maths Paper 2</option>
            </select>
          </div>

          {/* Chapter Selection Dropdown (conditionally rendered) */}
          {selectedPaper && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Chapter
              </label>
              <select
                value={selectedChapter}
                onChange={handleChapterChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
              >
                <option value="">Choose Chapter</option>
                {chapterOptions[selectedPaper]?.map((chapter) => (
                  <option key={chapter} value={chapter}>
                    {chapter}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-900 hover:bg-blue-800"
            }`}
          >
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}