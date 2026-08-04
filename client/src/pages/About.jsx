import "../styles/About.css";

function About() {
  const steps = [
    {
      number: "01",
      title: "Report",
      description:
        "Lost or found something on campus? File a report with photos and details in under a minute.",
    },
    {
      number: "02",
      title: "Review",
      description:
        "Moderators verify each submission to keep the platform trustworthy and reduce false claims.",
    },
    {
      number: "03",
      title: "Match",
      description:
        "Browse listings, filter by category or location, and submit an ownership claim when you spot your item.",
    },
    {
      number: "04",
      title: "Recover",
      description:
        "Once approved, connect with the finder and get your belonging back — safely and securely.",
    },
  ];

  const team = [
    { id: "17471", name: "D G M B Gunasekara", role: "Authentication & Admin" },
    { id: "17488", name: "G G M S Kandewatta", role: "Administrator Dashboard" },
    { id: "17500", name: "W A M Nuwanga", role: "Moderator Dashboard" },
    { id: "17540", name: "A H M K Y B Wijekoon", role: "Lost & Found Management" },
  ];

  return (
    <div className="about">
      {/* --- Hero section --- */}
      <section className="about-hero">
        <span className="about-hero__eyebrow">About UniFind</span>
        <h1 className="about-hero__title">
          Helping students recover
          <br />
          what matters most.
        </h1>
        <p className="about-hero__subtitle">
          UniFind is a centralized lost &amp; found platform built for the University of Colombo.
          We believe recovering a lost ID card, textbook, or water bottle shouldn't depend on
          luck or scattered social media posts.
        </p>
      </section>

      {/* --- Mission --- */}
      <section className="about-section">
        <div className="about-section__inner">
          <h2 className="about-section__title">Why we built this</h2>
          <p className="about-section__text">
            Every semester, students lose valuable items across campus — from student ID cards
            and calculators to phones and laptops. Until now, recovery relied on Facebook posts,
            notice boards, or word of mouth. That's slow, inconsistent, and often unsuccessful.
          </p>
          <p className="about-section__text">
            UniFind brings everything into one trusted, moderated place. Report an item in a
            minute. Search filtered listings. Claim ownership with proof. Get your things back.
          </p>
        </div>
      </section>

      {/* --- How it works --- */}
      <section className="about-section about-section--alt">
        <div className="about-section__inner">
          <h2 className="about-section__title">How it works</h2>
          <div className="about-steps">
            {steps.map((step) => (
              <div key={step.number} className="about-step">
                <span className="about-step__number">{step.number}</span>
                <h3 className="about-step__title">{step.title}</h3>
                <p className="about-step__text">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Values --- */}
      <section className="about-section">
        <div className="about-section__inner">
          <h2 className="about-section__title">What we stand for</h2>
          <div className="about-values">
            <div className="about-value">
              <span className="about-value__icon">🔒</span>
              <h3 className="about-value__title">Verified &amp; safe</h3>
              <p className="about-value__text">
                Every report is reviewed by trained moderators before it goes public. No spam, no scams.
              </p>
            </div>
            <div className="about-value">
              <span className="about-value__icon">⚡</span>
              <h3 className="about-value__title">Fast recovery</h3>
              <p className="about-value__text">
                Search, filter, and claim in minutes — not days of scrolling through group chats.
              </p>
            </div>
            <div className="about-value">
              <span className="about-value__icon">🎓</span>
              <h3 className="about-value__title">Built for UoC</h3>
              <p className="about-value__text">
                Designed around the actual campus locations, categories, and habits of Colombo students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Team --- */}
      <section className="about-section about-section--alt">
        <div className="about-section__inner">
          <h2 className="about-section__title">The team</h2>
          <p className="about-section__text">
            UniFind is a semester project by four undergraduates at the Faculty of Science,
            University of Colombo.
          </p>
          <div className="about-team">
            {team.map((member) => (
              <div key={member.id} className="about-member">
                <span className="about-member__id">{member.id}</span>
                <h3 className="about-member__name">{member.name}</h3>
                <p className="about-member__role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;