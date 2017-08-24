'use strict';

const ROOMS = [
  {name: "Amoy", email: "thoughtworks.singapore+amoy@gmail.com", capacity: "12"},
  {name: "Queenstown", email: "thoughtworks.singapore+queenstown@gmail.com", capacity: "4"},
  {name: "Kampong Glam", email: "thoughtworks.singapore+kampong_glam@gmail.com", capacity: "4"},
  {name: "Serangoon", email: "thoughtworks.singapore+serangoon@gmail.com", capacity: "4"},
  {name: "Tiong Bahru", email: "thoughtworks.singapore+tiong_bahru@gmail.com", capacity: "6"},
  {name: "Event Space", email: "thoughtworks.singapore+event_space@gmail.com", capacity: "30"}
]

module.exports = {
  allRooms: function() {
    return ROOMS;
  },

  findByName: function(name) {
    return ROOMS.filter((room) => { return room.name.toUpperCase() == name.toUpperCase() })[0]
  },

  findById: function(id) {
    return ROOMS.filter((room) => { return room.id == id })[0]
  },

  findByIds: function(ids) {
    return ids.map( (id) => {
      return this.findById(id)
    })
  }
}
