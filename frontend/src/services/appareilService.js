// src/services/appareilService.js
import api from './api';

export const appareilService = {
  async getAll() {
    const response = await api.get('/appareils');
    return response.data;
  },

  async scanner() {
    const response = await api.get('/appareils/scanner');
    return response.data;
  },

  async activer(id, offreData = {}) {
    const response = await api.put(`/appareils/${id}/activer`, offreData);
    return response.data;
  },

  async bloquer(id) {
    const response = await api.put(`/appareils/${id}/bloquer`);
    return response.data;
  },

  async mettreEnAttente(id) {
    const response = await api.put(`/appareils/${id}/attente`);
    return response.data;
  },

  async getStatistiques() {
    const response = await api.get('/appareils/statistiques');
    return response.data;
  },
};