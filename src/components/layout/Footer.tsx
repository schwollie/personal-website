export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; 2025 Lars. All rights reserved.</p>
        <div className="footer-links">
          <a href="mailto:larschristiansen664@gmail.com">
            <i className="fas fa-envelope" />
          </a>
          <a
            href="https://www.linkedin.com/in/lars-christiansen-67b8a3223"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-linkedin" />
          </a>
          <a
            href="https://github.com/schwollie/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-github" />
          </a>
        </div>
      </div>
    </footer>
  );
}
