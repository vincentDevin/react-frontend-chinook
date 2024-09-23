import api from './api';

// Common error handler
function errorHandler(err) {
    console.error('ERROR (in API):', err.message);
    if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
    }
    throw err;
}

// CRUD operations for various entities
const fetchAll = (entity) =>
    api
        .get(`/${entity}`)
        .then((resp) => resp.data)
        .catch(errorHandler);
const fetchById = (entity, id) =>
    api
        .get(`/${entity}/${id}`)
        .then((resp) => resp.data)
        .catch(errorHandler);
const insertEntity = (entity, data) =>
    api
        .post(`/${entity}`, data)
        .then((resp) => resp.data)
        .catch(errorHandler);
const updateEntity = (entity, data) =>
    api
        .put(`/${entity}/${data.id}`, data)
        .then((resp) => resp.data)
        .catch(errorHandler);
const deleteEntity = (entity, id) =>
    api
        .delete(`/${entity}/${id}`)
        .then((resp) => resp.data)
        .catch(errorHandler);

// Export functions for all entities
export const trackApi = {
    getAll: () => fetchAll('tracks'),
    getById: (id) => fetchById('tracks', id),
    insert: (track) => insertEntity('tracks', track),
    update: (track) => updateEntity('tracks', track),
    delete: (id) => deleteEntity('tracks', id),
};

export const artistApi = {
    getAll: () => fetchAll('artists'),
    getById: (id) => fetchById('artists', id),
    insert: (artist) => insertEntity('artists', artist),
    update: (artist) => updateEntity('artists', artist),
    delete: (id) => deleteEntity('artists', id),
};

export const albumApi = {
    getAll: () => fetchAll('albums'),
    getById: (id) => fetchById('albums', id),
    insert: (album) => insertEntity('albums', album),
    update: (album) => updateEntity('albums', album),
    delete: (id) => deleteEntity('albums', id),
};

export const genreApi = {
    getAll: () => fetchAll('genres'),
    getById: (id) => fetchById('genres', id),
    insert: (genre) => insertEntity('genres', genre),
    update: (genre) => updateEntity('genres', genre),
    delete: (id) => deleteEntity('genres', id),
};

export const mediaTypeApi = {
    getAll: () => fetchAll('media-types'),
    getById: (id) => fetchById('media-types', id),
    insert: (mediaType) => insertEntity('media-types', mediaType),
    update: (mediaType) => updateEntity('media-types', mediaType),
    delete: (id) => deleteEntity('media-types', id),
};
