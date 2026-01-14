import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

// Importez TOUS les composants avec des noms différents
import TableauDeBord from './pages/TableauDeBordPage';
import AccesInternet from './pages/AccesInternetPage';
import Analytique from './pages/AnalytiquePage';
import Tarifs from './pages/TarifsPage';
import Appareils from './pages/AppareilsPage';
import FinancesEnCours from './pages/FinancesEnCoursPage';
import FinancesPaye from './pages/FinancesPayePage';
import Historique from './pages/HistoriquePage';
import Aide from './pages/AidePage';
import Parametres from './pages/ParametresPage';

const DashboardRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                <Route index element={<TableauDeBord />} />
                <Route path="analytique" element={<Analytique />} />
                <Route path="acces-internet" element={<AccesInternet />} />
                <Route path="tarifs" element={<Tarifs />} />
                <Route path="appareils" element={<Appareils />} />
                
                <Route path="finances">
                    <Route path="en-cours" element={<FinancesEnCours />} />
                    <Route path="paye" element={<FinancesPaye />} />
                </Route>
                
                <Route path="historique" element={<Historique />} />
                <Route path="aide" element={<Aide />} />
                <Route path="parametres" element={<Parametres />} />
            </Route>
        </Routes>
    );
};

export default DashboardRoutes;