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

// Utility function to validate entity data based on entity type
const isValidEntity = (data, entity) => {
    switch (entity) {
        case 'artists':
            return data.ArtistId && data.ArtistId > 0;
        case 'albums':
            return data.AlbumId && data.AlbumId > 0;
        case 'tracks':
            return data.TrackId && data.TrackId > 0;
        // Add more cases as needed for other entities
        default:
            return false;
    }
};

// Function for fetching a random entity with entity-specific validation
const fetchRandom = (entity) =>
    api
        .get(`/${entity}/random`)
        .then((resp) => {
            const data = resp.data;
            if (!data || !isValidEntity(data, entity)) {
                throw new Error(`Invalid ${entity} data: ${JSON.stringify(data)}`);
            }
            return data;
        })
        .catch(errorHandler);

// CRUD operations for various entities
const fetchAll = (entity, params = {}) => // Added params argument for pagination support
    api
        .get(`/${entity}`, { params }) // Pass params as query parameters
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

// Export functions for all entities, with new methods for fetching random entities
export const trackApi = {
    getAll: (params) => fetchAll('tracks', params), // Accept params for pagination
    getById: (id) => fetchById('tracks', id),
    insert: (track) => insertEntity('tracks', track),
    update: (track) => updateEntity('tracks', track),
    delete: (id) => deleteEntity('tracks', id),
    getRandom: () => fetchRandom('tracks'), // Fetch a random track
};

export const artistApi = {
    getAll: (params) => fetchAll('artists', params), // Accept params for pagination
    getById: (id) => fetchById('artists', id),
    insert: (artist) => insertEntity('artists', artist),
    update: (artist) => updateEntity('artists', artist),
    delete: (id) => deleteEntity('artists', id),
    getRandom: () => fetchRandom('artists'), // Fetch a random artist
};

export const albumApi = {
    getAll: (params) => fetchAll('albums', params), // Accept params for pagination
    getById: (id) => fetchById('albums', id),
    insert: (album) => insertEntity('albums', album),
    update: (album) => updateEntity('albums', album),
    delete: (id) => deleteEntity('albums', id),
    getRandom: () => fetchRandom('albums'), // Fetch a random album
};

export const genreApi = {
    getAll: (params) => fetchAll('genres', params), // Accept params for pagination
    getById: (id) => fetchById('genres', id),
    insert: (genre) => insertEntity('genres', genre),
    update: (genre) => updateEntity('genres', genre),
    delete: (id) => deleteEntity('genres', id),
};

export const mediaTypeApi = {
    getAll: (params) => fetchAll('media-types', params), // Accept params for pagination
    getById: (id) => fetchById('media-types', id),
    insert: (mediaType) => insertEntity('media-types', mediaType),
    update: (mediaType) => updateEntity('media-types', mediaType),
    delete: (id) => deleteEntity('media-types', id),
};
