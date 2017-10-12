import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks';

import './task.html';

Template.task.events({
  'click .toggle-checked'() {
    //set checked to opposite of what it currently is
    Tasks.update(this._id, {
      $set: { checked: ! this.checked },
    });
  },
  'click .delete'() {
    Tasks.remove(this._id);
  },
});
