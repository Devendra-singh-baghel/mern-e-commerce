import React from 'react';
import "./Footer.css"
import { Phone, Mail, GitHub, LinkedIn, Instagram, YouTube } from "@mui/icons-material"


function Footer() {
  return (
    <footer className='footer'>
      <div className="footer_container">
        {/* section-1 */}
        <div className="footer_section contact">
          <h3 className='text'>Contact Us</h3>
          <p><Phone /> Phone: +919630840725</p>
          <p><Mail /> Email: devendrabaghel0220@gmail.com</p>
        </div>

        {/* section-2 */}
        <div className="footer_section social">
          <h3>Follow me</h3>
          <div className="social_links">
            <a href="" target='_blank'>
              <GitHub className='social_icon' />
            </a>
            <a href="" target='_blank'>
              <LinkedIn className='social_icon' />
            </a>
            <a href="" target='_blank'>
              <YouTube className='social_icon' />
            </a>
            <a href="" target='_blank'>
              <Instagram className='social_icon' />
            </a>
          </div>
        </div>

        {/* section-3 */}
        <div className="footer_section about">
          <h3>About</h3>
          <p>Providing web development tutorials and coutses to help you grow you skills</p>
        </div>
      </div>

      <div className="footer_bottom">
        <p>&copy; 2026 devendrabaghel0220 . All rights reserved</p>
      </div>
    </footer>
  )
}

export default Footer
