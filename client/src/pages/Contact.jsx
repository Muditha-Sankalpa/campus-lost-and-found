import { useState } from "react";
import "../styles/Contact.css";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend endpoint yet — just simulate success for now
    setStatus({
      type: "success",
      message: "Thanks! We've received your message and will get back to you soon.",
    });
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setStatus({ type: "", message: "" }), 5000);
  };

  return (
    <div className="contact">
      {/* --- Hero --- */}
      <section className="contact-hero">
        <span className="contact-hero__eyebrow">Get in touch</span>
        <h1 className="contact-hero__title">We'd love to hear from you</h1>
        <p className="contact-hero__subtitle">
          Have a question, suggestion, or issue with the platform? Reach out — we usually reply within a day.
        </p>
      </section>

      {/* --- Main content: form + info --- */}
      <section className="contact-body">
        <div className="contact-body__inner">
          {/* Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2 className="contact-form__title">Send us a message</h2>

            {status.message && (
              <div className={`contact-status contact-status--${status.type}`}>
                {status.message}
              </div>
            )}

            <div className="contact-form__row">
              <div className="contact-form__group">
                <label htmlFor="name">Your name</label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Kamal Perera"
                  required
                />
              </div>

              <div className="contact-form__group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@stu.cmb.ac.lk"
                  required
                />
              </div>
            </div>

            <div className="contact-form__group">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="What's this about?"
                required
              />
            </div>

            <div className="contact-form__group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us more..."
                rows={6}
                required
              />
            </div>

            <button type="submit" className="contact-form__submit">
              Send Message
            </button>
          </form>

          {/* Info cards */}
          <aside className="contact-info">
            <div className="contact-info__card">
              <span className="contact-info__icon">📍</span>
              <h3 className="contact-info__title">Visit us</h3>
              <p className="contact-info__text">
                Faculty of Science
                <br />
                University of Colombo
                <br />
                Cumaratunga Munidasa Mawatha
                <br />
                Colombo 03, Sri Lanka
              </p>
            </div>

            <div className="contact-info__card">
              <span className="contact-info__icon">📧</span>
              <h3 className="contact-info__title">Email us</h3>
              <p className="contact-info__text">
                <a href="mailto:unifind@stu.cmb.ac.lk" className="contact-info__link">
                  unifind@stu.cmb.ac.lk
                </a>
                <br />
                <span className="contact-info__note">General enquiries &amp; support</span>
              </p>
            </div>

            <div className="contact-info__card">
              <span className="contact-info__icon">⏰</span>
              <h3 className="contact-info__title">Response time</h3>
              <p className="contact-info__text">
                Weekdays: within 24 hours
                <br />
                Weekends: within 48 hours
              </p>
            </div>

            <div className="contact-info__card contact-info__card--highlight">
              <span className="contact-info__icon">🛡</span>
              <h3 className="contact-info__title">Report abuse</h3>
              <p className="contact-info__text">
                Spotted a fake report or suspicious behaviour? Contact a moderator directly through the platform,
                or email us with details.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* --- FAQ preview --- */}
      <section className="contact-faq">
        <div className="contact-faq__inner">
          <h2 className="contact-faq__title">Common questions</h2>
          <div className="contact-faq__list">
            <details className="contact-faq__item">
              <summary>How long do reports stay active?</summary>
              <p>
                Approved reports remain searchable for 30 days by default. After that, they're archived
                but can be reactivated if the item is still lost.
              </p>
            </details>
            <details className="contact-faq__item">
              <summary>What if my claim is rejected?</summary>
              <p>
                You can submit additional proof and resubmit the claim once. If it's still rejected,
                a moderator will explain why so you know how to proceed.
              </p>
            </details>
            <details className="contact-faq__item">
              <summary>Is UniFind only for the Faculty of Science?</summary>
              <p>
                For now, yes — it's a semester project piloted at Faculty of Science. If it goes well,
                we hope other faculties can adopt it too.
              </p>
            </details>
            <details className="contact-faq__item">
              <summary>Can outsiders report or claim items?</summary>
              <p>
                No. Only registered UoC students with a valid Student ID can create reports or submit claims.
                This keeps the platform trusted.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;