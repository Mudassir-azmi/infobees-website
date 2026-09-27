import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useSearchParams } from "react-router";
import { useSection } from "../context/siteContent";
import { submitEnquiry } from "../lib/enquiries";
import { serviceSlug } from "../lib/slugify";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-text-dark placeholder:text-slate-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState("");

  // Dropdown options come from the services in the admin panel.
  const services = useSection("services").items;
  const serviceOptions = [...services.map((s) => s.title), "Other"];

  // "Enquire about this service" links here with ?service=<slug>.
  const [searchParams] = useSearchParams();
  const requestedSlug = searchParams.get("service");
  const requestedService = services.find((s) => serviceSlug(s) === requestedSlug)?.title;
  useEffect(() => {
    if (requestedService) setValue("service", requestedService);
  }, [requestedService, setValue]);

  // Saved in the database; the team reads them in Admin → Enquiries.
  const onSubmit = async (data) => {
    setStatus("sending");
    setErrorMessage("");
    try {
      await submitEnquiry(data);
      setStatus("success");
      reset();
    } catch (err) {
      // Validation / rate-limit messages from the server are shown as-is.
      setErrorMessage(err.status && err.status < 500 ? err.message : "");
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Honeypot: hidden from people, bots fill it in and get silently ignored. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-navy">
          Full Name *
        </label>
        <input
          id="name"
          type="text"
          className={inputClass}
          aria-invalid={errors.name ? "true" : "false"}
          {...register("name", { required: "Full name is required" })}
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy">
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          className={inputClass}
          aria-invalid={errors.email ? "true" : "false"}
          {...register("email", {
            required: "Email address is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-navy">
          Phone / WhatsApp *
        </label>
        <input
          id="phone"
          type="tel"
          className={inputClass}
          aria-invalid={errors.phone ? "true" : "false"}
          {...register("phone", { required: "Phone / WhatsApp number is required" })}
        />
        {errors.phone && (
          <p className="mt-1.5 text-xs text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-navy">
          Service *
        </label>
        <select
          id="service"
          defaultValue=""
          className={inputClass}
          aria-invalid={errors.service ? "true" : "false"}
          {...register("service", { required: "Please select a service" })}
        >
          <option value="" disabled>
            Select a service
          </option>
          {serviceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.service && (
          <p className="mt-1.5 text-xs text-red-600">{errors.service.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-navy">
          Message *
        </label>
        <textarea
          id="message"
          rows={4}
          className={inputClass}
          aria-invalid={errors.message ? "true" : "false"}
          {...register("message", { required: "Please tell us about your requirement" })}
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-red-600">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-navy px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Submitting..." : "Submit Inquiry"}
      </button>

      {status === "success" && (
        <div className="flex items-start gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-800">
          <FaCheckCircle className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>
            Thank you for contacting Infobees. Your inquiry has been submitted
            successfully. We will get back to you soon.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          <FaExclamationTriangle className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>
            {errorMessage ||
              "Something went wrong while submitting your inquiry. Please try again or contact us directly on WhatsApp/email."}
          </p>
        </div>
      )}
    </form>
  );
}

export default ContactForm;
