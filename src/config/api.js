const BASE_URL = 'https://musicworld-be.onrender.com';
// const BASE_URL = 'http://10.0.2.2:4000';
export default {
  CREATE_ROOM: `${BASE_URL}/api/rooms/create`,
  GET_ROOM: id => `${BASE_URL}/api/rooms/${id}`,
  GET_ROOMS: `${BASE_URL}/api/rooms/getAllRooms`,
  CHECK_ROOM_EXISTS: id => `${BASE_URL}/api/rooms/${id}/exists`,
  JOIN_ROOM: id => `${BASE_URL}/api/rooms/${id}/join`,
  LEAVE_ROOM: id => `${BASE_URL}/api/rooms/${id}/leave`,
  ADD_SONG: id => `${BASE_URL}/api/rooms/${id}/songs`,
  REMOVE_SONG: (id, title) => `${BASE_URL}/api/rooms/${id}/songs/${title}`,
  PLAYLIST: id => `${BASE_URL}/api/rooms/${id}/playlist`,
  SET_NOW: id => `${BASE_URL}/api/rooms/${id}/nowplaying`,
  GET_NOW_PLAYING: id => `${BASE_URL}/api/rooms/${id}/nowplaying`,
  SKIP: id => `${BASE_URL}/api/rooms/${id}/skip`,
  PARTICIPANTS: id => `${BASE_URL}/api/rooms/${id}/participants`,
  REMOVE_PARTICIPANT: id => `${BASE_URL}/api/rooms/${id}/removeParticipant`,
  PREV_SONG: id => `${BASE_URL}/api/rooms/${id}/previous`,
  GET_ALL_SONGS: () => `${BASE_URL}/api/rooms/allsongs`,
  VERIFY_USER: () => `${BASE_URL}/api/user/verify`,
};
