import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div className="left">
                COPYRIGHT &#169; All rights reserved.
            </div>
            <div className="right">
                <nav>
                    <ul className="navi-right gap-3">
                        <li><a href="index.php?page=contact">Top page</a></li>
                        <li><a href="index.php?page=contact">Login/Signup</a></li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
