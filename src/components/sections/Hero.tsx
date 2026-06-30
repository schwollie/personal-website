import Image from "next/image";

export default function Hero() {
  return (
    <header className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="profile-container">
            <div className="profile-image-wrapper">
              <div className="profile-ring" />
              <Image
                src="/images/profile/profile-picture.jpeg"
                alt="Lars"
                className="profile-image"
                width={500}
                height={500}
                priority
              />
            </div>
            <div className="hero-text">
              <h1 className="hero-title">Hi, I&apos;m Lars</h1>
              <h2 className="hero-subtitle">
                Computer Science Student, Developer & Musician
              </h2>
              <p className="hero-description">
                Currently pursuing a Master&apos;s degree in Computer Science at
                TUM and working as a developer at Vector Informatik. In my
                personal and university projects I focus on AI, mixed reality
                and software engeneering. In addition I am a dedicated musician,
                performing as a singer, songwriter, and guitarist for the band
                LYMINA.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">Student</div>
                  <div className="stat-label">M.Sc. Inf. (TUM)</div>
                </div>
                <div className="stat">
                  <div className="stat-number">Musician</div>
                  <div className="stat-label">Singer/Guitarist LYMINA</div>
                </div>
                <div className="stat">
                  <div className="stat-number">Working Student</div>
                  <div className="stat-label">Vector Informatik</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
