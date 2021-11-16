import React from 'react'
import { Link } from 'react-router-dom';

const AppBrand = () => {
  return (
    <>
      <div className="nav-header">
        <Link to="/" className="brand-logo">
          <img className="logo-abbr" src="/images/logo.png" alt="logo" />
          <img className="logo-compact" src="/images/logo-text.png" alt="logo" />
          <img className="brand-title" src="/images/logo-text.png" alt="logo" />
        </Link>

        <div className="nav-control">
          <div className="hamburger">
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
        </div>
      </div>
    </>
  )
}

export default AppBrand
