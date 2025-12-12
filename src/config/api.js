const BASE_URL = 'http://10.0.2.2:4000/api/rooms'; // Android Emulator

export default {
  CREATE_ROOM: `${BASE_URL}/create`,
  GET_ROOM: id => `${BASE_URL}/${id}`,
  GET_ROOMS: `${BASE_URL}/getAllRooms`,
  CHECK_ROOM_EXISTS: id => `${BASE_URL}/${id}/exists`,
  JOIN_ROOM: id => `${BASE_URL}/${id}/join`,
  LEAVE_ROOM: id => `${BASE_URL}/${id}/leave`,
  ADD_SONG: id => `${BASE_URL}/${id}/songs`,
  REMOVE_SONG: (id, title) => `${BASE_URL}/${id}/songs/${title}`,
  PLAYLIST: id => `${BASE_URL}/${id}/playlist`,
  SET_NOW: id => `${BASE_URL}/${id}/nowplaying`,
  GET_NOW_PLAYING: id => `${BASE_URL}/${id}/nowplaying`,
  SKIP: id => `${BASE_URL}/${id}/skip`,
  PARTICIPANTS: id => `${BASE_URL}/${id}/participants`,
  REMOVE_PARTICIPANT: id => `${BASE_URL}/${id}/removeParticipant`,
  PREV_SONG: id => `${BASE_URL}/${id}/previous`,
};
