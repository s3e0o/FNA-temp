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
    purpose: "",
    meetingSetup: "", // Added meeting setup state
    feedback: "",
    consent: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "purpose" && value !== "Others") {
        newData.otherPurpose = "";
      }

      return newData;
    });

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateField = (name, value) => {
    let error = null;

    switch (name) {
      case "firstName":
        if (!value.trim()) error = "First name is required";
        else if (!/^[A-Za-z\s]{2,30}$/.test(value))
          error = "First name: 2–30 letters only";
        break;

      case "lastName":
        if (!value.trim()) error = "Last name is required";
        else if (!/^[A-Za-z\s]{2,30}$/.test(value))
          error = "Last name: 2–30 letters only";
        break;

      case "age":
        if (!value) error = "Age is required";
        break;

      case "mobile":
        if (!value.trim()) error = "Mobile number is required";
        else if (!/^[0-9\s\-\(\)]{10,15}$/.test(value.replace(/\s/g, "")))
          error = "Enter a valid mobile number (10–15 digits)";
        break;

      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email format";
        break;

      case "date":
        if (!value) error = "Preferred date is required";
        else if (value < today) error = "Date must be today or future";
        break;

      case "time":
        if (!value) {
          error = "Preferred time is required";
        } else {
          const [h, m] = value.split(":").map(Number);
          if (isNaN(h) || isNaN(m) || h < 8 || h > 17 || (h === 17 && m > 0))
            error = "Time must be between 8:00 AM – 5:00 PM";
        }
        break;

      case "purpose":
        if (!value) error = "Please select the purpose of your appointment";
        break;

      case "meetingSetup": // Validation for meeting setup
        if (!value) error = "Please select your preferred meeting setup";
        break;

      case "consent":
        if (!value) error = "You must agree to the data processing consent";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  const validateForm = () => {
    let isValid = true;
    const requiredFields = [
      "firstName",
      "lastName",
      "age",
      "mobile",
      "email",
      "date",
      "time",
      "purpose",
      "meetingSetup", // Included in validation
      "consent",
    ];

    requiredFields.forEach((field) => {
      if (!validateField(field, formData[field])) isValid = false;
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
        purpose: formData.purpose,
        meetingSetup: formData.meetingSetup, // Send to EmailJS
        feedback: formData.feedback.trim() || "— No additional notes —",
        submissionDate: new Date().toLocaleString("en-PH", {
          timeZone: "Asia/Manila",
          dateStyle: "medium",
          timeStyle: "short",
        }),
        _charset: "UTF-8",
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_npmog1q",
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_wfc8bqf",
        templateParams,
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "ubgyer7dz2teNs5xc" }
      );

      setShowThankYou(true);
    } catch (err) {
      console.error("EmailJS error:", err);
      alert(`Failed to send email.\n${err.text || err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    document.title = "Set an Appoitment | Financial Needs Analysis";
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

  if (showThankYou) return <ThankYouScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 md:p-10 border border-gray-200">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0a2e5c]">
              Schedule Your Appointment
            </h1>
            <p className="mt-3 text-gray-600">
              Book a consultation with our licensed financial advisor
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-600">*</span>
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={() => validateField("firstName", formData.firstName)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a2e5c] ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-600">*</span>
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={() => validateField("lastName", formData.lastName)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a2e5c] ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a2e5c] ${
                    errors.age ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter age"
                />
                {errors.age && <p className="text-red-600 text-xs mt-1">{errors.age}</p>}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number <span className="text-red-600">*</span>
                </label>
                <input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a2e5c] ${
                    errors.mobile ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g. 09123456789"
                />
                {errors.mobile && <p className="text-red-600 text-xs mt-1">{errors.mobile}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a2e5c] ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="email@example.com"
                />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  min={today}
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a2e5c] ${
                    errors.date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.date && <p className="text-red-600 text-xs mt-1">{errors.date}</p>}
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time (8AM-5PM) <span className="text-red-600">*</span>
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a2e5c] ${
                    errors.time ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.time && <p className="text-red-600 text-xs mt-1">{errors.time}</p>}
              </div>

              {/* Preferred Meeting Setup - NEW SECTION */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Meeting Setup <span className="text-red-600">*</span>
                </label>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="meetingSetup"
                      value="Face to Face"
                      checked={formData.meetingSetup === "Face to Face"}
                      onChange={handleChange}
                      className="w-5 h-5 text-[#0a2e5c] border-gray-300 focus:ring-[#0a2e5c]"
                    />
                    <span className="text-gray-700 group-hover:text-[#0a2e5c] transition-colors">Face to Face</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="meetingSetup"
                      value="Online"
                      checked={formData.meetingSetup === "Online"}
                      onChange={handleChange}
                      className="w-5 h-5 text-[#0a2e5c] border-gray-300 focus:ring-[#0a2e5c]"
                    />
                    <span className="text-gray-700 group-hover:text-[#0a2e5c] transition-colors">Online (Zoom/Google Meet)</span>
                  </label>
                </div>
                {errors.meetingSetup && <p className="text-red-600 text-xs mt-2">{errors.meetingSetup}</p>}
              </div>
            </div>

            {/* Purpose */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Purpose of Appointment <span className="text-red-600">*</span>
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a2e5c] ${
                  errors.purpose ? "border-red-500" : "border-gray-300"
                }`}
              >
                 <option value="">Select purpose</option>
                  <option value="Financial Advisor Program">Financial Advisor Program</option>
                  <option value="Management Tainee Program">Management Trainee Program</option>
                  <option value="Internship Program">Internship Program</option>
                  <option value="Managing Partner">Managing Partner</option>
                </select>
                {errors.purpose && (
                  <p className="text-red-600 text-xs mt-1">{errors.purpose}</p>
                )}
              </div>

            {/* Feedback/Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a2e5c]"
                placeholder="Anything else we should know?"
              ></textarea>
            </div>

            {/* Consent */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="consent"
                id="consent"
                checked={formData.consent}
                onChange={handleChange}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-[#0a2e5c] focus:ring-[#0a2e5c]"
              />
              <label htmlFor="consent" className="text-sm text-gray-600 leading-relaxed">
                I agree to the collection and processing of my personal data for the purpose of scheduling this appointment. <span className="text-red-600">*</span>
              </label>
            </div>
            {errors.consent && <p className="text-red-600 text-xs">{errors.consent}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0a2e5c] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#08244a] transition-all transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isSubmitting ? "Processing..." : "Schedule Appointment"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}