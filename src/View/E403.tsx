import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';


const Home = () => {
    const { t } = useTranslation();
    return (
        <div>
            <h1 className="upper-main"
                style={{
                    backgroundColor: "#46443f"
                }}
            >
                {t("unauthorizedTitle")}
            </h1>
        </div>
    );
};

export default Home;
                   