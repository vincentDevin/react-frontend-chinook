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

// Authentication-related API methods
export const authApi = {
    login: (credentials) =>
        api.post('/auth/login', credentials).then((resp) => resp.data).catch(errorHandler),

    register: (newUser) =>
        api.post('/auth/register', newUser).then((resp) => resp.data).catch(errorHandler),
};

// Generic CRUD operations for various entities
const fetchAll = (entity, params = {}) =>
    api.get(`/${entity}`, { params }).then((resp) => resp.data).catch(errorHandler);

const fetchById = (entity, id) =>
    api.get(`/${entity}/${id}`).then((resp) => resp.data).catch(errorHandler);

const insertEntity = (entity, data) =>
    api.post(`/${entity}`, data).then((resp) => resp.data).catch(errorHandler);

const updateEntity = (entity, data, idField) =>
    api.put(`/${entity}/${data[idField]}`, data).then((resp) => resp.data).catch(errorHandler);

const deleteEntity = (entity, id) =>
    api.delete(`/${entity}/${id}`).then((resp) => resp.data).catch(errorHandler);

// Album API with proper AlbumId management
export const albumApi = {
    getAll: (params) => fetchAll('albums', params),
    getById: (id) => fetchById('albums', id),
    insert: (album) => api.post(`/albums`, album).then((resp) => resp.data).catch(errorHandler),
    update: (album) => api.put(`/albums/${album.AlbumId}`, album).then((resp) => resp.data).catch(errorHandler),
    delete: (id) => deleteEntity('albums', id),

    // Fetch all albums by artist
    getAllByArtistId: (artistId) => api.get(`/albums/byArtist/${artistId}`).then((resp) => resp.data).catch(errorHandler),
};


// Artist API
export const artistApi = {
    getAll: (params) => fetchAll('artists', params),
    getById: (id) => fetchById('artists', id),
    insert: (artist) => insertEntity('artists', artist),
    update: (artist) => updateEntity('artists', artist, 'ArtistId'), // Ensure 'ArtistId' is used here
    delete: (id) => deleteEntity('artists', id),
};

// Media Type API
export const mediaTypeApi = {
    getAll: (params) => fetchAll('media-types', params),
    getById: (id) => fetchById('media-types', id),
    insert: (mediaType) => insertEntity('media-types', mediaType),
    update: (mediaType) => updateEntity('media-types', mediaType, 'MediaTypeId'), // Ensure 'MediaTypeId' is used here
    delete: (id) => deleteEntity('media-types', id),
};

// Genre API
export const genreApi = {
    getAll: (params) => fetchAll('genres', params),
    getById: (id) => fetchById('genres', id),
    insert: (genre) => insertEntity('genres', genre),
    update: (genre) => updateEntity('genres', genre, 'GenreId'), // Ensure 'GenreId' is used here
    delete: (id) => deleteEntity('genres', id),
};

// Track API
export const trackApi = {
    getAll: (params) => fetchAll('tracks', params),
    getById: (id) => fetchById('tracks', id),
    insert: (track) => insertEntity('tracks', track),
    update: (track) => updateEntity('tracks', track, 'TrackId'), // Ensure 'TrackId' is used here
    delete: (id) => deleteEntity('tracks', id),

    // Fetch all tracks by genre with pagination
    getAllByGenreId: (genreId, limit = 10, offset = 0) =>
        api.get(`/genres/${genreId}/tracks`, { params: { limit, offset } })
            .then((resp) => resp.data)
            .catch(errorHandler),
};


// User API
export const userApi = {
    getAll: (params) => fetchAll('users', params),
    getById: (id) => fetchById('users', id),
    insert: (user) => insertEntity('users', user),
    update: (user) => updateEntity('users', user, 'UserId'), // Ensure 'UserId' is used here
    delete: (id) => deleteEntity('users', id),
};

// User Role API
export const userRoleApi = {
    getAll: (params) => fetchAll('user-roles', params),
    getById: (id) => fetchById('user-roles', id),
    insert: (userRole) => insertEntity('user-roles', userRole),
    update: (userRole) => updateEntity('user-roles', userRole, 'UserRoleId'), // Ensure 'UserRoleId' is used here
    delete: (id) => deleteEntity('user-roles', id),
};

// Playlist API
export const playlistApi = {
    getAll: (params) => fetchAll('playlists', params),
    getById: (id) => fetchById('playlists', id),
    insert: (playlist) => insertEntity('playlists', playlist),
    update: (playlist) => updateEntity('playlists', playlist, 'PlaylistId'), // Ensure 'PlaylistId' is used here
    delete: (id) => deleteEntity('playlists', id),
};

// Playlist Track API
export const playlistTrackApi = {
    getAll: (params) => fetchAll('playlist-tracks', params),
    getById: (playlistId, trackId) => fetchById('playlist-tracks', `${playlistId}/${trackId}`),
    insert: (playlistTrack) => insertEntity('playlist-tracks', playlistTrack),
    update: (playlistTrack) => updateEntity('playlist-tracks', playlistTrack),
    delete: (playlistId, trackId) => deleteEntity('playlist-tracks', `${playlistId}/${trackId}`),
};
