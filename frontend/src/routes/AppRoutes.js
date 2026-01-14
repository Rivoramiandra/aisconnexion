import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import TableauDeBordPage from '../pages/TableauDeBordPage';
import AccesInternetPage from '../pages/AccesInternetPage';
import AnalytiquePage from '../pages/AnalytiquePage';
import TarifsPage from '../pages/TarifsPage';
import AppareilsPage from '../pages/AppareilsPage';
import FinancesEnCoursPage from '../pages/FinancesEnCoursPage';
import FinancesPayePage from '../pages/FinancesPayePage';
import HistoriquePage from '../pages/HistoriquePage';
import AidePage from '../pages/AidePage';
import ParametresPage from '../pages/ParametresPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Routes protégées du dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<TableauDeBordPage />} />
                <Route path="analytique" element={<AnalytiquePage />} />
                <Route path="acces-internet" element={<AccesInternetPage />} />
                <Route path="tarifs" element={<TarifsPage />} />
                <Route path="appareils" element={<AppareilsPage />} />
                
                {/* Sous-routes Finances */}
                <Route path="finances">
                    <Route path="en-cours" element={<FinancesEnCoursPage />} />
                    <Route path="paye" element={<FinancesPayePage />} />
                </Route>
                
                {/* Autres routes */}
                <Route path="historique" element={<HistoriquePage />} />
                <Route path="aide" element={<AidePage />} />
                <Route path="parametres" element={<ParametresPage />} />
                
                {/* Route 404 pour le dashboard */}
                <Route path="*" element={<div>Page non trouvée (Dashboard)</div>} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;