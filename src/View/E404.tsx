import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { t } from "../translation/i18n";


const Home = () => {
    return (
        <div>
            <h1 className="upper-main"
                style={{
                    backgroundColor: "#46443f"
                }}
            >
                {t("pageNotFoundTitle")}
            </h1>
        </div>
    );
};

export default Home;
                   