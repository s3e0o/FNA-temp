import React, { useState, useEffect } from "react";
import logoImage from "../assets/images/short-cfs-b.png";
import emailjs from "@emailjs/browser";

export default function AppointmentForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    mobile: "",
    email: "",
    date: "",
    time: "",
    feedback: "",
    consent: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Helper: get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing/editing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 🔍 Validate a single field (used on blur)
  const validateField = (name, value) => {
    let error = null;

    switch (name) {
      case "firstName":
        if (!value.trim()) error = "First name is required";
        else if (!/^[A-Za-z\s]{2,30}$/.test(value)) error = "Please enter a valid first name (2–30 letters)";
        break;
      case "lastName":
        if (!value.trim()) error = "Last name is required";
        else if (!/^[A-Za-z\s]{2,30}$/.test(value)) error = "Please enter a valid last name (2–30 letters)";
        break;
      case "age":
        if (!value) error = "Please select your age";
        break;
      case "mobile":
        if (!value.trim()) error = "Mobile number is required";
        else if (!/^[0-9\s\-\(\)]{11}$/.test(value)) error = "Please enter a valid mobile number (11 digits)";
        break;
      case "email":
        if (!value.trim()) error = "Email address is required";
        else if (!/^\S+@\S+\.\S+$/.test(value)) error = "Please enter a valid email address";
        break;
      case "date":
        if (!value) error = "Please select a preferred date";
        else if (value < today) error = "Date must be today or in the future";
        break;
      case "time":
        if (!value) {
          error = "Please select a preferred time";
        } else {
          const [hours, minutes] = value.split(':').map(Number);
          if (isNaN(hours) || isNaN(minutes)) {
            error = "Invalid time format";
          } else {
            const totalMinutes = hours * 60 + minutes;
            if (totalMinutes < 480 || totalMinutes > 1020) {
              error = "Please select a time between 8:00 AM and 5:00 PM";
            }
          }
        }
        break;
      case "consent":
        if (!value) error = "You must agree to allow us to process your information";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  // 🧪 Full form validation (used on submit)
  const validate = () => {
    const newErrors = {};

    // Reuse field logic by calling validateField for each
    let isValid = true;
    for (const [key, value] of Object.entries(formData)) {
      if (key !== "feedback") {
        // Skip optional feedback
        const fieldValid = validateField(key, value);
        if (!fieldValid) isValid = false;
      }
    }

    // Return overall validity
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const templateParams = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        age: formData.age,
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        date: formData.date,
        time: formData.time,
        feedback: formData.feedback?.trim() || "— No additional notes —",
        submissionDate: new Date().toLocaleString("en-PH", {
          timeZone: "Asia/Manila",
          dateStyle: "medium",
          timeStyle: "short",
        }),
      };

      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_npmog1q",  
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_wfc8bqf",
        templateParams,
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "ubgyer7dz2teNs5xc",  
        }
      );

      console.log("EmailJS SUCCESS!", response.status, response.text);
      setShowThankYou(true);
    } catch (err) {
      console.error("EmailJS failed:", err);
      let errorMsg = err.text || err.message || "Unknown error";

      if (errorMsg.includes("public key")) {
        errorMsg += "\n→ Double-check .env has VITE_EMAILJS_PUBLIC_KEY=ubgyer7dz2teNs5xc (restart dev server!)";
      } else if (errorMsg.includes("412") || errorMsg.includes("scopes") || errorMsg.includes("Gmail_API")) {
        errorMsg += "\n→ Gmail permission issue: In EmailJS dashboard > Email Services > your Gmail > Disconnect > Reconnect, and approve 'Send email on your behalf' permission.";
      }

      alert(`Failed to send: ${errorMsg}\nOpen DevTools (F12) > Console for more info.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    document.title = "Schedule Your Consultation | Financial Needs Analysis";
  }, []);
  
    const ThankYouScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] flex flex-col">
      {/* Main Content - Centered Modal */}
        <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 md:p-10 border border-gray-200 relative">
            {/* Close Button */}
            <button
            onClick={() => setShowThankYou(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xxl cursor-pointer"
            >
            ×
            </button>

            {/* Content Container */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-6 md:p-8">
            {/* Logo Section */}
            <div className="flex items-center justify-center md:justify-start">
                <img
                    src={logoImage}
                    alt="Caelum Financial Solutions"
                    className="h-50 md:h-80 w-auto object-contain"
                />
            </div>

            {/* Text + Buttons Section */}
            <div className="flex flex-col items-center mt-15 md:items-start text-center md:text-left space-y-6">
                <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#2d5aae] leading-tight">
                    Thank you for scheduling your appointment with us!
                </h2>
                <p className="text-lg text-[#2d5aae] mt-2 leading-relaxed">
                    We look forward to providing you with the best possible service.
                </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 md-3 justify-center md:justify-start w-full">
                <button
                    onClick={() => window.location.href = "/FNA/OurServices"}
                    className="bg-[#2d5aae] hover:bg-white text-white hover:text-[#2d5aae] border-2 font-semibold px-6 py-3 rounded-lg transition w-full sm:w-auto cursor-pointer"
                >
                    Back to Our Services
                </button>
                <button
                    onClick={() => window.location.href = "/FNA/Yes"}
                    className="bg-[#2d5aae] hover:bg-white text-white hover:text-[#2d5aae] border-2 font-semibold px-6 py-3 rounded-lg transition w-full sm:w-auto cursor-pointer"
                >
                    Choose Another Door
                </button>
                </div>
            </div>
            </div>
        </div>
        </main>
    </div>
  );

  // 📝 Render Form View by default
  if (showThankYou) {
    return <ThankYouScreen />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] flex flex-col">
      {/* Top Header Bar – Insurance Branding */}
      <header className="h-20 bg-[#0a2e5c] flex items-center px-6 shadow-md">
        <div className="text-white font-bold text-xl">Caelum Financial Solutions</div>
      </header>

      {/* Main Form Section */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 md:p-10 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0a2e5c]">Schedule Your Appointment</h1>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Complete the form below to book an appointment with our licensed insurance advisor.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={(e) => validateField("firstName", e.target.value)}
                  placeholder="Enter first name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3a5a99] focus:border-transparent outline-none transition ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={(e) => validateField("lastName", e.target.value)}
                  placeholder="Enter last name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3a5a99] focus:border-transparent outline-none transition ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>

              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age <span className="text-red-500">*</span>
                </label>
                <select
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  onBlur={(e) => validateField("age", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3a5a99] focus:border-transparent outline-none transition ${
                    errors.age ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select age</option>
                  {[...Array(83)].map((_, i) => (
                    <option key={i} value={i + 18}>
                      {i + 18}
                    </option>
                  ))}
                </select>
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
              </div>

              {/* Mobile */}
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  onBlur={(e) => validateField("mobile", e.target.value)}
                  placeholder="e.g., 0927 123 4567"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3a5a99] focus:border-transparent outline-none transition ${
                    errors.mobile ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={(e) => validateField("email", e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3a5a99] focus:border-transparent outline-none transition ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  onBlur={(e) => validateField("date", e.target.value)}
                  min={today}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3a5a99] focus:border-transparent outline-none transition ${
                    errors.date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>

              {/* Time */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time <span className="text-red-500">*</span>
                </label>
                <input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  onBlur={(e) => validateField("time", e.target.value)}
                  min="08:00"
                  max="17:00"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3a5a99] focus:border-transparent outline-none transition ${
                    errors.time ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
              </div>

              {/* Working Hours Info */}
              <div className="lg:col-span-2 flex items-center bg-blue-50 rounded-lg p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#0a2e5c] mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-[#0a2e5c]">
                  <span className="font-medium">Office Hours:</span> Monday–Friday, 8:00 AM – 5:00 PM
                </span>
              </div>

              {/* Feedback */}
              <div className="lg:col-span-3">
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="feedback"
                  name="feedback"
                  rows="3"
                  value={formData.feedback}
                  onChange={handleChange}
                  placeholder="Let us know how we can assist you..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3a5a99] focus:border-transparent outline-none transition resize-none"
                ></textarea>
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="mt-6 flex items-start gap-3">
              <input
                type="checkbox"
                id="consent"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                onBlur={() => validateField("consent", formData.consent)}
                className="mt-1 h-5 w-5 text-[#3a5a99] rounded focus:ring-[#3a5a99] border-gray-300 cursor-pointer"
              />
              <label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                I understand that personal information will be needed to complete my Financial Needs Analysis. I authorize Caelum Financial Solution to use and process my personal information, including contacting me regarding insurance and related services.
              </label>
            </div>
            {errors.consent && <p className="text-red-500 text-xs mt-1 ml-8">{errors.consent}</p>}

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${
                  isSubmitting ? "bg-gray-400" : "bg-[#0a2e5c] hover:bg-[#0d3a75]"
                } text-white font-semibold px-8 py-3.5 rounded-lg text-base shadow-md transition duration-200 w-full max-w-xs cursor-pointer`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}