import React from 'react';
const Footer = () => {
  return (
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
      <div className="col-md-4 d-flex align-items-center">
        <span className="text-muted">© 2022 Ruben Mulato </span>
      </div>
      <iframe
        src="https://ghbtns.com/github-btn.html?user=Viper5niper"
        frameBorder="0"
        scrolling="0"
        width="160px"
        height="30px"
      ></iframe>
    </footer>
  );
};

export default Footer;