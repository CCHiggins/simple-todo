import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict'

import { Tasks } from '../api/tasks';

import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
});

Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      //if hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
});

Template.body.events({
  'submit .new-task'(event) {
    //prevent the default form submit
    event.preventDefault();

    //get value from form
    const target = event.target;
    const text = target.text.value;

    //insert task into collection
    Tasks.insert({
      text,
      createdAt: new Date(), //current date!
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });

    target.text.value = '';
  },
  'change .hide-completed input'(event, instance){
    instance.state.set('hideCompleted', event.target.checked);
  },
})
