import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-contnet">
          <div className="footer-text">
            <span>이용약관</span>
            <span>|</span>
            <span>개인정보처리방침</span>
            <span>|</span>
            <span>코드붐바정책</span>
            <span>|</span>
            <span>고객센터</span>
          </div>
          <p className="footer-copy">© 2026 Tsarbomba All rights reserved</p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
