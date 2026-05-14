import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-contnet">
          <div className="footer-text">
            <p>이용약관</p>
            <span>|</span>
            <p>개인정보처리방침</p>
            <span>|</span>
            <p>코드붐바정책</p>
            <span>|</span>
            <p>고객센터</p>
          </div>
          <p className="footer-copy">© 2026 Tsarbomba All rights reserved</p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
